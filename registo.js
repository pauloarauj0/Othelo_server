var registos = [];
module.exports.ClassReg = class Registo {
    constructor(nick, pass) {
        this.nick = nick;
        this.pass = pass;
    }

    verifyPassword(pass) {
        if (this.pass == pass)
            return true;
        return false;
    }
}

module.exports.getReg = function getReg(nick) {
    for (let r of registos)
        if (r.nick == nick)
            return r;
    return null;
}

module.exports.nick_available = function nick_available(nick_novo) {
    //console.log(nick_novo);
    if (registos.length === 0)
        return true;
    for (let i = 0; i < registos.length; i++) {
        //console.log(registos[i].nick);
        if (nick_novo === registos[i].nick)
            return false;
    }
    return true;

}

module.exports.ArrRegistos = registos;