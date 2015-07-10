define([
  'event',
  'helper',
  'jquery'
], function(
  EV,
  Helper,
  $
){
  var Charater=function(el, option){
    var _this=this;
    _this.$el=$(el);
    _this.line='normal';
    _this.option=$.extend({
      speed: 0.5,
      hitPoint: 200,
      width: 100,
      height: 100,
      zoom: 1,
      stageHeight: 0
    }, option || {});
    _this.zoom=_this.option.zoom;
    _this.stageHeight=_this.option.stageHeight;
    _this.charaterX=0;
    _this.charaterY=0;
    _this.speed=_this.option.speed;
    _this.point=0;
  };

  Charater.prototype.moveTo=function(x, y){
    var _this=this;
    if(!x){
      x=_this.charaterX;
    }
    if(!y){
      y=_this.charaterY;
    }
    _this.charaterX=x;
    _this.charaterY=y;
    _this.$el.css({
      '-webkit-transform':'scale('+_this.zoom+') translate3d('+(_this.charaterX - _this.option.width / 2) +'px, '+(_this.stageHeight - _this.option.hitPoint)+'px, 0px)',
      '-moz-transform':'scale('+_this.zoom+') translate3d('+(_this.charaterX - _this.option.width / 2) +'px, '+(_this.stageHeight - _this.option.hitPoint)+'px, 0px)',
      '-o-transform':'scale('+_this.zoom+') translate3d('+(_this.charaterX - _this.option.width / 2) +'px, '+(_this.stageHeight - _this.option.hitPoint)+'px, 0px)',
      '-ms-transform':'scale('+_this.zoom+') translate3d('+(_this.charaterX - _this.option.width / 2) +'px, '+(_this.stageHeight - _this.option.hitPoint)+'px, 0px)',
      'transform':'scale('+_this.zoom+') translate3d('+(_this.charaterX - _this.option.width / 2) +'px, '+(_this.stageHeight - _this.option.hitPoint)+'px, 0px)'
    });
    _this.hitRect={
      x: (_this.charaterX - _this.option.width / 2) * _this.zoom,
      y: (_this.stageHeight - _this.option.hitPoint) * _this.zoom,
      w: _this.option.width * _this.zoom,
      h: _this.option.height * _this.zoom
    };
    // _this.ctx.translate(0, 0);
    // _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
    // _this.ctx.beginPath();
    // _this.ctx.fillStyle='#c45';
    // _this.ctx.arc(_this.charaterX, _this.canvas.height - _this.option.hitPoint + _this.option.height / 2, _this.option.height/2, 0, 2 * Math.PI, true);
    // _this.ctx.fill();
    // _this.ctx.closePath();
  };

  return Charater;
});