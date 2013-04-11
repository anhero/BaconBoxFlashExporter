/**
 * Created with IntelliJ IDEA.
 * User: BerzerkJoe
 * Date: 10/04/13
 * Time: 10:30 AM
 * To change this template use File | Settings | File Templates.
 */
package BaconBox {
import flash.display.Loader;
import flash.display.MovieClip;
import flash.display.Sprite;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.events.IEventDispatcher;
import flash.filesystem.File;
import flash.net.URLRequest;
import flash.system.ApplicationDomain;
import flash.utils.getQualifiedClassName;

import mx.core.IMXMLObject;
import mx.utils.ObjectProxy;

[Bindable]
public class TextureAtlas extends EventDispatcher {
	private var _name:String = new String();
	private var _file:File;
	private var _fileProxy:ObjectProxy;
	private var _scale:Number;
	private var _width:int;
	private var _height:int;
	private var _loader:Loader = new Loader();
	private var _appDomain:ApplicationDomain;
	private var _textureHash:Dictionary = new Dictionary();
	private var _symbolHash:Dictionary = new Dictionary();

	public function TextureAtlas() {
		_name = "Unnamed";
		_width = 2048;
		_height = 2048;
		_scale = 1;
	}

	public function loadFromFile(file:File):void{
		_file = file;
		_fileProxy = new ObjectProxy(file);
		if(file.extension == "json"){
			loadFromJson(file);
		}
		else if(file.extension == "swf"){
			loadFromSWF(file);
		}
	}
	private function loadFromJson(file:File):void{
		trace("Loading", file.name, "as json");
	}

	private function loadFromSWF(file:File):void{
		_name = file.name.split('.')[0];
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
		});
	}

	private function pushClassDef(classDef:Object):void {
		var object:Object = new classDef;
		var className:String = getQualifiedClassName(object);
		var shortClassName:String = className.split("::")[1];
		if(shortClassName == null || shortClassName == ""){
			shortClassName = className;
		}
		if(shortClassName != "EntityHolderMovieClip" && shortClassName != "EntityHolderTextField" ){
			if(object is MovieClip || object is Sprite){
				if(_symbolHash.isEmpty() || _textureHash.contains(className)){
					_textureHash.setValue(className, new ObjectProxy({className:className, shortClassName:shortClassName, classDef:classDef}));
				}
				else if(_symbolHash.contains(className)){
					_symbolHash.setValue(className, new ObjectProxy({className:className, shortClassName:shortClassName, classDef:classDef}));
				}
			}
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
		_width = value;
	}

	public function get height():int {
		return _height;
	}

	public function set height(value:int):void {
		_height = value;
	}

	public function get scale():Number {
		return _scale;
	}

	public function set scale(value:Number):void {
		_scale = value;
	}

	public function get file():File {
		return _file;
	}

	public function set file(value:File):void {
		_file = value;
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
}
}


