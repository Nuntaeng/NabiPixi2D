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
function Animation (jsonPath, spriteName, extension, minIdx, maxIdx, frameTick) {

  // Filed
  var spritePack = PIXI.loader.resources[jsonPath].textures;
  var sprites = new Array();
  var currentIdx = minIdx;
  var minIdx = minIdx;
  var maxIdx = maxIdx;
  
  this.show = true;
  this.x = 0;
  this.y = 0;
  this.texture = null;

  // Method
  this.ChangeFrame = function() {
      for (var i in sprites) {
        if (i == currentIdx) {
          console.log(i + "x: " + sprites[i].x + " / y: " + sprites[i].y + " " + this.show);
          sprites[i].visible = this.show;
          this.texture = sprites[i].texture;
        }
        else
          sprites[i].visible = false;
      }

      if (currentIdx >= maxIdx)
        currentIdx = 0;
      else
        currentIdx += 1;
  }

  /**
   * @description 位置などの情報を変更する事があったらUpdateで呼んでください
   */
  this.Sync = function() {
    for (var i in sprites) {
      sprites[i].x = this.x;
      sprites[i].y = this.y;
    }
  }

  /**
   * @description Stageにフレームたちを追加します
   * @param {*追加したいstage} stage
   */
  this.addChild = function(stage) {
    for (var i in sprites)
      stage.addChild(sprites[i]);
  }

  // Constructure
  for (var i = minIdx; i <= maxIdx; ++i) {
    var frameName = spriteName + i + extension;
    var frame = new PIXI.Sprite(spritePack[frameName]);
    sprites[i] = frame;
    if (i != 0)
      sprites[i].visible = false;
  }
  this.texture = sprites[0].texture;
  setInterval(this.ChangeFrame, frameTick);
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
  this.x = 0;
  this.y = 0;

  this.AddAnimation = function(name, animation) {
    animations[name] = animation;
    animations[name].show = false;
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

  this.addChild = function(stage) {
    for (var i in animations)
      animations[i].addChild(stage);
  }

  this.AddStatus = function(startAnime, endAnime, valueName, condition, figure) {
    var attribute = new SwitchStatus();
    attribute.startAnimation = startAnime;
    attribute.endAnimation = endAnime;
    attribute.condition = condition;
    attribute.valueName = valueName;
    attribute.figure = figure;
    conditions.push(attribute);
  }

  this.Update = function() {

    animations[currentAnimationName].show = this.visible;
    animations[currentAnimationName].x = this.x;
    animations[currentAnimationName].y = this.y;
    console.log(currentAnimationName);

    for (var a_i in animations) {
      animations[a_i].Sync();
      if (a_i === currentAnimationName)
        for (var c_i in conditions)
          if (conditions[c_i].startAnimation === currentAnimationName) {
            var conditionState = false;
            switch (conditions[c_i].condition) {
              case ">": conditionState = variables[conditions[c_i].valueName] > conditions[c_i].figure; break;
              case "<": conditionState = variables[conditions[c_i].valueName] < conditions[c_i].figure; break;
            }
            if (conditionState) {
              currentAnimationName = conditions[c_i].endAnimation;
              console.log("Changed! " + currentAnimationName);
              break;
            }
          }
        else {
          animations[a_i].show = false;
        }
      }
  }



  currentAnimationName = startAnimeName;

}
