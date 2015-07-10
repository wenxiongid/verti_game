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
      // charater=document.getElementById('charater'),
      $charater=$('.charaterC'),
      $nodeWrapper=$('#nodeWrapper'),
      timeline=new TimeLine(),
      myCharater=new Character($charater),
      myPath=new Path($nodeWrapper, myCharater, {
        width: stageWidth
      }),
      charaterAction='normal';

    myPath.noteFrequence=0.05;// range (0, 1]
    myPath.lineCount=stageWidth-20;
    myPath.nodeStart=2000;
    myPath.addRandomNote=function(){
      var _this=this,
        startOffset=_this.offset+ _this.height,
        addLineIndex=Math.floor(Math.random()*(_this.lineCount / _this.noteFrequence)),
        nodeOffset=startOffset+(500+Math.floor(Math.random()*300));
      if(addLineIndex<_this.lineCount){
        _this.addNode(addLineIndex, nodeOffset, 1);
      }
    };
    // myCharater.hitPoint=0;
    var $result=$('#result');
    myCharater.hit=function(){
      var _this=this;
      _this.point++;
      $result.text(_this.point);
    };

    stage.width=stageWidth;
    // charater.width=stageWidth;
    var windowW,
      windowH,
      isResizePaused=false,
      canvasZoom=1;
    $(window).on('resize orientationchange', function(){
      var $this=$(this),
        w=$this.width(),
        h=$this.height(),
        newH=h/w*stageWidth;
      stage.height=newH;
      // charater.height=newH;
      windowW=w;
      windowH=h;
      canvasZoom=w/stageWidth;
      if(w>h){
        isResizePaused=true;
        timeline.pause();
      }else{
        if(isResizePaused){
          isResizePaused=false;
          timeline.start();
        }
      }
      myPath.zoom=canvasZoom;
      myPath.height=newH;
      myCharater.stageHeight=newH;
      myCharater.zoom=canvasZoom;
      myCharater.moveTo();
    }).trigger('resize');

    var last_offset=0;

    timeline.bind('timeUpdate', function(timeOffset){
      var current_d_offset=timeOffset-last_offset,
        lane_offset=myPath.offset * myPath.zoom;
      myPath.draw(myCharater.speed*current_d_offset);
      last_offset=timeOffset;
      myPath.addRandomNote();
    });

    myCharater.moveTo($(window).width()/2);

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

    var $viewport=$('#viewport');
    
    $viewport.on(btnStartEvent, function(e){
      $viewport.on(btnMoveEvent, function(e){
        var newX=e.pageX;
        if(!newX){
          newX=e.originalEvent.pageX;
        }
        if(newX==0){
          newX=e.originalEvent.touches[0].pageX;
        }
        myCharater.moveTo(newX / myCharater.zoom);
      });
    });

    $(window).on(btnEndEvent, function(e){
      $viewport.off(btnMoveEvent);
    });

    $(document).on('touchmove', function(e){
      e.preventDefault();
    });

    $('#startBtn').on(btnEndEvent, function(e){
      $('#mask').hide();
      timeline.start();
    });
  });
});