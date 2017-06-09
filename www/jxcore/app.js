// This JavaScript file runs on JXcore

var fs = require('fs');
var clog = require('./utilities').log;

clog("JXcore is up and running!");

Mobile('getBuffer').registerSync(function() {
  clog("getBuffer is called!!!");
  var buffer = new Buffer(25000);
  buffer.fill(45);

  // send back a buffer
  return buffer;
});

Mobile('asyncPing').registerAsync(function(message, callback){
  setTimeout(function() {
    callback("Pong:" + message);
  }, 500);
});

if (!fs.existsSync(__dirname + "/node_modules")) {
  clog("The node_modules folder not found. Please refer to www/jxcore/Install_modules.md");
  return;
}

var express  = require('express')
var app  = express()
var http = require('http').Server(app)
var io   = require('socket.io')(http)
var os   = require('os')
//var Queue = require('buffered-queue');

//osc client
var osc = require('node-osc');
//var client = new osc.Client('10.20.29.51', 4444);
var client = new osc.Client('192.168.19.170', 4444);
//
var font = {
  ' ':[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  'a':[1,0,0,0,1,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0],
  'b':[0,0,0,0,1,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,1],
  'c':[0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0],
  'd':[0,0,0,0,1,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,1],
  'e':[0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,1,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0],
  'f':[0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1],
  'g':[0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
  'h':[0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0],
  'i':[0,0,0,0,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,0,0,0,0,0],
  'j':[0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,0,0,0,1],
  'k':[0,1,1,1,0,0,1,1,0,1,0,1,0,1,1,0,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0],
  'l':[0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0],
  'm':[0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,0,1,1,1,0],
  'n':[0,1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,0,0,1,1,0,0,0,1,1,1,0],
  'o':[0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
  'p':[0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1],
  'r':[0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1,1,1,0],
  's':[0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0],
  't':[0,0,0,0,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1],
  'u':[0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
  'x':[0,1,1,1,0,0,0,1,0,0,1,0,0,0,1,1,1,0,1,1,1,0,0,0,1,0,0,1,0,0,0,1,1,1,0],
  'v':[0,1,1,1,0,0,1,1,1,0,0,0,1,0,0,1,0,1,0,1,1,0,0,0,1,1,0,0,0,1,1,1,0,1,1],
  'w':[0,1,1,1,0,0,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1],
  'y':[0,1,1,1,0,0,0,1,0,0,1,0,0,0,0,1,1,0,0,1,1,1,0,1,1,1,0,0,1,1,0,0,1,1,1],
  'z':[0,0,0,0,0,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,0,1,1,1,1,0,0,0,0,0],
  '!':[1,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,1,1],
  '?':[0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1]
}

var pixels = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var address

var port = 3000
//socket to panel and to mobile devices
var panelsock  = io.of('/panel')
var mobilesock = io.of('/mobile')

//template engine using mustache
var cons = require('consolidate')

// assign the mustache engine to .html files
app.engine('html', cons.mustache);
// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
//allow access to public folder
app.use(express.static('public'))


//endpoint for new message
app.get('/msg/:msg',function(req,res){
  displayMessage(req.params.msg)
  res.send('ok');
})

app.get('/panel', function (req, res) {
  //list interfaces
  var ifaces = os.networkInterfaces();
   address = 'no address'
  for(var ifname in ifaces){
    iface = ifaces[ifname]
    for(var i=0;i<iface.length;i++){
      var ifaddr = iface[i]['address']
    direcIp = iface[i]['address'];
      //filter ipv6 and localhost addresses
      if( ifaddr.indexOf('.') != -1 && ifaddr.substr(0,3) != '127'){
        address = ifaddr
    
    
      }
    }
  }
  
  res.render('panel',{address:address,port:port})
})

app.get('/', function (req, res) {
  //if no mobile is specified connect to a empty pixel
  for(var pixelid=0;pixelid<35;pixelid++){
    var room = mobilesock.adapter.rooms[pixelid]
    if(!room){
        res.redirect('/mobile/'+pixelid)
    }
  }
})

app.get('/mobile/:id', function (req, res) {
  //if id is > 15 redirect
  //http://stackoverflow.com/a/11355430/2205297
  if (!req.params.id){
    for(var pixelid=0;pixelid<35;pixelid++){
      var room = mobilesock.adapter.rooms[pixelid]
      if(!room){
          res.redirect('/mobile/'+pixelid)
      }
    }
  }
  //render template
  res.render('mobile',{id:req.params.id})
})

/* panel connection */
panelsock.on('connection',function(socket){

  console.log('a user connected to panel: '+socket.id)
  //send pixel data
  socket.emit('pixels',pixels)
  //send connection data
  connCount()
  socket.on('disconnect', function(){
    console.log('user disconnected from panel: '+socket.id)
  })
  //updates all bg of all the mobile devices
  socket.on('pixels',function(_pixels){
    pixels = _pixels
    //console.log(pixels)
    //update rest of panels
    socket.broadcast.emit('pixels',pixels)
    //update devices
   devicesUpdate()
  })

})

/* mobile connection */
mobilesock.on('connection',function(socket){

  var pixelid = null

  //informs which pixelid is assoc to the device
  socket.on('pixel',function(_pixelid){
    pixelid = _pixelid
    console.log('a mobile connected: '+socket.id + " pixel:" + pixelid)
    socket.join(pixelid)
    //count connections
    connCount()
    //send the color of the pixel
    var color = pixels[pixelid] ? 'black' : 'white'
    //console.log(pixels)
    //console.log(pixels[pixelid])
    //console.log('>'+color)
    socket.emit('c0', { hello: 'world' })
  })
  socket.on('chat message', function(msg){
    
    io.emit('chat message', msg);
    
      var mensaj =  new osc.Message('/'+pixelid);
    mensaj.append(msg);
    client.send(mensaj);
  });
  //send to all panel connections
  socket.on('disconnect', function(){
    console.log('mobile disconnect: '+socket.id)
    connCount()
  })

})

//counts connections for every pixel/room and sends it to panels
function connCount(){
  var connCount = []
  for(var pixelid=0;pixelid<35;pixelid++){
    connCount.push(null)
    var room = mobilesock.adapter.rooms[pixelid]
    if(room){
      connCount[pixelid] = room.length
    }else{
      connCount[pixelid] = 0
    }
  }
  panelsock.emit('connCount',connCount)
 // console.log(connCount)
}

//convert str formed by 0 and 1 to bit aray
function str2arr(str){
  var bits = []
  for(var i=0;i<str.length;i++){
    var bit = (str[i] == '0') ? 0 : 1
    bits.push(bit)
  }
  return bits
}
//displays letter in devices, is possible update pixels value
function devicesUpdate(_pixels){

  if(_pixels){
      pixels = _pixels
  }

  for(var pixelid=0;pixelid<35;pixelid++){
    var room = mobilesock.adapter.rooms[pixelid]
    if(room){
      var color = pixels[pixelid] ? 'black' : 'white'
      //console.log(color)
      mobilesock.to(pixelid).emit('bg',color)
    }
  }
}

//global var hold timeoutHandler so it displayMessage can be cleared and stopped
//if a new message arrives
var displayHandler = null
/*
function msgQueue(msg){
  msg.length = msg.length || 1000;
var q = new Queue('msgBuffer', {
    size: 5,
    flushTimeout: 3000+(500*msg.length),
    verbose: false,
    customResultFunction: function(items) {
        var temp = [];
        items.forEach(function(item, index, array) {

            temp.push(item.toLowerCase());
        });
        return temp.join('\n');
    }
});
 
q.on("flush", function(data, name){
  
    setTimeout(function() {
    console.log(data);
    displayMessage(data);
},2000+( 500*data.length));
});
 
q.add(msg);
}
*/
function displayMessage(msg){
  var data = msg;
var mess = 0;
var counter=0;
var mob= []; 
var msgIndex =0;
var letter ;
  var limit = 35;
  var space = 1;
  for (pixelid=limit;pixelid>-1;pixelid--) {
    
         var room = mobilesock.adapter.rooms[pixelid]
            if(room){//   ids moviles conectados
            mob.push(pixelid);
            //console.log(mob[mob.length-1]);
           // mob.push(mob[mob.length-1])
            } 
            
}
msgIndex=msgIndex-mob.length;

(function myLoop (i) {          
   setTimeout(function () {  

        letter = data[msgIndex];
        
              if (letter in font){
              pixels = font[letter];

              }else{
              pixels = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                        }

       //mobilesock.to(mob[mess]).emit('pixels',font[msg[msgIndex]])
       // console.log(letter+mob[mess])
        if(letter === undefined){
          space = 0
           }else{
            space=1
           }
       msgIndex++;
       //console.log(letter)

       if(msgIndex<data.length+mob.length*2){
       //console.log(msgIndex+letter+mob[mess])
       
        }else{
               msgIndex=0-mob.length;
        }


          //mobilesock.to(mob[mess]).emit('pixels',font[msg[msgIndex]])
       for(var h = -1; h<mob.length;h++){
          //console.log(mob[mess]);
            if(space === 0){
           
             mobilesock.to(mob[h]).emit('pixels',font[' '])
             
           }
              
            mobilesock.to(mob[h]).emit('pixels',font[data[msgIndex-h]])
          mess++
        }



       //console.log("Counter"+counter)  
counter++

if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
   }, 500)
})(data.length+mob.length*2);
//console.log("TOTAL"+(data.length+mob.length*2))

}

  

http.listen(port,function(){
  console.log('listening on ' + port)
})


var net = os.networkInterfaces();

for (var ifc in net) {
  var addrs = net[ifc];
  for (var a in addrs) {
    if (addrs[a].family == "IPv4") {
      Mobile('addIp').call(addrs[a].address);
    }
  }
}
