class PeerjsConnectionHandler {
    constructor(peer = null) {
        this.peer = peer
        this.connections = {}
        this.dataHandler = console.log
        this.delay = 200 // miliseconds
    }

    setPeer(peer) {
        this.peer = peer
    }

    getPeer(peerId){
        if(!this.connections.hasOwnProperty(peerId)) return console.error('not peer found');
        return this.connections[peerId]
    }

    addConnection(peerId, connection) {
        this.connections[peerId] = connection
        connection.on('data', (data)=>{
            this.dataHandler(data, peerId)
        });
        connection.on('close', (payload) => {
            console.log(`Connection with ${peerId} is closed`, payload);
        })
        return new Promise((res, rej) => {
            connection.peerConnection.onconnectionstatechange = (event) => {
                if (event.target.connectionState == 'connected') {
                    setTimeout(() => {
                        res(connection)
                    }, this.delay);
                }
            }
        })
    }

    connectTo(peerId) {
        const connection = this.peer.connect(peerId)
        return this.addConnection(peerId, connection)
    }

    setConnectionHandler(connectionHandler) {
        this.peer.on('connection', (connection) => {
            const peerId = connection.peer
            this.addConnection(peerId, connection).then(connection => {
                connectionHandler({ conn: connection, peerId })
            })
        })
    }
    
    setDataHandler(dataHandler) {
        this.dataHandler = dataHandler
    }
}

const peerjsConnectionHandler = new PeerjsConnectionHandler()

export default peerjsConnectionHandler 

export { PeerjsConnectionHandler }