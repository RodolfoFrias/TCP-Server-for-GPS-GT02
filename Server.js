const net = require('net');
const port = 2345;
const host = '192.168.15.7';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});


let sockets = [];

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
        
        console.log(typeof(data));
        console.log('DATA ' + sock.remoteAddress + ': ' + JSON.stringify(data));

        if(typeof(data) != "string" ){
            console.log("Error 1");
        }
        if(data.length < 19){
            console.log("Error 2");
        }
        if(data[0] != '(' && data[data.length-1] != ')'){
            console.log("Error 3");
        }
        else{

            var ID    = data.substr(1,1+11);
            var Comando = data.substr(13,4);
            console.log("ID: "+ID);
            console.log("Comando: "+Comando);
            
            if(Comando == "BR00"){

                //Fecha
                var offset = 17;
                var offset_end = 6;
                var date = data.substr(offset,offset_end);
                console.log("Fecha: "+date);

                //Disponibilidad
                offset = 23;
                offset_end =  1;
                var disponibilidad = data.substr(offset,offset_end);
                console.log("Dispo: "+disponibilidad);

                //Latitud
                offset = 24;
                offset_end = 9;
                var lat = data.substr(offset,offset_end);
                console.log("Latitud: "+lat);

                //Indicador de latitud
                offset = 33;
                offset_end = 1;
                var lat_in = data.substr(offset,offset_end);
                console.log("Indicador lat: "+lat_in);

                //Longitud
                offset = 34;
                offset_end = 10;
                var lng = data.substr(offset,offset_end);
                console.log("Longitud: "+lng);

                //Indicador de longitud
                offset = 44;
                offset_end = 1;
                var lng_in = data.substr(offset,offset_end);
                console.log("Indicador lng: "+lng_in);

                //Velocidad
                offset = 45;
                offset_end = 5;
                var Velocidad = data.substr(offset,offset_end);
                console.log("Velocidad: "+Velocidad);

                //Hora
                offset = 50;
                offset_end = 6;
                var hora = data.substr(offset,offset_end);
                console.log("Hora: "+hora);

                if(disponibilidad = "A"){
                    var lat_dd = parseFloat(lat.substr(0,2)) + parseFloat(lat.substr(2,9)) / 60;
                    if(lat_in != "N"){
                        lat_dd = - lat_dd;
                    }
                    var lng_dd = parseFloat(lng.substr(0,3)) + parseFloat(lng.substr(3,10)) / 60;
                    if(lat_in != "E"){
                        lng_dd = - lng_dd;
                    }

                    console.log("Lat: "+lat_dd);
                    console.log("Lon: "+lng_dd);
                }
            }
            
        }
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {
            if(sockets[index] === sock){
                
            }
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});