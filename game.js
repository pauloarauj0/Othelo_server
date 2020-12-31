const roomManager = require("./join.js");
const updater = require("./updater.js");

module.exports.jogar = function jogar(row, column, sala, jogador) {
    console.log(row + ", " + column + ", " + sala.gameId + ", " + jogador.nick);
    var pontos_branco = 0;
    var pontos_preto = 0;
    let name = findName(sala);

    // Skip
    if (row === null || column === null) {
        if (pode_passar(jogador, sala)) {
            //updater.updateRoom(sala, "skip");
            sala.changeTurn();
            let count_aux = { light: 2, dark: 2, empty: 60 };
            return {
                valid: true, json: { turn: name, board: sala.board, count: count_aux }
            };
        }
        else {
            return {
                valid: false, string: {
                    error: "can't skip"
                }
            };
        }
    }
    sala.print(row, column);

    //verificar turno
    if (sala.turn != jogador.color)
        return {
            valid: false, string: { error: "turno invalido" }
        };

    //verificar jogada
    if (row >= 8 || row < 0 || column >= 8 || column < 0 || sala.board[row][column] != "empty")
        return {
            valid: false, string: {
                error: "jogada invalida"
            }
        };


    let affected = can_click(row, column, sala, jogador);
    console.log("tamanho do getAffected: " + affected.length);
    if (affected.length === 0) {
        return {
            valid: false, string: {
                error: "não vira nenhuma peca"
            }
        };
    }


    flippeca(affected, jogador, sala, row, column);
    console.log("-----------------------------------");
    sala.print();
    sala.changeTurn();

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (sala.board[i][j] === "dark")
                pontos_preto++;
            if (sala.board[i][j] === "light")
                pontos_branco++;

        }
    }

    let count_aux = { light: pontos_branco, dark: pontos_preto, empty: 64 - pontos_branco - pontos_preto };
    let pecaDisp = count_aux.empty;





    if (JogoTermina(sala)) {
        return {
            valid: true, json: { turn: name, winner: jogador.nick, board: sala.board }
        };
    }
    return {
        valid: true, json: { turn: name, board: sala.board, count: count_aux }
    };
}

/***********************************************/
function findName(sala) {
    for (let p of sala.pessoas)
        if (p.color === sala.turn)
            return p.nick;

}

function JogoTermina(sala) {
    for (let p of sala.pessoas)
        if (!pode_passar(p, sala))
            return false;
    return true;
}


function pode_passar(jogador, sala) {
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++)
            if (can_click(i, j, sala, jogador).length > 0) {
                return false;
            }
    console.log("pode passar");
    return true;
}


function can_click(row, column, sala, jogador) {
    let affectedpeca = getPecasAfetadas(row, column, sala, jogador);
    return affectedpeca;
}

function getPecasAfetadas(row, column, sala, jogador) {
    if (sala.board[row][column] != "empty") {
        return [];
    }
    let turn = jogador.color;

    let coluna_aux;
    let linha_aux;
    //direita
    let affectedpeca = [];
    let possivelmenteAfetados = [];
    coluna_aux = column;

    while (coluna_aux < 7) {
        coluna_aux++;
        let valueAtSpot = sala.board[row][coluna_aux];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: row, column: coluna_aux };
            possivelmenteAfetados.push(discLocation);
        }
    }


    //esquerda
    possivelmenteAfetados = [];
    coluna_aux = column;

    while (coluna_aux > 0) {
        coluna_aux--;
        let valueAtSpot = sala.board[row][coluna_aux];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: row, column: coluna_aux };
            possivelmenteAfetados.push(discLocation);
        }
    }


    //cima

    possivelmenteAfetados = [];
    linha_aux = row;

    while (linha_aux > 0) {
        linha_aux--;
        let valueAtSpot = sala.board[linha_aux][column];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: linha_aux, column: column };
            possivelmenteAfetados.push(discLocation);
        }
    }
    //baixo

    possivelmenteAfetados = [];
    linha_aux = row;

    while (linha_aux < 7) {
        linha_aux++;
        let valueAtSpot = sala.board[linha_aux][column];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            //console.log("PASSOU POR 1---------");
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: linha_aux, column: column };
            possivelmenteAfetados.push(discLocation);
        }
    }

    //baixo direita
    possivelmenteAfetados = [];
    linha_aux = row;
    coluna_aux = column;
    while (linha_aux < 7 && coluna_aux < 7) {
        linha_aux++;
        coluna_aux++;
        let valueAtSpot = sala.board[linha_aux][coluna_aux];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: linha_aux, column: coluna_aux };
            possivelmenteAfetados.push(discLocation);
        }
    }
    //baixo esq
    possivelmenteAfetados = [];
    linha_aux = row;
    coluna_aux = column;
    while (linha_aux < 7 && coluna_aux > 0) {
        linha_aux++;
        coluna_aux--;
        let valueAtSpot = sala.board[linha_aux][coluna_aux];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: linha_aux, column: coluna_aux };
            possivelmenteAfetados.push(discLocation);
        }
    }

    //cima direita
    possivelmenteAfetados = [];
    linha_aux = row;
    coluna_aux = column;
    while (linha_aux > 0 && coluna_aux < 7) {
        linha_aux--;
        coluna_aux++;
        let valueAtSpot = sala.board[linha_aux][coluna_aux];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: linha_aux, column: coluna_aux };
            possivelmenteAfetados.push(discLocation);
        }
    }
    //cima esq
    possivelmenteAfetados = [];
    linha_aux = row;
    coluna_aux = column;
    while (linha_aux > 0 && coluna_aux > 0) {
        linha_aux--;
        coluna_aux--;
        let valueAtSpot = sala.board[linha_aux][coluna_aux];
        if (valueAtSpot == "empty" || valueAtSpot == turn) {
            if (valueAtSpot == turn) {
                affectedpeca = affectedpeca.concat(possivelmenteAfetados);
            }
            break;
        }
        else {
            let discLocation = { row: linha_aux, column: coluna_aux };
            possivelmenteAfetados.push(discLocation);
        }
    }
    return affectedpeca;
}



function flippeca(affectedpeca, jogador, sala, row, column) {
    sala.board[row][column] = jogador.color;
    //console.log("Tamanho affected: " + affectedpeca.length);
    for (let i = 0; i < affectedpeca.length; i++) {
        let spot = affectedpeca[i];
        sala.board[spot.row][spot.column] = jogador.color;
    }
}