(function(){

$(document).ready(function(){
  var socket = new io.Socket(); 
  socket.connect();
  
  socket.on('connect', function(){
  }) 
  socket.on('message', function(msg){
    if(msg.msg=='up'){
      updateDownCounter(-1);    
    }
    else if(msg.msg=='down'){
      updateDownCounter(1);
    }
    
  }) 
  socket.on('disconnect', function(){
    
  })
  
  var downCounter = 0,
      isDown = false;
  $('#presser').mousedown(function(){
    onMouseDown();
    isDown = true;
    return false;
  });
  
  function onMouseDown(e){
    updateDownCounter(1);
    
    socket.send({
      msg:"down"}
    );
    
    // If an event was supplied it was to signal
    // that we want the default behavior prevented.
    // This is mostly to prevent Mobile Safari
    // from scrolling/pinching in touch event
    // handlers.
    if(e){
      e.preventDefault();
    }
  }
  
  $('#presser').mouseup(function(){
    onMouseUp();
    return false;
  });
  
  function onMouseUp(e){
    updateDownCounter(-1);
    
    socket.send({
      msg:"up"}
    );
    
    // If an event was supplied it was to signal
    // that we want the default behavior prevented.
    // This is mostly to prevent Mobile Safari
    // from scrolling/pinching in touch event
    // handlers.
    if(e){
      e.preventDefault();
    }
  }
  
  function updateDownCounter(add){
    downCounter+=add;
    
    // No more people pressing the button 
    // so show it in the up state
    if(downCounter<=0){
      downCounter=0;  // HACKAHACKA: Might not be needed. Need sleep, call for help!
      $('#presser').removeClass('down');
      $('#presser').addClass('up');
    }
    // Someone is pressing the button
    // so show it in the down state.
    else{
      $('#presser').removeClass('up');
      $('#presser').addClass('down');
    }
  }
  
  var presser = document.getElementById('presser');      
  presser.addEventListener('touchstart', onMouseDown, false);
  presser.addEventListener('touchmove', function(e){e.preventDefault();}, false);
  presser.addEventListener('touchend', onMouseUp, false);
  presser.addEventListener('touchcancel', function(e){e.preventDefault();}, false);
  
  // Capturing touch start events on the document prevents all native guestures
  // mobile browsers such as pinch/zoom and scrolling swipes
  document.addEventListener('touchstart', function(e){e.preventDefault();}, false);
});

})();