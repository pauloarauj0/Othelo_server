const updater = require("./updater.js");
var salas = [];

module.exports.salas = salas;
class Room {
    constructor(gameId) {
        this.gameId = gameId;
        this.pessoas = [];
        this.board = [
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "light", "dark", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "dark", "light", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ];
        this.turn = "dark";

    }

    addPessoa(pessoa) {
        if (this.pessoas.length < 2) {
            this.pessoas.push(pessoa);
            return true;
        }
        else {
            console.log("Nao entrou");
            return false;
        }

    }
    getJogador(nick) {
        for (let p of this.pessoas)
            if (p.nick === nick)
                return p;
        return null;
    }

    changeTurn() {
        if (this.turn === "dark")
            this.turn = "light";
        else
            this.turn = "dark";
    }

    print() {
        for (let i = 0; i < 8; i++)
            console.log(this.board[i][0] + ", " + this.board[i][1] + ", " + this.board[i][2] + ", " + this.board[i][3] + ", " + this.board[i][4] + ", " + this.board[i][5] + ", " + this.board[i][6] + ", " + this.board[i][7]);
    }

    print(row, column) {
        let boardtxt = "";
        for (let i = 0; i < 8; i++) {
            if (i == row) {
                for (let j = 0; j < 8; j++) {
                    if (j == column)
                        boardtxt += "teste, ";
                    else
                        boardtxt += this.board[i][j] + ", ";
                }
                console.log(boardtxt);
            }
            else
                console.log(this.board[i][0] + ", " + this.board[i][1] + ", " + this.board[i][2] + ", " + this.board[i][3] + ", " + this.board[i][4] + ", " + this.board[i][5] + ", " + this.board[i][6] + ", " + this.board[i][7]);
        }
    }
}


class Pessoa {
    constructor(nick, pass, response) {
        this.nick = nick;
        this.pass = pass;
        this.response = response;
        this.color = "";
    }
}

module.exports.setResponse = function setResponse(response, nick, salaPrincipal) {
    for (let p of salaPrincipal.pessoas)
        if (p.nick === nick)
            p.response = response;

}

module.exports.returnRoom = function returnRoom(gameId) {
    for (let sala of salas) {
        //console.log("passou pela sala: " + sala.gameId);
        if (sala.gameId == gameId)
            return sala;
    }
    return null;
}

function createRoom(gameId) {
    var sala = new Room(gameId);
    salas.push(sala);
}

module.exports.joinSala = function joinSala(gameId, nick, pass, response) {
    console.log("Join sala: " + gameId);
    var jogador = new Pessoa(nick, pass, response);
    let sala = this.returnRoom(gameId);
    if (sala != null) {
        jogador.color = "light";
        return sala.addPessoa(jogador);
    }

    else {
        jogador.color = "dark";
        createRoom(gameId);
        sala = this.returnRoom(gameId);
        console.log("Create room: " + sala.gameId);
        return sala.addPessoa(jogador);
    }
}

module.exports.removePlayer = function removePlayer(nick, pass, gameId) {
    let i;
    for (i = 0; i < salas.length; i++) {
        if (salas[i].gameId == gameId) {
            break;
        }
    }
    for (let j = 0; j < salas[i].pessoas.length; j++) {
        if (salas[i].pessoas[j].nick === nick) {
            console.log("removeu: " + salas[i].pessoas[j].nick);
            salas[i].pessoas[j].nick = null;
            salas[i].pessoas[j].pass = null;
            salas[i].pessoas[j].response.end();
            salas[i].pessoas[j].response = null;
            salas[i].pessoas[j].color = null;
            salas[i].pessoas.splice(j, 1);
        }
    }
    console.log("Tem " + salas[i].pessoas.length + " na sala " + salas[i].gameId);
    if (salas[i].pessoas.length == 0)
        salas.splice(i, 1);

}

module.exports.Iniciar = function Iniciar(sala) {
    let count_aux = "coisa";
    updater.updateRoom(sala, JSON.stringify({ turn: sala.turn, board: sala.board, count: count_aux }));
}
