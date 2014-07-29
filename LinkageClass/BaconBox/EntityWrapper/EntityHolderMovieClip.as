package BaconBox.EntityWrapper {
import flash.display.DisplayObject;
import flash.display.MovieClip;
public class EntityHolderMovieClip  extends MovieClip {
	private var _entity:Object = null;

    public function EntityHolderMovieClip() {
    	super();
        gotoAndStop(1);
    }

    public function get entity():Object {
        return _entity;
    }

    public function set entity(value:Object):void {
        _entity = value;
    }

    public function destroy():void{
        for(var i:int = 1; i<= totalFrames; i++){
            gotoAndStop(i);
            for(var j:int = 0; j < numChildren; j++){
                var temp:DisplayObject =  getChildAt(j);
                var child:EntityHolderMovieClip = (temp as EntityHolderMovieClip);
				var test:Object = null;
				if(child)  test = child.entity;
				if(child && child.entity)child.destroy();
            }
        }
        if(_entity){
            _entity.destroy();
		}
    }

}
}
