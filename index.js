//twserver.alunos.dcc.fc.up.pt:8145/

const http = require('http');
const url = require('url');
const conf = require('./conf.js');
const reg = require('./registo.js');
const Rank = require('./ranking.js');
const updater = require('./updater.js');
const join = require('./join.js');
const game = require('./game.js');

var registos = reg.ArrRegistos;
var ranking = Rank.ArrRanking;

console.log(ranking);

const server = http.createServer(function (request, response) {
    var body = '';
    var clientmsg;
    var nick;
    var pass;
    var gameId;
    var mensagem = "";
    const parsedUrl = url.parse(request.url, true); // Url ready to be read
    const query = parsedUrl.query;
    var erro; // Error message

    switch (request.method) {
        case 'POST':
            request
                .on('data', (chunk) => { body += chunk; })
                .on('end', () => {

                    try {
                        clientmsg = JSON.parse(body);  // processar query

                        switch (parsedUrl.pathname) {
                            case '/register':
                                erro = { "error": "User registered with a different password" }; // error message
                                nick = clientmsg.nick;
                                pass = clientmsg.pass;

                                console.log("Nick: " + nick);
                                console.log("Pass: " + pass);
                                const newReg = new reg.ClassReg(nick, pass);
                                if (reg.nick_available(nick)) {
                                    registos.push(newReg);
                                    mensagem = 'Foi registado \"' + nick + "\" com \"" + pass + "\"";
                                    response.writeHead(200, conf.headers.txt);
                                }
                                else {
                                    let user = reg.getReg(nick);
                                    if (!user.verifyPassword(pass)) {
                                        response.writeHead(200, conf.headers.txt);
                                        mensagem = JSON.stringify("Ta feito mpt");
                                    }
                                    else {
                                        response.writeHead(401, conf.headers.json);
                                        mensagem = JSON.stringify(erro);
                                    }
                                }
                                console.log(registos);
                                break;

                            case '/ranking':
                                response.writeHead(200, conf.headers.json);
                                ranking.sort((a, b) => Rank.OrdRanking(a, b));
                                mensagem = JSON.stringify({ "ranking": ranking });
                                break;

                            case '/join':

                                nick = clientmsg.nick;
                                pass = clientmsg.pass;
                                gameId = clientmsg.group;

                                let user = reg.getReg(nick);
                                if (!user.verifyPassword(pass)) {
                                    response.writeHead(400, conf.headers.txt);
                                    mensagem = JSON.stringify({ error: "Wrong Password" });
                                }
                                else if (join.joinSala(gameId, nick, pass, null)) {
                                    response.writeHead(200, conf.headers.txt);
                                    let sala = join.returnRoom(gameId);
                                    let jogador = sala.getJogador(nick);
                                    let jsonMessage = { "game": sala.gameId, "color": jogador.color };
                                    mensagem = JSON.stringify(jsonMessage);
                                }
                                else {
                                    response.writeHead(400, conf.headers.txt);
                                    mensagem = JSON.stringify({ error: "Room full" });
                                }
                                break;

                            case '/notify':
                                console.log(JSON.stringify(clientmsg));
                                erro = { "error": "User registered with a different password" }; // error message
                                nick = clientmsg.nick;
                                pass = clientmsg.pass;
                                gameId = clientmsg.game;
                                let x, y;
                                console.log("Nick: " + nick);
                                console.log("Pass: " + pass);
                                if (clientmsg.move == null) {
                                    x = null;
                                    y = null;
                                    //jogar.verificaSeTermina();
                                }
                                else {
                                    x = clientmsg.move.row;
                                    y = clientmsg.move.column;
                                }
                                console.log("x: " + x);
                                console.log("y: " + y);
                                //updater.update("Update: " + x + ", " + y);
                                let sala = join.returnRoom(gameId);
                                console.log("Notify para a sala: " + sala.gameId);
                                //updater.updateRoom(sala, "Mensagem para sala: " + gameId);

                                for (let j of sala.pessoas)
                                    console.log("Notify teste nick: " + j.nick);
                                let jogador = sala.getJogador(nick);
                                console.log(jogador.nick);
                                let jogadaStatus = game.jogar(x, y, sala, jogador);
                                if (!jogadaStatus.valid) {
                                    response.writeHead(401, conf.headers.txt);
                                    mensagem = JSON.stringify(jogadaStatus.string);
                                }
                                else {
                                    response.writeHead(200, conf.headers.txt);
                                    updater.updateRoom(sala, JSON.stringify(jogadaStatus.json));
                                    //if (jogadaStatus.json.winner != null)
                                    //for (let j of sala.pessoas)
                                    //j.response.end();
                                    let jsonaux = { coisa: "dads" };
                                    mensagem = JSON.stringify(jsonaux);
                                }

                                break;

                            case '/leave':
                                nick = clientmsg.nick;
                                console.log("leave do " + nick);
                                pass = clientmsg.pass;
                                gameId = clientmsg.game;
                                let vencedor;
                                response.writeHead(200, conf.headers.txt);
                                mensagem = "";
                                //console.log("o " + nick + " saiu");
                                let sala1 = join.returnRoom(gameId);
                                if (sala1 != null) {
                                    for (let p of sala1.pessoas)
                                        if (p.nick != nick) {
                                            vencedor = p.nick;
                                        }
                                    console.log("Atualizar o ranking");
                                    if (sala1.pessoas.length == 2) {
                                        Rank.AtualizaRanking(vencedor, sala1);
                                        console.log(nick + " PASSSEI POR AQUI");
                                        try {
                                            console.log("pessoa 0: " + sala1.pessoas[0].nick);
                                            updater.updateRoom(sala1, JSON.stringify({ winner: vencedor }));
                                        }
                                        catch { console.log("n deu"); }
                                    }
                                    console.log(nick + " vai sair");
                                    join.removePlayer(nick, pass, gameId);
                                    console.log(nick + " chegou ao fim");
                                }

                                break;

                            default:
                                response.writeHead(404, conf.headers.txt);
                                break;

                        }

                        //console.log(mensagem);
                        response.end(mensagem);
                    }
                    catch (err) { console.log(err); }
                })
                .on('error', (err) => { console.log(err.message); });

        case 'GET':
            switch (parsedUrl.pathname) {
                case '/update':
                    nick = query.nick;
                    gameId = query.game;
                    let sala = join.returnRoom(gameId);
                    response.writeHead(200, conf.headers.sse);
                    updater.remember(response);
                    if (sala != null) {
                        join.setResponse(response, nick, sala);
                        if (sala.pessoas.length == 2)
                            join.Iniciar(sala);
                    }
                    request.on('close', () => {
                        console.log(nick + " este sai aqui");
                        //updater.forget(response);
                        let vencedor;
                        //console.log("o " + nick + " saiu");
                        let sala1 = join.returnRoom(gameId);
                        if (sala1 != null) {
                            for (let p of sala1.pessoas)
                                if (p.nick != nick) {
                                    vencedor = p.nick;
                                }
                            console.log("Atualizar o ranking");
                            if (sala1.pessoas.length == 2) {
                                Rank.AtualizaRanking(vencedor, sala1);
                                updater.updateRoom(sala1, JSON.stringify({ winner: vencedor }))
                            }
                            join.removePlayer(nick, pass, gameId);
                        }


                    });
                    //setImmediate(() => updater.update(JSON.stringify("connection established")));
                    break;
                default:
                    response.writeHead(404, conf.headers.txt);
                    break;
            }
        //response.end();

        default: break;
    }
});

server.listen(conf.port, () => {
    console.log("Server is running at port " + conf.port + "...")
});

