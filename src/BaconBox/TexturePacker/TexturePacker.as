package BaconBox.TexturePacker {
import BaconBox.*;

import by.blooddy.crypto.image.PNGEncoder;

import flash.display.BitmapData;
import flash.filesystem.File;
import flash.filesystem.FileMode;
import flash.filesystem.FileStream;
import flash.geom.Matrix;
import flash.geom.Rectangle;
import flash.utils.ByteArray;



// Algorithm from http://www.blackpawn.com/texts/lightmaps/
// and https://github.com/lukaszdk/texture-atlas-generator
public class TexturePacker {
	private var _bitmapData:BitmapData;
	private var _root:Node;
	private var _padding:int = 5;
	private var _name:String;
	private var _nodes:Vector.<Node> = new Vector.<Node>();
	public function TexturePacker(name:String, width:int, height:int) {
		_bitmapData = new BitmapData(width, height, true,  0x00000000);
		_root = new Node(0,0, width, height);
		_name = name;
	}
	private function sortBySize(a, b):int
	{
		var areaA:int = a.bounds.width * a.bounds.height;
		var areaB:int = b.bounds.width * b.bounds.height;
		var result:int = areaA - areaB;
		if(result < 0){
			return 1;
		}
		else if(result > 0){
			return -1;
		}
		else{
			return 0;
		}

	}

	public function packTextures(textures:Vector.<TextureInfo>):void{
		textures.sort(sortBySize);
		for each(var texture:TextureInfo in textures){
			var node:Node = _root.insert(texture, _padding);
			if(node == null){
				throw new Error("Texture size is too small");
			}
			_nodes.push(node);
		}
		for each(var node in _nodes){
			_bitmapData.draw(node.textureInfo.bitmap, new Matrix(1, 0, 0, 1, node.rect.x, node.rect.y));
		}
	}

	public function getXMLData():Vector.<XML>{
		var xmlVector:Vector.<XML> = new Vector.<XML>();
		for each(var node in _nodes){
			var xml:XML = <SubTexture></SubTexture>
			xml.@name = node.textureInfo.name;
			xml.@registrationPointX = node.textureInfo.bounds.x;
			xml.@registrationPointY = node.textureInfo.bounds.y;
			xml.@x = node.rect.x;
			xml.@y = node.rect.y;
			xml.@width = node.rect.width;
			xml.@height = node.rect.height;
			xmlVector.push(xml);
		}
		return xmlVector;
	}

	public function savePNG(exportPath:File):void{
		var bytes:ByteArray = PNGEncoder.encode(_bitmapData);
		var fs:FileStream = new FileStream();
		fs.open(exportPath.resolvePath("./" + _name + ".png"), FileMode.WRITE);
		fs.writeBytes(bytes);
		fs.close();
	}

}

}
