var fundoTabuleiro;
var espacamento = 3;
var larguraCelula = 50;
var camada_peca;
var turn = 1;
var nick = "Player1";
var nick2 = "Player2";
var vsplayer = false;
var contrapc = true;
var turn_pc = 1;
var playerP = false;
var playerB = false;
var turn_game = 1;
var ai_r;
var ai_c;
var ranking = [];
var pontos_preto = 0;
var pontos_branco = 0;
var peca = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 2, 1, 0, 0, 0],
	[0, 0, 0, 1, 2, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]
];
window.onload = function () {

	//mostrar_ranking();
	//fechar configuracao
	document.getElementById("start").addEventListener("click", function () { hide_configuracao() });

	//trocar login player1
	document.getElementById("botao_login").addEventListener("click", function () { change_login() });

	//trocar login player2
	document.getElementById("botao_login2").addEventListener("click", function () { change_login2() });

	//ativar modo player vs player
	document.getElementById("vs_player").addEventListener("click", function () { contra_jogador() });

	//ativar modo player vs pc 
	document.getElementById("vs_pc").addEventListener("click", function () { contra_pc() });

	//regras - sair e abrir
	document.getElementById("sair_regras").addEventListener("click", function () { sair_regras() });
	document.getElementById("abrir_regras").addEventListener("click", function () { abrir_regras() });

	//escolher cor do player 1
	/*
	if (vs_player) {
		document.getElementById("peca_preta").addEventListener("click", function () { player_preto() })
		document.getElementById("peca_branca").addEventListener("click", function () { player_branco() })
	}
	*/

	//Ranking
	document.getElementById("sair_ranking").addEventListener("click", function () { sair_ranking() });

	//Alertas
	document.getElementById("alert_desistiu").addEventListener("click", function () { hide_desiste() });

	document.getElementById("botao_login").addEventListener("click", function () {
		nick = document.getElementById("fname").value;
		pass = document.getElementById("senha1").value;
		gameId = document.getElementById("gameroom1").value;

	});

	document.getElementById("botao_login2").addEventListener("click", function () {
		nick2 = document.getElementById("fname2").value;
		pass2 = document.getElementById("senha2").value;
	});

	document.getElementById("rage_quit").addEventListener("click", function () {
		if (!contrapc)
			leave(nick, pass, gameId);
	});
}

function start() {
	if (contrapc) {
		document.getElementById("rage_quit").addEventListener("click", function () {
			if (contrapc) {
				winner = "PC";

			}
			desistir();

		});
		turn = 1;
	}
	else {
		register(nick, pass);
		join(gameId, nick, pass);
	}
	document.getElementById("pointsOfPlayerOne").style.border = "2px solid red";
	document.getElementById("pointsOfPlayerTwo").style.border = "2px solid white";
	fundoTabuleiro = document.getElementById("fundoTabuleiro");
	camada_peca = document.getElementById("camada_peca");
	fundoTabuleiro.appendChild(camada_peca);
	fundoTabuleiro.style.top = "20%";
	fundoTabuleiro.style.width = (larguraCelula * 8 + (espacamento * 7)) + 'px';
	fundoTabuleiro.style.height = (larguraCelula * 8 + (espacamento * 7)) + 'px';
	document.getElementById("skip").addEventListener("click", function () { botao_skip() });

	//fazer aparecer tabuleiro e titulo
	document.getElementById("h1").style.visibility = "visible";
	document.getElementById("titulo").style.visibility = "visible";
	document.getElementById("fundoTabuleiro").style.visibility = "visible";


	peca = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 2, 1, 0, 0, 0],
		[0, 0, 0, 1, 2, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0]
	];



	mostrarCelulas();
	place_pecas();
}


function change_login() {
	nick = document.getElementById("fname").value;
	if (nick == "") {
		nick = "Player1";
	}
	document.getElementById("login_background").style.visibility = "hidden";
}

