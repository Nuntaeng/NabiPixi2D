/**
*	@desc	スプライトで数字を出力させてくれる
*	@author	Heewon Kim (nuntaeng)
*/
class NabiSpriteAtlasNumber {

	constructor (jsonPath, letterWid, letterHei) {
		this.x = 0;
		this.y = 0;
		this.visible = true;
		this.text = "";
		this._sprites = {};
		this._parent = null;
		this._letter_wid = letterWid;
		this._letter_hei = letterHei;
		this._spritePack = PIXI.loader.resources[jsonPath].textures;
	}

	SetText(text) {
		this.text = text;
		this._sprites = {};

		var curXPoint = 0;
		for (var n in text) {
			var sprite = new PIXI.Sprite(this._spritePack[text[n] + ".png"]);
			sprite.x = this.x + curXPoint;
			sprite.y = this.y;
			sprite.visible = this.visible;
			curXPoint += this._letter_wid;
			this._parent.addChild(sprite);
			console.log("Atlas Printed! = " + n);
		}
	}

	SetParent(stage) {
		this._parent = stage;
	}

	SetPosition(x, y) {
		this.x = x;
		this.y = y;
	}
}