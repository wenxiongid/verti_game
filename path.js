define([
  'jquery'
], function(
  $
){
  var Path=function(wrapper, charater, option){
    var _this=this;
    _this.$wrapper=$(wrapper);
    // _this.canvas=canvas;
    _this.charater=charater;
    _this.nodes=[];
    // _this.width=canvas.width;
    _this.gap=1000;//test
    // _this.ctx=_this.canvas.getContext('2d');
    _this.offset=0;
    _this.option=$.extend({
      width: 0,
      height: 0,
      hitPoint: 0,
      zoom: 1
    }, option || {});
    _this.width=_this.option.width;
    _this.height=_this.option.height;
    _this.zoom=_this.option.zoom;
    _this.offset=0;
  };

  Path.prototype.draw=function(d_offset){
    var _this=this,
      offset=_this.offset+d_offset,
      currentPoint=_this.height - (-(offset % _this.gap) + _this.gap);
    // _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
    _this.offset=offset;
    // _this.ctx.strokeStyle='#000';
    // _this.ctx.lineWidth=5;
    _this.$wrapper.css({
      height: (_this.offset + _this.height) * _this.zoom,
      '-webkit-transform':'translate3d(0px, '+ _this.offset * _this.zoom +'px,0)',
      '-moz-transform':'translate3d(0px, '+ _this.offset * _this.zoom +'px,0)',
      '-o-transform':'translate3d(0px, '+ _this.offset * _this.zoom +'px,0)',
      '-ms-transform':'translate3d(0px, '+ _this.offset * _this.zoom +'px,0)',
      'transform':'translate3d(0px, '+ _this.offset * _this.zoom +'px,0)'
    });

    // draw nodes
    var new_nodes=[],
      node_info,
      node_draw_info,
      node_hit_info;
    while(_this.nodes.length){
      node_info=_this.nodes.splice(0,1)[0];
      if(node_info.offset>=_this.offset){
        if(node_info.offset<=_this.offset+_this.height){
          node_draw_info={
            x: node_info.line - 10,
            y: node_info.offset,
            w: 20,
            h: 20
          };
          node_hit_info={
            x: node_draw_info.x * _this.zoom,
            y: (_this.height - (node_info.offset - _this.offset)) * _this.zoom,
            w: node_draw_info.w * _this.zoom,
            h: node_draw_info.h * _this.zoom
          };
          if(!node_info.$el){
            node_info.$el=$('<div class="node"></div>');
            node_info.$el.appendTo(_this.$wrapper).css({
              '-webkit-transform':'scale('+_this.zoom+')',
              '-moz-transform':'scale('+_this.zoom+')',
              '-o-transform':'scale('+_this.zoom+')',
              '-ms-transform':'scale('+_this.zoom+')',
              'transform':'scale('+_this.zoom+')',
              bottom: node_draw_info.y * _this.zoom,
              left: node_draw_info.x * _this.zoom
            });
          }
          if(_this.checkHit(node_hit_info)){
            if(node_info.$el){
              node_info.$el.remove();
              node_info.$el=null;
            }
          }else{
            new_nodes.push(node_info);
          }
        }else{
          new_nodes.push(node_info);
        }
      }else{
        if(node_info.$el){
          node_info.$el.remove();
          node_info.$el=null;
        }
      }
    }
    _this.nodes=new_nodes;
    console.log(new_nodes.length);
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
      hitRect=_this.charater.hitRect,
      isHit=false;
    // round check
    var hitCenter={
        x: hitRect.x + hitRect.w / 2,
        y: hitRect.y + hitRect.h / 2
      },
      nodeCenter={
        x: nodeInfo.x + nodeInfo.w / 2,
        y: nodeInfo.y + nodeInfo.h /2
      };
      minDistance=(hitRect.w + hitRect.h) / 4 + (nodeInfo.w + nodeInfo.h) /4;
    if(
      Math.pow(
        Math.pow(hitCenter.x - nodeCenter.x, 2) +
        Math.pow(hitCenter.y - nodeCenter.y, 2),
        0.5
      )<minDistance
    ){
      _this.charater.hit(nodeInfo.type);
      isHit=true;
    }

    return isHit;
  };

  return Path;
});