function change_login2() {
	nick2 = document.getElementById("fname2").value;
	if (nick2 == "") {
		nick2 = "Player2";
	}
	document.getElementById("login_background2").style.visibility = "hidden";
}

function contra_jogador() {

	//document.getElementById("login_background2").style.visibility = "visible";

	if (contrapc) {
		document.getElementById("vs_pc").style.color = "white";
		document.getElementById("vs_player").style.color = "red";
		vsplayer = true;
		contrapc = false;
	}
	else {
		document.getElementById("vs_player").style.color = "red";
		vsplayer = true;

	}
}

function contra_pc() {
	document.getElementById("login_background2").style.visibility = "hidden";

	if (vsplayer) {
		document.getElementById("vs_player").style.color = "white";
		vsplayer = false;
		contrapc = true;
		document.getElementById("vs_pc").style.color = "red";
	}
	else {
		document.getElementById("vs_pc").style.color = "red";
		contrapc = true;
	}

}
function player_preto() {
	turn_pc = 2;
	if (playerB) {
		document.getElementById("peca_branca").style.color = "white";
		playerB = false;
		playerP = true;
		document.getElementById("peca_preta").style.color = "red";

	}
	else {
		document.getElementById("peca_preta").style.color = "red";
		playerP = true;
	}
}

function player_branco() {
	turn_pc = 1;
	if (playerP) {
		document.getElementById("peca_preta").style.color = "white";
		playerB = true;
		playerP = false;
		document.getElementById("peca_branca").style.color = "red";
	}
	else {
		document.getElementById("peca_branca").style.color = "red";
		playerB = true;
	}
}

function sair_regras() {
	document.getElementById("regras").style.visibility = "hidden";
}

function abrir_regras() {
	document.getElementById("regras").style.visibility = "visible";
}

function sair_ranking() {
	document.getElementById("ranking").style.visibility = "hidden";
}

function desistir(winner) {

	let alerta = document.getElementById("alert_desistiu");
	console.log("desiste");


	if (nick == winner) {

		alerta.style.visibility = "visible";
		console.log("O preto desistiu");
		let brake = document.createElement("br");
		alerta.innerHTML = "";
		alerta.appendChild(document.createTextNode(nick2 + " DESISTIU "));
		alerta.appendChild(brake);
		alerta.appendChild(document.createTextNode("VENCEU O JOGADOR " + nick));

		//alerta.addEventListener("click", function(){ hide_desiste() });
	}
	else {

		console.log("O branco desistiu");
		let brake = document.createElement("br");
		alerta.innerHTML = "";
		alerta.appendChild(document.createTextNode(nick + " DESISTIU "));
		alerta.appendChild(brake);
		alerta.appendChild(document.createTextNode("VENCEU O JOGADOR " + nick2));
		alerta.style.visibility = "visible";
		//alerta.addEventListener("click", function(){ hide_desiste() });
	}
	if (!contrapc) {
		console.log("Saí");
		leave(nick, pass, gameId);
		console.log("Ja saí");
	}

}

function hide() {
	let alerta = document.getElementById("alert");
	alerta.style.visibility = "hidden";
}

function hide_desiste() {
	let alerta = document.getElementById("alert_desistiu");
	alerta.style.visibility = "hidden";
	//ranking = pedir_ranking();
	//ranking.sort();
	//ranking.reverse();
	start();
	mostrar_ranking();

}

function hide_configuracao() {

	let config = document.getElementById("configuracao");
	let game_state = document.getElementById("game_state");
	let button_options = document.getElementById("button_options");
	let pointsOfPlayerTwo = document.getElementById("pointsOfPlayerTwo");
	let pointsOfPlayerOne = document.getElementById("pointsOfPlayerOne");
	let login = document.getElementById("login_background");
	let login2 = document.getElementById("login_background2");

	if (contrapc) {
		nick2 = "PC";
	}

	if (playerP) {
		let aux = nick;
		nick = nick2;
		nick2 = aux;
	}
	/*
		f (playerB == false && playerP == false) {
		let alerta = document.getElementById("alert");
		alerta.innerHTML = "";
		//alerta.appendChild(document.createTextNode("ESCOLHA UMA COR"));
		alerta.style.visibility = "visible";
		alerta.addEventListener("click", function () { hide() });
	}*/
	//else {

	if (config.style.display === "none") {
		config.style.display = "block";
	}
	else {
		login.style.visibility = "hidden";
		login2.style.visibility = "hidden";
		config.style.display = "none";
		game_state.style.display = "flex";
		button_options.style.display = "flex";
		pointsOfPlayerOne.style.visibility = "visible";
		pointsOfPlayerTwo.style.display = "flex";

	}
	start();

	//}

}

