let responses = [];
const conf = require('./conf.js');
const join = require("./join.js");

module.exports.remember = function (response) {
    //console.log("Response added: " + response);
    responses.push(response);
    //console.log("Response list: " + responses);
}

module.exports.forget = function (response) {
    let pos = responses.findIndex((resp) => resp === response);
    if (pos > -1)
        responses.splice(pos, 1);
}

module.exports.update = function (message) {
    for (let response of responses) {
        console.log("----devia ter enviado msg----");
        response.write('data: ' + message + '\n\n');
    }
}

module.exports.updateRoom = function (sala, message) {
    for (let p of sala.pessoas) {
        console.log("----devia ter enviado para a sala: " + sala.gameId + " " + message + " ----");
        if (p.response != null)
            p.response.write('data: ' + message + '\n\n');
    }

}