requirejs([
  'jquery',
  'helper',
  'timeline',
  'path',
  'charater'
], function(
  $,
  Helper,
  TimeLine,
  Path,
  Character
){
  if(!Helper.canvasSupport()){
    return;
  }
  function support_touch_event(){
    return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
  }

  var btnStartEvent=support_touch_event() ? 'touchstart' : 'mousedown',
    btnMoveEvent=support_touch_event() ? 'touchmove' : 'mousemove',
    btnEndEvent=support_touch_event() ? 'touchend' : 'mouseup';

  $(function(){
    timeline=new TimeLine();
    var stageWidth=1000,
      stage=document.getElementById('gameStage'),
      charater=document.getElementById('charater'),
      timeline=new TimeLine(),
      myCharater=new Character(charater),
      myPath=new Path(stage, myCharater, {
        lineInfo: [{
          y: 350
        },{
          y: 400
        }]
      }),
      charaterAction='normal';

    myPath.noteFrequence=7;
    myPath.lineCount=3;
    myPath.lastNode=myPath.canvas.width;
    myPath.addRandomNote=function(){
      var _this=this,
        addLineIndex=Math.floor(Math.random()*(_this.lineCount+_this.noteFrequence));
      if(addLineIndex<_this.lineCount){
        if(!_this.line[addLineIndex]){
          _this.line[addLineIndex]=[];
        }
        _this.lastNode=_this.lastNode+(500+Math.floor(Math.random()*300));
        if(_this.lastNode<_this.offset+_this.canvas.width){
          _this.lastNode=_this.offset+_this.canvas.width;
        }
        _this.line[addLineIndex].push(_this.lastNode);
      }
    };
    myCharater.hit=function(){
      alert('hit: ' + myPath.offset);
    };

    stage.width=stageWidth;
    charater.width=stageWidth;
    var windowWidth;
    $(window).on('resize orientationchange', function(){
      var $this=$(this),
        w=$this.width(),
        h=$this.height(),
        newH=h/w*stageWidth;
      stage.height=newH;
      charater.height=newH;
      windowWidth=w;
      if(w>h){
        timeline.pause();
      }else{
        timeline.start();
      }
      myCharater.moveTo();
    }).trigger('resize');

    var last_offset=0;

    timeline.bind('timeUpdate', function(timeOffset){
      var current_d_offset=timeOffset-last_offset;
      myPath.draw(myCharater.speed*current_d_offset);
      last_offset=timeOffset;
      // myPath.addRandomNote();
    });

    myCharater.moveTo();

    $('#pauseStartBtn').on(btnStartEvent, function(e){
      switch(timeline.status){
        case 'running':
          $(this).text('run');
          timeline.pause();
          break;
        case 'paused':
        case 'stop':
        default:
          $(this).text('pause');
          timeline.start();
      }
    });

    var $charater=$('#charater');
    
    $charater.on(btnStartEvent, function(e){
      $charater.on(btnMoveEvent, function(e){
        var newX=e.pageX;
        if(!newX){
          newX=e.originalEvent.pageX;
        }
        myCharater.moveTo(newX / windowWidth * stageWidth);
      });
    });

    $(window).on(btnEndEvent, function(e){
      $charater.off(btnMoveEvent);
    });

    timeline.start();
  });
});