function mostrarCelulas() {
	for (let row = 0; row < 8; row++) {
		for (let column = 0; column < 8; column++) {
			let celula = document.createElement("div");
			celula.style.position = "absolute";
			celula.style.width = larguraCelula + 'px';
			celula.style.height = larguraCelula + 'px';
			celula.style.backgroundColor = "green";
			celula.style.left = ((larguraCelula + espacamento) * column - 1) + 'px';
			celula.style.top = ((larguraCelula + espacamento) * row - 1) + 'px';
			celula.style.border = "2px solid black";
			celula.style.borderRadius = '20%';
			celula.addEventListener("click", clickedCelula.bind(null, row, column), false);
			fundoTabuleiro.appendChild(celula);
		}
	}
}


function clickedCelula(row, column) {
	if (peca[row][column] != 0) {
		return;
	}

	if (can_click(row, column) == true) {
		if (contrapc) {
			let affectedpeca = getPecasAfetadas(row, column);
			flippeca(affectedpeca);
			peca[row][column] = turn;
			if (turn == 1) {
				turn = 2;
				document.getElementById("pointsOfPlayerTwo").style.border = "2px solid red";
				document.getElementById("pointsOfPlayerOne").style.border = "2px solid black";
			}
			else {
				turn = 1;
				document.getElementById("pointsOfPlayerOne").style.border = "2px solid red";
				document.getElementById("pointsOfPlayerTwo").style.border = "2px solid white";
			}
		}
		else {

			notify(nick, pass, gameId, row, column);
		}
		for (let i = 0; i < 8; i++)
			console.log(peca[i]);
		place_pecas();
	}
	else {
		let alerta = document.getElementById("alert");
		alerta.innerHTML = "";
		alerta.appendChild(document.createTextNode("JOGADA INVALIDA"));
		alerta.style.visibility = "visible";
		alerta.addEventListener("click", function () { hide() });
	}

}

function botao_skip() {
	if (contrapc) {
		if (passar() == true) {
			if (turn == 1) {
				turn = 2;
			}
			else turn = 1;
		}
	}
	else notify_skip(nick, pass, gameId);
	place_pecas();
}

function passar() {
	if (!pode_passar()) {
		alerta_not_skip();
		return false;
	}
	else {
		alerta_skip();
		if (contrapc)
			if (turn == 2) {
				document.getElementById("pointsOfPlayerTwo").style.border = "2px solid red";
				document.getElementById("pointsOfPlayerOne").style.border = "2px solid black";
			}
			else {
				document.getElementById("pointsOfPlayerOne").style.border = "2px solid red";
				document.getElementById("pointsOfPlayerTwo").style.border = "2px solid white";
			}

		return true;
	}

}

function alerta_skip() {
	let alerta = document.getElementById("alert");
	alerta.innerHTML = "";
	if (turn == 1) {
		alerta.appendChild(document.createTextNode("O " + nick2 + " PASSOU"));
	}
	else {
		alerta.appendChild(document.createTextNode("O " + nick + " PASSOU"));
	}
	alerta.style.visibility = "visible";
	alerta.addEventListener("click", function () { hide() });
}

function alerta_not_skip() {
	let alerta = document.getElementById("alert");
	alerta.innerHTML = "";
	alerta.appendChild(document.createTextNode("NÃO PODE PASSAR"));
	alerta.style.visibility = "visible";
	alerta.addEventListener("click", function () { hide() });
}

