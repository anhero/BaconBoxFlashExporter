package BaconBox {
import BaconBox.TexturePacker.TextureInfo;

import flash.display.BitmapData;

import flash.display.DisplayObject;
import flash.display.DisplayObjectContainer;
import flash.display.MovieClip;
import flash.display.Sprite;
import flash.geom.ColorTransform;
import flash.geom.Matrix;
import flash.geom.Rectangle;
import flash.text.TextField;
import flash.text.TextFormat;
import flash.utils.getQualifiedClassName;
import flash.utils.getQualifiedSuperclassName;

import mx.core.UITextFormat;

import spark.effects.Scale;

public class Element {
	private var _className:String;
	private var _shortClassName:String;
	private var _classDef;
	private var _blend:Boolean;

	private static const edgeMarginRender:int = 2;
	private static const edgeMarginOutput:int = 0;

	public function Element(className:String,  shortClassName:String, classDef, blend:Boolean = true) {
		_className =  className;
		_shortClassName = shortClassName;
		_classDef = classDef;
		_blend = blend;
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
		textureInfo.bounds = bounds		;
		textureInfo.blend = _blend;

		return textureInfo;
	}

	public function getSymbolXML():XML{
		var symbol:DisplayObjectContainer = new _classDef;
		var xml:XML = <Symbol></Symbol>;
		xml.@className = _className;
		var text:TextField = symbol.getChildByName("text") as TextField;
		if(text){
			var tfFormat:TextFormat = text.defaultTextFormat;
			xml.@textfield =  true;
			xml.@fontSize = tfFormat.size;
			xml.@text =  text.text;
			xml.@font =  tfFormat.font;
			xml.@alignment =  tfFormat.align;
			xml.@width = text.width;
			xml.@height = text.height;
			var color:uint = text.textColor;
			var red:int = (( color >> 16 ) & 0xFF);
			var green:int = (( color >> 8 ) & 0xFF);
			var blue:int = (color & 0xFF);
			xml.@color = [red,green,blue];

		}
		else{
			var mc:MovieClip = symbol as MovieClip;
			var mcType:String = getQualifiedSuperclassName(classDef).split("::")[1];
			// If ever we want to export the linkage class.
			// We could even get the fully qualified linkage class by not splitting to ::
			// xml.@linkage = mcType
			// If ever we need to be pedantic and specify false
			// xml.@autoPlay = false

			// When movieclip is linked as MovieClipAuto we want to autoplay
			// This string type checking /will/ break if we make another linkage type that
			// inherits from EntityHolderMovieClipAuto. We will need to actually import the linkage
			// classes in the exporter instead of working with strings to check with the "is" operator.
			if (mcType == "EntityHolderMovieClipAuto") {
				xml.@autoPlay = true
			}
				xml.@frameCount = mc.totalFrames;
				if(mc){
					var labels:Array = mc.currentLabels;
					var labelsXML:XML = <labels></labels>;
					for each(var label in labels){
						var labelXML:XML = <label></label>;
						var labelMC:MovieClip = new _classDef as MovieClip;
						labelXML.@name =  label.name;
						labelXML.@startFrame =  label.frame -1;

						for(var frame:int = label.frame; frame <= labelMC.totalFrames; frame++){
							labelMC.gotoAndStop(frame);
							if(labelMC.currentLabel != label.name){
								labelXML.@endFrame = frame -2;
								break;
							}
							else if(frame == labelMC.totalFrames){
								labelXML.@endFrame = frame -1;
							}
						}
						xml.appendChild(labelXML);
					}
//					if(labels.length) xml.appendChild(labelsXML);
				}



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
					childXML.@className = getQualifiedClassName(child).replace("::", ".");
					if(childXML.@className == "flash.display.Shape") throw Error("Found a flash.display.Shape in the children of " + xml.@className);
					var m:Matrix = child.transform.matrix;
					childXML.@a = m.a;
					childXML.@b = m.b;
					childXML.@c = m.c;
					childXML.@d = m.d;
					childXML.@tx = m.tx;
					childXML.@ty = m.ty;
					var ct:ColorTransform = child.transform.colorTransform;
					if(ct.redOffset != 0 || ct.greenOffset != 0 || ct.blueOffset != 0 || ct.alphaOffset != 0 ||
							ct.redMultiplier != 1 || ct.greenMultiplier != 1 || ct.blueMultiplier!= 1 || ct.alphaMultiplier!= 1){
						childXML.@colorTransform = [ct.redMultiplier, ct.redOffset, ct.greenMultiplier, ct.greenOffset, ct.blueMultiplier, ct.blueOffset, ct.alphaMultiplier, ct.alphaOffset];
					}
					//childXML.@color = child.transform.colorTransform.color;
				}

			}
		}
	  	return xml;
	}

	public function get blend():Boolean {
		return _blend;
	}

	public function set blend(value:Boolean):void {
		_blend = value;
	}
}
}
