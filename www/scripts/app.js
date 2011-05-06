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
      isMouseDown = false;
  $('#presser').mousedown(function(e){
    onMouseDown(e);
    return true;
  });
  
  function onMouseDown(e){
    updateDownCounter(1);
    
    socket.send({
      msg:"down"}
    );
    
    // We track our mouse down or up state so we can pop the button up
    // when the user is pressing the button down but then moves
    // the mouse off the button and releases it.
    // The issue was that the button wasn't getting the mouseup
    // events because the mouse isn't over them. This was causing the button
    // to get stuck down.
    isMouseDown = true;
    
    
    // If an event was supplied it was to signal
    // that we want the default behavior prevented.
    // This is mostly to prevent Mobile Safari
    // from scrolling/pinching in touch event
    // handlers.
    if(e){
      e.preventDefault();
    }
  }
  
  $('#presser').mouseup(function(e){
    // Ignore these events if the mouse wasn't previously down.
    // otherwise we are tallying our downCounter incorrectly
    if(isMouseDown==false){
      return; 
    }
    
    onMouseUp(e);
    
    // See in onMouseDown above about why we are tracking mouse down/up state
    isMouseDown = false;
    return true;
  });
  
  $('#presser').mouseleave(function(e){
    // If the mouse wasn't down don't emulate a mouse up event.
    if(isMouseDown==false){
      return;
    }
  
    // If the mouse left the bounds of the button while in a pressed down
    // state we pop the button back up
    onMouseUp(e);
    
    // See in onMouseDown above about why we are tracking mouse down/up state
    isMouseDown = false;
    return true;
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
  //document.addEventListener('gesturestart', function(e){e.preventDefault();}, false);
  //document.addEventListener('gesturechange', function(e){e.preventDefault();}, false);
});

})();