function pode_passar() {
	for (let i = 0; i < 8; i++)
		for (let j = 0; j < 8; j++)
			if (can_click(i, j)) {
				return false;
			}
	console.log("pode passar");
	return true;
}

function ai_click() {

	let maior = 0;
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			let affected = getPecasAfetadas(i, j);
			if (maior < affected.length) {
				maior = affected.length;
				ai_r = i;
				ai_c = j;
			}
		}
	}
	if (maior == 0) {
		botao_skip();
	}
	else {
		clickedCelula(ai_r, ai_c);
	}

}

function can_click(row, column) {
	let affectedpeca = getPecasAfetadas(row, column);
	console.log("tamanho " + affectedpeca.length);
	if (affectedpeca.length == 0) return false;
	return true;
}
function getPecasAfetadas(row, column) {
	if (peca[row][column] != 0) {
		return [];
	}

	let coluna_aux;
	let linha_aux;
	//direita
	let affectedpeca = [];
	let possivelmenteAfetados = [];
	coluna_aux = column;

	while (coluna_aux < 7) {
		coluna_aux++;
		let valueAtSpot = peca[row][coluna_aux];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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
		let valueAtSpot = peca[row][coluna_aux];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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
		let valueAtSpot = peca[linha_aux][column];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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
		let valueAtSpot = peca[linha_aux][column];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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
		let valueAtSpot = peca[linha_aux][coluna_aux];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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
		let valueAtSpot = peca[linha_aux][coluna_aux];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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
		let valueAtSpot = peca[linha_aux][coluna_aux];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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
		let valueAtSpot = peca[linha_aux][coluna_aux];
		if (valueAtSpot == 0 || valueAtSpot == turn) {
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

function flippeca(affectedpeca) {
	for (let i = 0; i < affectedpeca.length; i++) {
		let spot = affectedpeca[i];
		if (peca[spot.row][spot.column] == 1) {
			peca[spot.row][spot.column] = 2;
		}
		else {
			peca[spot.row][spot.column] = 1;
		}
	}
}

function verifica_se_termina(pontos_branco, pontos_preto) {
	let turn_aux = turn;
	let alerta = document.getElementById("alert_desistiu");
	turn = 1;


	if (!pode_passar()) {
		turn = turn_aux;
		return false;
	}
	turn = 2;
	if (!pode_passar()) {
		turn = turn_aux;
		return false;
	}

	// Se chegar aqui é pq o jogo acabou
	if (pontos_branco > pontos_preto) {
		//ranking.push(pontos_branco);
		turn = 2;

	}
	else if (pontos_preto > pontos_branco) {
		//ranking.push(pontos_preto);
		turn = 1;
	}
	else {
		turn = 0;
	}

	if (turn == 1) {
		alerta.innerHTML = "";
		alerta.appendChild(document.createTextNode(nick2 + " VENCEU"));
	}
	else if (turn == 2) {
		alerta.innerHTML = "";
		alerta.appendChild(document.createTextNode(nick + " VENCEU"));
	}
	else {
		alerta.innerHTML = "";
		alerta.appendChild(document.createTextNode("EMPATE"));
	}

	alerta.style.visibility = "visible";
	console.log("Termina");
	return true;
}

function mostrar_ranking() {
	let conteudo = document.getElementById("texto_ranking");
	document.getElementById("ranking").style.visibility = "visible";
	conteudo.innerHTML = "";
	ranking = pedir_ranking();


}

function place_pecas() {
	pontos_branco = 0;
	pontos_preto = 0;
	camada_peca.innerHTML = "";
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			let value = peca[i][j];
			if (value != 0) {
				let disc = document.createElement("div");
				disc.style.position = "absolute";
				disc.style.width = (larguraCelula - 6) + 'px';
				disc.style.height = (larguraCelula - 6) + 'px';
				disc.style.borderRadius = "50%";
				disc.style.left = ((larguraCelula + espacamento) * j - 2 + espacamento + 3) + 'px';
				disc.style.top = ((larguraCelula + espacamento) * i - 2 + espacamento + 3) + 'px';
				disc.style.zIndex = "999";
				if (value == 1) {
					disc.style.backgroundColor = "black";
					pontos_preto++;
				}
				if (value == 2) {
					disc.style.backgroundColor = "white";
					pontos_branco++;
				}
				camada_peca.appendChild(disc);
			}

		}
	}
	if (contrapc) {
		if (turn == 2) {
			//turn = 2;
			document.getElementById("pointsOfPlayerTwo").style.border = "2px solid red";
			document.getElementById("pointsOfPlayerOne").style.border = "2px solid black";
		}
		else {
			//turn = 1;
			document.getElementById("pointsOfPlayerOne").style.border = "2px solid red";
			document.getElementById("pointsOfPlayerTwo").style.border = "2px solid white";
		}

		let brake = document.createElement("br");
		let p1 = document.getElementById("player1");
		p1.innerHTML = "";
		p1.appendChild(document.createTextNode("PC"));
		p1.appendChild(brake);
		p1.appendChild(document.createTextNode(" Pontos: " + pontos_preto));

		let p2 = document.getElementById("player2");
		let brake2 = document.createElement("br");
		p2.innerHTML = "";
		p2.appendChild(document.createTextNode(nick));
		p2.appendChild(brake2);
		p2.appendChild(document.createTextNode(" Pontos: " + pontos_branco));


	}
	else {

		if (turn_game == 1) {
			//turn = 2;
			document.getElementById("pointsOfPlayerTwo").style.border = "2px solid red";
			document.getElementById("pointsOfPlayerOne").style.border = "2px solid black";
		}
		else {
			//turn = 1;
			document.getElementById("pointsOfPlayerOne").style.border = "2px solid red";
			document.getElementById("pointsOfPlayerTwo").style.border = "2px solid white";
		}

		if (turn == 1) {
			let brake = document.createElement("br");
			let p1 = document.getElementById("player1");
			p1.innerHTML = "";
			p1.appendChild(document.createTextNode(nick));
			p1.appendChild(brake);
			p1.appendChild(document.createTextNode(" Pontos: " + pontos_preto));

			let p2 = document.getElementById("player2");
			let brake2 = document.createElement("br");
			p2.innerHTML = "";
			p2.appendChild(document.createTextNode(nick2));
			p2.appendChild(brake2);
			p2.appendChild(document.createTextNode(" Pontos: " + pontos_branco));
		}
		else {
			let brake = document.createElement("br");
			let p1 = document.getElementById("player2");
			p1.innerHTML = "";
			p1.appendChild(document.createTextNode(nick));
			p1.appendChild(brake);
			p1.appendChild(document.createTextNode(" Pontos: " + pontos_branco));

			let p2 = document.getElementById("player1");
			let brake2 = document.createElement("br");
			p2.innerHTML = "";
			p2.appendChild(document.createTextNode(nick2));
			p2.appendChild(brake2);
			p2.appendChild(document.createTextNode(" Pontos: " + pontos_preto));
		}
	}

	let brake = document.createElement("br");
	let brake2 = document.createElement("br");
	let pbranco = document.createTextNode("branco: " + pontos_branco);
	let ppreto = document.createTextNode("preto: " + pontos_preto);
	let plivre = document.createTextNode("Livres: " + (64 - (pontos_branco + pontos_preto)));
	let aux = document.getElementById("game_state");

	aux.innerHTML = "";
	aux.appendChild(pbranco);
	aux.appendChild(brake);
	aux.appendChild(ppreto);
	aux.appendChild(brake2);
	aux.appendChild(plivre);

	if (!verifica_se_termina(pontos_branco, pontos_preto) && turn == turn_pc && contrapc) {
		setTimeout(function () { ai_click(); }, 1000);
		//console.log("verifica");
		//verifica_se_termina(pontos_branco, pontos_preto);
	}

}

