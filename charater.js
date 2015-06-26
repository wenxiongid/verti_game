define([
  'event',
  'helper',
  'jquery'
], function(
  EV,
  Helper,
  $
){
  var Charater=function(canvas, option){
    var _this=this;
    _this.canvas=canvas;
    _this.ctx=_this.canvas.getContext('2d');
    _this.line='normal';
    _this.option=$.extend({
      speedBase: 1.5,
      speedTimes: 0.3,
      hitPoint: 100,
      width: 100,
      hegiht: 100
    }, option || {});
    _this.charaterX=_this.canvas.width/2;
    _this.charaterY=_this.canvas.hegiht - _this.option.hitPoint;
    _this.updateSpeed();
  };

  Charater.prototype.updateSpeed=function(){
    var _this=this;
    _this.speed=_this.option.speedBase*_this.option.speedTimes;
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
    _this.ctx.translate(0, 0);
    _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
    _this.ctx.beginPath();
    _this.ctx.fillStyle='#c45';
    _this.ctx.arc(_this.charaterX-50, _this.canvas.height - _this.option.hitPoint-50, 50, 0, 2 * Math.PI, true);
    _this.ctx.fill();
    _this.ctx.closePath();
  };

  return Charater;
});