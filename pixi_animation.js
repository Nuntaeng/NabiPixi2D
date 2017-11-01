/**
 * @description JSONデータを通じてアニメーションを読み込んで再生します
 * @author Heewon Kim (nuntaeng)
 * @param {*アニメーションのjsonデータの経路} jsonPath
 * @param {*jsonの中に書いているフレームでかぶる画像名} spriteName
 * @param {*フレーム画像のエキステンション} extension
 * @param {*フレームが始まる番号} minIdx
 * @param {*フレームが終わる番号} maxIdx
 * @param {*フレーム間の間隔} frameTick
 */
class Animation {

  constructor (jsonPath, spriteName, extension, minIdx, maxIdx, frameTick) {
    
    // Variables 
    this._spritePack = PIXI.loader.resources[jsonPath].textures;
    this._sprites = new Array();
    this._currentIdx = minIdx;
    this._minIdx = minIdx;
    this._maxIdx = maxIdx;
    this._tick = 0;
    
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.texture = null;
    this.visible = true;

    // Constructure
    for (var i = this._minIdx; i <= this._maxIdx; ++i) {
      var frameName = spriteName + i + extension;
      var frame = new PIXI.Sprite(this._spritePack[frameName]);
      if (i != 0)
        frame.visible = false;
      this._sprites[i] = frame;
    }
    this.texture = this._sprites[0].texture;
  
    const ticker = new PIXI.ticker.Ticker();
    ticker.stop();
    ticker.add((deltaTime) => {
      for (var i in this._sprites) {
        this._sprites[i].x = this.x;
        this._sprites[i].y = this.y;
      }
  
      this._tick += deltaTime;
      if (this._tick > frameTick * ticker.FPS) {
        this.ChangeFrame();
        this._tick = 0;
      }
    });
    ticker.start();
  }

  // Method
  ChangeFrame() {
      for (var i in this._sprites) {
        if (i == this._currentIdx) {
          this._sprites[i].visible = this.visible;
          this.texture = this._sprites[i].texture;
        }
        else
        this._sprites[i].visible = false;
      }

      if (this._currentIdx >= this._maxIdx)
        this._currentIdx = 0;
      else
        this._currentIdx += 1;

      this.width = this.texture.width;
      this.height = this.texture.height;
  }

  /**
   * @description Stageにフレームたちを追加します
   * @param {*追加したいstage} stage
   */
  addChild(stage) {
    for (var i in this._sprites)
      stage.addChild(this._sprites[i]);
  }

  /**
   * @description 当たり判定をします
   * @returns 当たったらtrue
   */
  isCollide(other) {
    return this.x + this.width > other.x &&
           this.x < other.x + other.width &&
           this.y + this.height > other.y &&
           this.y < other.y + other.height;
  }
}







function AnimationStateManager(startAnimeName) {

  function SwitchStatus() {
    this.startAnimation = "";
    this.endAnimation = "";
    this.condition = "";
    this.valueName = "";
    this.figure = 0.0;
  }

  var variables = {},
      conditions = new Array(),
      animations = {},
      currentAnimationName = "";
  this.visible = true;
  this.debug_mode = false;
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;

  this.AddAnimation = function(name, animation) {
    animations[name] = animation;
    animations[name].visible = false;
  }

  this.GetCurrentAnimation = function() {
    return animations[currentAnimationName];
  }

  this.AddVariable = function(name, value) {
    variables[name] = value;
  }
  
  this.SetVariable = function(name, value) {
    variables[name] = value;
  }

  /**
   * @description 描画目録に追加します
   * @param {*描画目録} stage
   */
  this.addChild = function(stage) {
    for (var i in animations)
      animations[i].addChild(stage);
  }

  /**
   * @description アニメーション状態の移動条件を追加します
   * @param {*このアニメーションの時} startAnime
   * @param {*このアニメーションに差し替える} endAnime
   * @param {*この変数の状態によって判断する} valueName
   * @param {*この条件が当たった時} condition
   * @param {*この数値以上・以下の時のみ} figure
   */
  this.AddStatus = function(startAnime, endAnime, valueName, condition, figure) {
    var attribute = new SwitchStatus();
    attribute.startAnimation = startAnime;
    attribute.endAnimation = endAnime;
    attribute.condition = condition;
    attribute.valueName = valueName;
    attribute.figure = figure;
    conditions.push(attribute);
  }

  /**
   * @description  現在のアニメーションとの当たり判定をします。
   * @returns  当たったらtrue
   */
  this.isCollide = function(other) {
    return GetCurrentAnimation().isCollide(other);
  }

  this.Update = function() {

    animations[currentAnimationName].visible = this.visible;
    animations[currentAnimationName].x = this.x;
    animations[currentAnimationName].y = this.y;
    this.width = animations[currentAnimationName].width;
    this.height = animations[currentAnimationName].height;

    if (this.debug_mode) {
      console.log("Current Animation= " + currentAnimationName);
      for (var i in animations) {
        console.log(i + " / " + animations[i].visible);
      }
    }

    for (var a_i in animations) {
      if (a_i === currentAnimationName) {
        for (var c_i in conditions)
          if (conditions[c_i].startAnimation === currentAnimationName) {
            var conditionState = false;
            switch (conditions[c_i].condition) {
              case ">": conditionState = variables[conditions[c_i].valueName] > conditions[c_i].figure; break;
              case "<": conditionState = variables[conditions[c_i].valueName] < conditions[c_i].figure; break;
            }
            if (conditionState) {
              currentAnimationName = conditions[c_i].endAnimation;
              break;
            }
          }
        }
        else {
          animations[a_i].visible = false;
        }
      }
  }



  currentAnimationName = startAnimeName;

}
