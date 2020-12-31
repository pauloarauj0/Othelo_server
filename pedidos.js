/*

        O pedido ranking nao funciona ( 400 Bad Request )
        Não conseguimos ler os valores retornados pela funcao notify

        
        var nick = "PLAYER1olasouopauloehjtu";
        var pass = "1123";
        
        var nick2 = "PLAYER2asids1q"
        var pass2 = "1256";
        
        var rankingArr;
        */
var WEBSERVER = "http://localhost:8145/";
var gameId;

var nick;
var pass;
var nick2;
var pass2;
var sorce_global;
var winner;

function mostrar_tabu() {
    let tabul = document.getElementById("tabuleiro");
    tabul.innerHTML = "";
    for (let i = 0; i <= 7; i++)
        tabul.innerHTML += peca[i] + "<br>";
}

async function join(group_num, nickname, password) {
    console.log(nickname + " Entra no join");
    const juntar = { "group": group_num, "nick": nickname, "pass": password };
    let objeto = await fetch(WEBSERVER + "join", {
        method: "POST", body: JSON.stringify(juntar)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (myresponse) {
            if (myresponse.error) {
                console.log(myresponse.error);
                //if (myresponse.error == 400)
                //join(group_num, nickname, password);
            }
            else {
                return myresponse;
            }
        })

        .catch(console.log);
    console.log(objeto);
    console.log("GameId: " + objeto.game);
    gameId = objeto.game;
    //gameId = group_num;
    if (objeto.color == null) {
        join(group_num, nickname, password);
    }
    else {
        if (objeto.color == "dark") {
            turn = 1;
        }
        else
            turn = 2;

        console.log(turn);
        console.log("Update " + nickname)
        update(nickname, gameId);
    }

}
async function register(nickname, password) {
    const juntar = { "nick": nickname, "pass": password }
    await fetch(WEBSERVER + "register", {
        method: "POST", body: JSON.stringify(juntar)
    })
        .catch(function (res) {
            console.log(res);
        })
}

var tabu;
async function update(nickname, gameId) {
    const url = WEBSERVER + "update?nick=" + nickname + "&game=" + gameId;
    sorce_global = new EventSource(url);
    sorce_global.onmessage = function (event) {
        /*
        if (typeof event.data == "string") {
            console.log(event.data);
        }
        else {
            */
        console.log(event.data);
        if (JSON.parse(event.data).board != null)
            if (typeof (JSON.parse(event.data).board) == "object") {
                if (turn_game == 1)
                    turn_game = 2;
                else turn_game = 1;
                tabu = JSON.parse(event.data).board;
                for (let i = 0; i < 8; i++)
                    for (let j = 0; j < 8; j++)
                        if (tabu[i][j] == "empty")
                            peca[i][j] = 0;
                        else if (tabu[i][j] == "dark")
                            peca[i][j] = 1;
                        else
                            peca[i][j] = 2;
                //mostrar_tabu();
                if (JSON.parse(event.data).turn != nick) {
                    nick2 = JSON.parse(event.data).turn;

                }

            }
        if (JSON.parse(event.data).winner != null) {
            console.log("Tem um Winner")
            winner = JSON.parse(event.data).winner;
            if (JSON.parse(event.data).winner == nick) {
                console.log("GANHASTE")
                if (!verifica_se_termina(pontos_branco, pontos_preto)) {
                    desistir(winner);
                    //sorce_global.close();
                }
            }
            else {
                console.log("Perdeste");
                desistir(winner);
                // sorce_global.close();
            }
            leave(nick, pass, gameId);
        }
        else {
            console.log("Null ganhou");
        }
        console.log("Vai verificar se termina");
        /*
        if (verifica_se_termina(pontos_branco, pontos_preto)) {
            notify_skip(nick, pass, gameId);
        }
        */
        // sorce_global = this.source;
        place_pecas();
        //console.log("Turn_game: " + turn_game);
        //console.log(event.data);
    }
    //}
    // lembrar de fechar quando acabar o jogo
}

async function leave(nickname, password, gameId) {
    const sair = { "nick": nickname, "pass": password, "game": gameId };
    await fetch(WEBSERVER + "leave", {
        method: "POST", body: JSON.stringify(sair)
    })
        .catch(function (myresponse) {
            if (myresponse.error) { console.log(myresponse.error); }
            else {
                return myresponse;
            }
        })

}

async function pedir_ranking() {
    const rank = "{}";
    let objeto = await fetch(WEBSERVER + "ranking", {
        method: 'POST',
        body: rank
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (myresponse) {
            if (myresponse.error) { console.log(myresponse.error); }
            else {
                console.log(myresponse)
                return myresponse;
            }
        })
        .catch(console.log);
    console.log(objeto.ranking);
    let ran = document.getElementById("texto_ranking");
    document.getElementById("ranking").style.visibility = "visible";

    ran.innerHTML = "";
    ran.innerHTML += "JOGADOR VITORIAS JOGOS <br>"
    for (let i = 0; i < 10 && i < objeto.ranking.length; i++) {
        ran.innerHTML += objeto.ranking[i].nick + ' ';
        ran.innerHTML += objeto.ranking[i].victories + ' ';
        ran.innerHTML += objeto.ranking[i].games;
        ran.innerHTML += "<br>";

    }

}

async function notify(nickname, password, gameId, x, y) {
    const jogada = { "row": x, "column": y };
    console.log(jogada.row + ", " + jogada.column);
    const juntar = { "nick": nickname, "pass": password, "game": gameId, "move": jogada }
    await fetch(WEBSERVER + "notify", {
        method: 'POST', body: JSON.stringify(juntar)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (myresponse) {
            if (myresponse.error) {
                console.log(myresponse.error);
            }
            else {
                return myresponse;
            }
        })
        .catch(console.log);

}

async function notify_skip(nickname, password, gameId) {
    const jogada = null;
    const juntar = { "nick": nickname, "pass": password, "game": gameId, "move": jogada }
    await fetch(WEBSERVER + "notify", {
        method: 'POST', body: JSON.stringify(juntar)
    })
        .then(function (response) {
            console.log(response);
            let cenas = response.json();
            console.log(typeof cenas)
            return cenas;
        })
        .then(function (myresponse) {
            if (myresponse.error) {
                console.log(myresponse.error);
            }
            else {
                return myresponse;
            }
        })
        .catch(console.log);
}