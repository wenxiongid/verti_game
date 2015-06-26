define([
  'jQuery'
], function(
  $
){
  var canvas,
    ctx,
    stageWidth=1024,
    stageHeight=768,
    displayObjectList=[];

  $(function(){
    canvas=$('#canvas')[0];
    ctx=canvas.getContext('2d');
  });
});