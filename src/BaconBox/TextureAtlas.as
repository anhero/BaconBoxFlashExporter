/**
 * Created with IntelliJ IDEA.
 * User: BerzerkJoe
 * Date: 10/04/13
 * Time: 10:30 AM
 * To change this template use File | Settings | File Templates.
 */
package BaconBox {
import BaconBox.TexturePacker.TextureInfo;
import BaconBox.TexturePacker.TexturePacker;

import flash.desktop.NativeApplication;

import flash.display.Loader;
import flash.display.MovieClip;
import flash.display.Sprite;
import flash.display3D.textures.TextureBase;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.events.IEventDispatcher;
import flash.filesystem.File;
import flash.filesystem.FileMode;
import flash.filesystem.FileStream;
import flash.net.URLRequest;
import flash.system.ApplicationDomain;
import flash.utils.getQualifiedClassName;

import mx.core.IMXMLObject;
import mx.utils.ObjectProxy;

[Bindable]
public class TextureAtlas extends EventDispatcher {
	private var _name:String = new String();
	private var _file:File;
	private var _loadedFromJson:Boolean;
	private var _loadFile:File;
	private var _fileProxy:ObjectProxy;
	private var _scale:Number;
	private var _width:int;
	private var _height:int;
	private var _textureFormat:String;
	private var _loader:Loader = new Loader();
	private var _appDomain:ApplicationDomain;


	private var _textures:Array = new Array();
	private var _symbols:Array = new Array();
	private var _opaqueTextures:Array = new Array();

	private var _textureHash:Dictionary = new Dictionary();
	private var _symbolHash:Dictionary = new Dictionary();
	private var _error:String;

	private var _exportPath:File;
    private var _finishedLoading:Boolean;
	private var _exportCallback:Function;
	public function TextureAtlas() {
		_name = "Unnamed";
		_width = 2048;
		_height = 2048;
		_scale = 1;
		_textureFormat = "RGBA";
        _finishedLoading = false;
		_loadedFromJson = false;
	}

	public function destroy():void{
		if(_loader)_loader.unload();
	}

	public function unload():void{
		if(_loader)_loader.unload();
		_textureHash = new Dictionary();
		_symbolHash = new Dictionary();
	}

	public static function loadFromJson(file:File): Array{
		var textureAtlasArray:Array = new Array();
		var fileStream:FileStream = new FileStream();
		fileStream.open(file, FileMode.READ);
		var jsonData:String = fileStream.readUTFBytes(fileStream.bytesAvailable);
		fileStream.close()
		var jsonObject:Object = JSON.parse(jsonData);
		for each(var textureName:String in jsonObject.textureNames){
			var textureAtlas:TextureAtlas = new TextureAtlas();
			textureAtlas._loadFile = file;
			textureAtlas.name = textureName;
			textureAtlas._loadedFromJson = true;
			var textureAtlasJson:Object = jsonObject.textureAtlas[textureName];
			if(textureAtlasJson.width)textureAtlas.width  = textureAtlasJson.width;
			if(textureAtlasJson.height)textureAtlas.height  = textureAtlasJson.height;
			if(textureAtlasJson.scale)textureAtlas.scale  = textureAtlasJson.scale;
			if(textureAtlasJson.textureFormat)textureAtlas.textureFormat  = textureAtlasJson.textureFormat;
			for each(var key:String in textureAtlasJson["textures"]){
				textureAtlas.textures.push(key);
			}
			for each(var key:String in textureAtlasJson["opaqueTextures"]){
				textureAtlas.textures.push(key);
				textureAtlas.opaqueTextures.push(key);
			}
			for each(var key:String in textureAtlasJson["symbols"]){
				textureAtlas.symbols.push(key);
			}
			textureAtlas.file = new File((file.nativePath.substr(0, file.nativePath..lastIndexOf('.'))) + ".swf");
            if(!textureAtlas.file.exists){
				textureAtlas.file = new File(jsonObject.swfName);
				if(!textureAtlas.file.exists){
					throw Error("Can't find the swf associated with this json file: " + file.name);
				}
			}
			textureAtlasArray.push(textureAtlas);
		}
		return textureAtlasArray;
	}

	private function localLoadFromSWF(file:File, callback:Function):void{
		_file = file
		//Should load this stuff with a filestream and Loader.loadBytes.
		//It would make it easier to load a SWC if we want to support it in the future.
		//(We could still unzip it in a temp folder, but this would be inelegant and a bit slower).
		_loader.load(new URLRequest("file:///" + file.nativePath));

		_loader.contentLoaderInfo.addEventListener(Event.COMPLETE,
				function (event:Event){
					_appDomain = event.target.applicationDomain;

					var classNames = _appDomain.getQualifiedDefinitionNames();
					for each(var className:String in classNames){
						pushClassDef(_appDomain.getDefinition(className));
					}
                    _finishedLoading = true;
					callback();
//                    dispatchEvent(event);
				});
	}

	private function pushClassDef(classDef:Object):void {
		var object:Object = new classDef;
		var className:String = getQualifiedClassName(object).replace("::",'.');
		var shortClassName:String = className.split("::")[1];
		if(shortClassName == null || shortClassName == ""){
			shortClassName = className;
		}
		if(shortClassName != "EntityHolderMovieClip" && shortClassName != "EntityHolderTextField" ){
			if(object is MovieClip || object is Sprite){
				if((_symbols.length == 0 && !_loadedFromJson) || _textures.indexOf(className) != -1 ){
					_textureHash.setValue(className, new ObjectProxy(new Element(className, shortClassName, classDef, (_opaqueTextures.indexOf(className) == -1 ))));
				}
				else if(_symbols.indexOf(className)  != -1 ){
					_symbolHash.setValue(className, new ObjectProxy(new Element(className, shortClassName, classDef)));
				}
			}
		}
	}

	private function exportCallback():void{
		try{
			var texturePacker:TexturePacker = new TexturePacker(name, width, height);
			var textures:Vector.<TextureInfo> = new Vector.<TextureInfo>;
			for each (var element:Object in textureHash.internalDictionary){
				var textureInfo = element.getTextureInfo(_scale);
				textures.push(textureInfo);
			}
			texturePacker.packTextures(textures);
			texturePacker.savePNG(_exportPath);

			saveXML(_exportPath, texturePacker);
			_exportCallback(true);
		}
		catch(err:Error){
			_error = "Error exporting texture named: " + _name + " Error: " + err.message;
			_exportCallback(false);

		}
	}

	public function export(exportPath:File, callback:Function = null):void {
		_exportPath = exportPath;
		localLoadFromSWF(_file, exportCallback);
		_exportCallback = callback;

	}

	public function saveXML(exportPath:File, texturePacker:TexturePacker):void{
		var textureSheetXML = <TextureSheet></TextureSheet>;
		var symbolsXML:XML = <Symbols></Symbols>;
		var textureXML:XML =<Texture></Texture>;
		textureXML.@name= _name;
		textureXML.@path= _name + ".png";
		textureXML.@scale = _scale;
		textureXML.@textureFormat = this.textureFormat;
		textureSheetXML.appendChild(textureXML);
		textureSheetXML.appendChild(symbolsXML);

		var subtexturesXML:Vector.<XML> = texturePacker.getXMLData();
		for each (var subtextureXML:XML in subtexturesXML){
			textureXML.appendChild(subtextureXML);
		}

		var translationsXML = <translations></translations>;

		for each (var element:Object in symbolHash.internalDictionary){
			var elementXML:XML = element.getSymbolXML();
			if(elementXML.@textfield == true){
				var translationXML = <translation></translation>;
				translationXML.@key = elementXML.@className;
				translationXML.@text = elementXML.@text;
				translationsXML.appendChild(translationXML);
			}
			symbolsXML.appendChild(elementXML);
		}


		var fs:FileStream = new FileStream();
		fs.open(exportPath.resolvePath("./" + _name + ".xml"), FileMode.WRITE);
		fs.writeUTFBytes(textureSheetXML);
		fs.close();
		if(translationsXML.children().length()){
			fs.open(exportPath.resolvePath("./" + _name + "_TRANSLATION_DEFAULT.xml"), FileMode.WRITE);
			fs.writeUTFBytes(translationsXML);
			fs.close();
		}


	}

	public function get name():String {
		return _name;
	}
	public function set name(value:String):void {
		_name = value;
	}

	public function get width():int {
		return _width;
	}

	public function set width(value:int):void {
		if(_loadedFromJson){
			var fileStream:FileStream = new FileStream();
			fileStream.open(_loadFile, FileMode.READ);
			var jsonData:String = fileStream.readUTFBytes(fileStream.bytesAvailable);
			var jsonObject:Object = JSON.parse(jsonData);
			var textureAtlasJson:Object = jsonObject.textureAtlas[_name];
			textureAtlasJson.width = value;
			fileStream.close();
			fileStream.open(_loadFile, FileMode.WRITE);
			fileStream.writeUTFBytes(JSON.stringify(jsonObject));
			fileStream.close();
			;
		}
		_width = value;
	}

	public function get height():int {
		return _height;
	}

	public function set height(value:int):void {
		if(_loadedFromJson){
			var fileStream:FileStream = new FileStream();
			fileStream.open(_loadFile, FileMode.READ);
			var jsonData:String = fileStream.readUTFBytes(fileStream.bytesAvailable);
			var jsonObject:Object = JSON.parse(jsonData);
			var textureAtlasJson:Object = jsonObject.textureAtlas[_name];
			textureAtlasJson.height = value;
			fileStream.close();
			fileStream.open(_loadFile, FileMode.WRITE);
			fileStream.writeUTFBytes(JSON.stringify(jsonObject));
			fileStream.close();
			;
		}
		_height = value;
	}

	public function get scale():Number {
		return _scale;
	}

	public function set scale(value:Number):void {
		if(_loadedFromJson){
			var fileStream:FileStream = new FileStream();
			fileStream.open(_loadFile, FileMode.READ);
			var jsonData:String = fileStream.readUTFBytes(fileStream.bytesAvailable);
			var jsonObject:Object = JSON.parse(jsonData);
			var textureAtlasJson:Object = jsonObject.textureAtlas[_name];
			textureAtlasJson.scale = value;
			fileStream.close();
			fileStream.open(_loadFile, FileMode.WRITE);
			fileStream.writeUTFBytes(JSON.stringify(jsonObject));
			fileStream.close();
		}
		_scale = value;
	}

	public function get file():File {
		return _file;
	}

	public function set file(value:File):void {
		_file = value;
		_fileProxy = new ObjectProxy(_file);
	}

	public function get fileName():String {
		return _fileProxy.name;
	}

	public function set fileName(value:String):void {
		_fileProxy.name = value;
	}

	public function get textureHash():Dictionary {
		return _textureHash;
	}

	public function set textureHash(value:Dictionary):void {
		_textureHash = value;
	}

	public function get symbolHash():Dictionary {
		return _symbolHash;
	}

	public function set symbolHash(value:Dictionary):void {
		_symbolHash = value;
	}

	public function get opaqueTextures():Array {
		return _opaqueTextures;
	}

	public function set opaqueTextures(value:Array):void {
		_opaqueTextures = value;
	}

    public function get finishedLoading():Boolean {
        return _finishedLoading;
    }

	public function get error():String {
		return _error;
	}

	public function get loadFile():File {
		return _loadFile;
	}

	public function get loadedFromJson():Boolean {
		return _loadedFromJson;
	}

	public function set loadedFromJson(value:Boolean):void {
		_loadedFromJson = value;
	}

	public function get textures():Array {
		return _textures;
	}

	public function set textures(value:Array):void {
		_textures = value;
	}

	public function get symbols():Array {
		return _symbols;
	}

	public function set symbols(value:Array):void {
		_symbols = value;
	}

	public function get textureFormat():String {
		return _textureFormat;
	}

	public function set textureFormat(value:String):void {
		if(_loadedFromJson){
			var fileStream:FileStream = new FileStream();
			fileStream.open(_loadFile, FileMode.READ);
			var jsonData:String = fileStream.readUTFBytes(fileStream.bytesAvailable);
			var jsonObject:Object = JSON.parse(jsonData);
			var textureAtlasJson:Object = jsonObject.textureAtlas[_name];
			textureAtlasJson.textureFormat = value;
			fileStream.close();
			fileStream.open(_loadFile, FileMode.WRITE);
			fileStream.writeUTFBytes(JSON.stringify(jsonObject));
			fileStream.close();
		}
		_textureFormat = value;
	}
}
}


