package BaconBox {
import BaconBox.TexturePacker.TextureInfo;

import flash.display.BitmapData;

import flash.display.DisplayObject;
import flash.display.DisplayObjectContainer;
import flash.display.MovieClip;
import flash.geom.Matrix;
import flash.geom.Rectangle;
import flash.utils.getQualifiedClassName;
import flash.utils.getQualifiedSuperclassName;

import spark.effects.Scale;

public class Element {
	private var _className:String;
	private var _shortClassName:String;
	private var _classDef;

	private static const edgeMarginRender:int = 2;
	private static const edgeMarginOutput:int = 0;

	public function Element(className:String,  shortClassName:String, classDef) {
		_className =  className;
		_shortClassName = shortClassName;
		_classDef = classDef;
	}

	public function get className():String {
		return _className;
	}

	public function set className(value:String):void {
		_className = value;
	}

	public function get shortClassName():String {
		return _shortClassName;
	}

	public function set shortClassName(value:String):void {
		_shortClassName = value;
	}

	public function get classDef():* {
		return _classDef;
	}

	public function set classDef(value):void {
		_classDef = value;
	}

	//Inspired by the grapefrukt exporter (https://github.com/grapefrukt/grapefrukt-export)
	public function getTextureInfo(scale:Number):TextureInfo{
		var sprite:DisplayObject = (new classDef) as DisplayObject;
		var textureInfo:TextureInfo = new TextureInfo();

		var bounds:Rectangle = sprite.getBounds(sprite);

		bounds.x 		*= scale;
		bounds.y 		*= scale;
		bounds.width 	*= scale;
		bounds.height 	*= scale


		bounds.x = 		Math.floor(bounds.x) 		- edgeMarginRender;
		bounds.y = 		Math.floor(bounds.y) 		- edgeMarginRender;
		bounds.height = Math.ceil(bounds.height) 	+ edgeMarginRender * 2;
		bounds.width = Math.ceil(bounds.width) 		+ edgeMarginRender * 2;


		var bitmap:BitmapData = new BitmapData(bounds.width, bounds.height, true, 0x00000000);
		var matrix:Matrix = new Matrix();
		matrix.translate( -bounds.x / scale, -bounds.y / scale);
		matrix.scale(scale, scale);

		bitmap.draw(sprite, matrix, sprite.transform.colorTransform);


		var crop_rect:Rectangle = bitmap.getColorBoundsRect(0xffffffff, 0x00000000, false);

		crop_rect.x 		-= edgeMarginOutput;
		crop_rect.y		 	-= edgeMarginOutput;
		crop_rect.width 	+= edgeMarginOutput * 2;
		crop_rect.height 	+= edgeMarginOutput * 2;

		if(crop_rect.width != 0 && crop_rect.height != 0){
			var crop_bitmap:BitmapData = new BitmapData(crop_rect.width, crop_rect.height, true, 0x00000000);
			crop_bitmap.draw(bitmap, new Matrix(1, 0, 0, 1, -crop_rect.x, -crop_rect.y));
			bitmap = crop_bitmap
			bounds.x += crop_rect.x;
			bounds.y += crop_rect.y;
			bounds.width = crop_rect.width;
			bounds.height = crop_rect.height;
		}



		textureInfo.name = _className;
		textureInfo.bitmap = bitmap;
		textureInfo.bounds = bounds;

		return textureInfo;
	}

	public function getSymbolXML():XML{
		var symbol:DisplayObjectContainer = new _classDef;
		var xml:XML = <Symbol></Symbol>;
		xml.@classname = _className;
		var mc:MovieClip = symbol as MovieClip;
		if(mc)xml.@frameCount = mc.totalFrames;

		var frameLimit = (mc ? mc.totalFrames : 1);
		for(var frame:int = 1; frame <= frameLimit; frame++){
			var frameXML:XML = <Frame></Frame>;
			frameXML.@index=frame-1;
			xml.appendChild(frameXML);

			if(mc)mc.gotoAndStop(frame);
			for (var childIndex:int = 0; childIndex < symbol.numChildren; childIndex++) {
				var childXML:XML = <Child></Child>;
				frameXML.appendChild(childXML);
				var child:DisplayObject = symbol.getChildAt(childIndex);
				childXML.@name = child.name;
				childXML.@classname = getQualifiedClassName(child).replace("::", ".");
				var m:Matrix = child.transform.matrix;
				childXML.@a = m.a;
				childXML.@b = m.b;
				childXML.@c = m.c;
				childXML.@d = m.d;
				childXML.@tx = m.tx;
				childXML.@ty = m.ty;

				childXML.@color = child.transform.colorTransform.color;
			}

		}
	  	return xml;
	}
}
}
