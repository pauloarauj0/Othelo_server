

var ranking = [];

module.exports.ArrRanking = ranking;

module.exports.OrdRanking = function (a, b) {
    if (a.victories < b.victories)
        return 1;
    if (a.victories > b.victories)
        return -1;
    if (a.games > b.games)
        return 1;
    if (a.games < b.games)
        return -1;
    return 0;
}
function exist(nick) {
    for (let p of ranking) {
        if (p.nick === nick) {
            return true;
        }
    }
    return false;
}
function atualizarWinner(nick) {
    for (let p of ranking) {
        if (p.nick === nick) {
            p.victories++;
        }
    }
}
function atualizarGames(nick) {
    for (let p of ranking) {
        if (p.nick === nick) {
            p.games++;
        }
    }
}
module.exports.AtualizaRanking = function AtualizaRanking(vencedor, sala) {
    let newWinner;
    let newPlayer;
    for (let p of sala.pessoas) {
        if (p.nick === vencedor) {
            if (exist(p.nick))
                atualizarWinner(p.nick);
            else {
                newWinner = {
                    nick: vencedor, victories: 1, games: 0
                };
                ranking.push(newWinner);
            }

        }
        else
            if (!exist(p.nick)) {
                newPlayer = {
                    nick: p.nick, victories: 0, games: 0
                };
                ranking.push(newPlayer);
            }

        atualizarGames(p.nick);

    }


}


