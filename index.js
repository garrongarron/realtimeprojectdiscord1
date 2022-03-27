var express = require('express')
const { ExpressPeerServer } = require('peer');
const path = require('path')

var app = express()
const port =  process.env.PORT || 443
const server = app.listen(port);

app.use('/', express.static(path.join(__dirname, 'public')))

console.log("My https server listening on port " + port + "...");

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