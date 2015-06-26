define([
  'jquery'
], function(
  $
){
  var Path=function(canvas, charater, option){
    var _this=this;
    _this.canvas=canvas;
    _this.charater=charater;
    _this.nodes={};
    _this.width=canvas.width;
    _this.gap=1000;//test
    _this.ctx=_this.canvas.getContext('2d');
    _this.offset=0;
    _this.option=$.extend({
      lineInfo:[]
    }, option || {});
  };

  Path.prototype.draw=function(d_offset){
    var _this=this,
      offset=_this.offset+d_offset,
      currentPoint=_this.canvas.height - (-(offset % _this.gap) + _this.gap);
    _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
    _this.offset=offset;
    _this.ctx.strokeStyle='#000';
    _this.ctx.lineWidth=5;

    // draw nodes
    var new_nodes=[],
      node_info;
    while(_this.nodes.length){
      node_info=_this.nodes.splice(0,1)[0];
      if(!_this.checkHit(node_info)){
        if(node_info.offset>=_this.offset){
          new_nodes.push(node_info);
          if(node_info.offset<=_this.offset+_this.canvas.height){
            _this.ctx.fillRect(node_info.line - 10, _this.canvas.height - (node_info.offset - _this.offset) - 20, 20, 20);
          }
        }
      }
    }
    _this.nodes=new_nodes;

    // draw lines
    currentPoint=Math.round(currentPoint);
    _this.ctx.translate(0, 0);
    _this.ctx.beginPath();
    while(currentPoint>0){
      _this.ctx.moveTo(0, currentPoint);
      _this.ctx.lineTo(_this.canvas.width, currentPoint);
      currentPoint-=_this.gap;
    }
    _this.ctx.stroke();
    _this.ctx.closePath();
  };

  Path.prototype.addNode=function(lineIndex, offset, type){
    var _this=this;
    _this.nodes.push({
      line: lineIndex,
      offset: offset,
      type: type
    });
  };

  Path.prototype.checkHit=function(nodeInfo){
    var _this=this,
      isHit=false;
    _this.hitPoint={
      x: _this.charater.charaterX,
      y: _this.offset + _this.charater.option.hitPoint
    };
    if(nodeInfo.offset<=_this.hitPoint.y &&
        nodeInfo.offset>=_this.hitPoint.y - _this.charater.option.height &&
        nodeInfo.line>= _this.hitPoint.x-_this.charater.option.width/2 &&
        nodeInfo.line<= _this.hitPoint.x+_this.charater.option.width/2){
      isHit=true;
      _this.charater.hit();
    }
    return isHit;
  };

  return Path;
});