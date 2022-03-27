const fs = require('fs')
var express = require('express')
var https = require('https')
var app = express()

const { ExpressPeerServer } = require('peer');
const path = require('path')

let options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}

const server = https.createServer(options, app)
app.set('port', process.env.PORT || 443)

app.use('/', express.static(path.join(__dirname, 'public')))

server.listen(app.get('port'), function () {//https5
    console.log("My https server listening on port " + app.get('port') + "...");
});


///////////////////////////////////////////////////////
const peerServer = ExpressPeerServer(server, {
    path: '/myapp',
    allow_discovery: true,
    sslkey:fs.readFileSync('key.pem'),
    sslcert:fs.readFileSync('cert.pem')
  });
  // the target is => peerServer
  app.use('/peerjs', peerServer);
  
  //to update the user list
  peerServer.on('connection', ({ client, realm }) => {
    if(!realm) return
    realm.getClientsIds().filter(a => a != client.id).forEach(peerId => {
      const message = { type: 'CONNECTED', peerId: client.id }
      realm.getClientById(peerId).getSocket().send(JSON.stringify(message))
      console.log(message);
    })
  });
  
  //to update the user list
  peerServer.on('disconnect', ({ client, realm }) => {
    if(!realm) return
    realm.getClientsIds().filter(a => a != client.id).forEach(peerId => {
      const message = { type: 'DISCONNECTED', peerId: client.id }
      realm.getClientById(peerId).getSocket().send(JSON.stringify(message))
      console.log(message);
    })
  });
//   console.log('Listening in port 80');