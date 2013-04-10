/**
 * Created with IntelliJ IDEA.
 * User: BerzerkJoe
 * Date: 10/04/13
 * Time: 10:30 AM
 * To change this template use File | Settings | File Templates.
 */
package BaconBox {
import flash.events.EventDispatcher;
import flash.events.IEventDispatcher;
import flash.filesystem.File;
import flash.system.ApplicationDomain;

import mx.core.IMXMLObject;

[Bindable]
public class TextureAtlas extends EventDispatcher {
	private var _symbols:Array = new Array();
	private var _textures:Array= new Array();
	private var _name:String = new String();
	private var _file:File
	private var _scale:Number;
	private var _width:int;
	private var _height:int;

	public function TextureAtlas() {
		_name = "Unnamed";
		_width = 2048;
		_height = 2048;
		_scale = 1;
	}

	public function loadFromFile(file:File):void{
		_file = file;
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
	}
	private function loadSWF(swf:File):ApplicationDomain {

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

	public function get name():String {
		return _name;
	}

	public function set name(value:String):void {
		_name = value;
	}

	public function get file():File {
		return _file;
	}

	public function set file(value:File):void {
		_file = value;
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
}
}
