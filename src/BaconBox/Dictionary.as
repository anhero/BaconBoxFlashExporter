package BaconBox {
public class Dictionary {
	private var _internalDictionary:Object = {};
	private var _size:int = 0;
	public function Dictionary(){

	}

	public function isEmpty():Boolean{
		return _size == 0;
	}

	public function setValue(key:String, value:Object):void{
		if(_internalDictionary[key] != undefined || value === null){
			_size++;
		}
		_internalDictionary[key] = value;
	}

	public function getValue(key:String):Object{
		return _internalDictionary[key];
	}

	public function removeValue(key:String):void{
		if(_internalDictionary[key] != undefined){
			_size--;
			delete  _internalDictionary[key];
		}
	}

	public function clearDictionary():void{
		_internalDictionary = {};
		_size = 0;
	}

	public function contains(key:String):Boolean{
		return !(_internalDictionary[key] === undefined);
	}

	public function get internalDictionary():Object {
		return _internalDictionary;
	}

	public function set internalDictionary(value:Object):void {
		_internalDictionary = value;
	}
}
}
