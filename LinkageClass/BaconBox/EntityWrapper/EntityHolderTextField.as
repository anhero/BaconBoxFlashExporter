 package BaconBox.EntityWrapper {
import BaconBox.EntityWrapper.EntityHolderMovieClip;
import flash.text.TextField;
public class EntityHolderTextField  extends BaconBox.EntityWrapper.EntityHolderMovieClip {
	private var _entity:Object = null;
    public function EntityHolderTextField() {
    	super();
    }


	public function get textField():TextField {

		return this.getChildByName("text") as TextField;
	}


}
}
