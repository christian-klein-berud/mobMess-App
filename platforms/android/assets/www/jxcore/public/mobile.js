$(document).ready(init)
var cells
var socket
function init(){
	
 socket = io('/mobile')

document.getElementById('request').addEventListener('click', () => {
  if (screenfull.enabled) {
    screenfull.request();
  } 
  });
document.getElementById('exit').addEventListener('click', () => {
  screenfull.exit();
  });

   cells = []
  for(var i=0;i<35;i++){
    //select every cell
    var cell = $('#c'+i)
    cells.push(cell)
  }
  
 /*$('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });*/
    /*socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });*/
  socket.on('connCount',function(connCount){
    for(var i=0;i<15;i++){
      if(connCount[i] > 0){
        cells[i].addClass('connected')
      }else{
        cells[i].removeClass('connected')
      }
    }
  })
  socket.on('connect', function() {
    socket.emit('pixel',pixelid)
	
  });
  /*socket.on('bg', function(color) {
    // Connected, let's sign-up for to receive messages for this room
     $('body').css('background', color)
  });*/


  socket.on('pixels',function(code){
    displayBits(code)
  })

/*$('table.table td').click(function(){
    $(this).toggleClass('selected')
    var code = getUpdate()
    //displayBits(code)
    socket.emit('pixels',code)
  })*/
}
function getUpdate(){
  var bits = []
  for(var i=0;i<cells.length;i++){
    var cell = cells[i]
    var bit  = cell.hasClass('selected')
    //http://stackoverflow.com/questions/7820683/convert-boolean-result-into-number-integer#7820695
    bits.push(bit + false)
  }
  return bits
}

function displayBits(bits){
  var code = ''
  for(var i=0;i<bits.length;i++){
    var cell = cells[i]
    var bit  = bits[i]
    if(bit){
      cell.addClass('selected')
    }else{
      cell.removeClass('selected')
    }
  }
  code = '['+bits.join(',')+']'
  $('#code').text(code)
}