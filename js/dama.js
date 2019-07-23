var turn = 0;
var selected = [];
var light = 12;
var dark = 12;
var winner = document.getElementById('winner');


function makeChessBoard(){
	winner.innerHTML = '';
	winner.removeEventListener('click',restart);
	letters = ['','a','b','c','d','e','f','g','h',''];
	var chessBoard = document.createElement('table');
	chessBoard.setAttribute('id','chessBoard');
	document.body.appendChild(chessBoard);
	var Lrow = document.createElement('tr');
	Lrow.setAttribute('class','letters');
	chessBoard.appendChild(Lrow);
	for(var i = 0; i < letters.length; i++){
		col = document.createElement('td');
		col.innerHTML = letters[i];
		Lrow.appendChild(col);
	}
	for(var r = 1; r < 9; r++){
		row = document.createElement('tr');
		row.setAttribute('id',String(r));
		for(var c = 0; c < 10; c++){
			col = document.createElement('td');
			if(c == 0 || c == 9){
				col.setAttribute('class','numbers');
				col.innerHTML = r;
			}
			else{
				col.setAttribute('x',String(r));
				col.setAttribute('y',String(c));
				if((c % 2 == 0 && r % 2 == 0) || (c % 2 != 0 && r % 2 != 0)){
					col.setAttribute('class','light');
				}
				else{
					col.setAttribute('class','dark');
					if((r >= 1 && r <= 3) || (r >= 6 && r <= 8)){
						img = document.createElement('img');
						img.addEventListener('click',selector);
						if(r >= 1 && r <= 3){
							img.setAttribute('side','light');
							img.src = 'imgs/light.png';
						}
						else{
							img.setAttribute('side','dark');
							img.src = 'imgs/dark.png';
						}
						col.appendChild(img);
					}
				}
			}
			row.appendChild(col);
		}
			chessBoard.appendChild(row);
	}
	var cln = Lrow.cloneNode(true);
	chessBoard.appendChild(cln);
}


  //____________//
 // - Select - //
//____________//
function selector(){
	var sel = document.getElementsByClassName('selected');
	if(sel.length == 0){
		var pos = this.parentNode;
		var x = pos.getAttribute('x');
		var y = pos.getAttribute('y');
		selected[0] = x;
		selected[1] = y;
		selected[2] = this;
		var access = false;
		// - Light turn - //
		if(turn % 2 == 0 && selected[2].getAttribute('side') == 'light'){
			access = true;
		}
		// - Dark turn - //
		else if(turn % 2 != 0 && selected[2].getAttribute('side') == 'dark'){
			access = true;
		}
		if(access){
			if(this.getAttribute('id') == 'king'){
				getSquaresKing();
			}
			else{
				getSquares();
			}
			pos.setAttribute('class','selected');
		}
		else{
			console.log("it's not your turn!");		
		}	
	}
	
	else{
		deselect();
	}
}

  //______________________//
 // - Activate squares - //
//______________________//
function getSquares(){
	// - Light turn - //
	if(turn % 2 == 0){
		var fw = parseInt(selected[0]) + 1;
	}
	// - Dark turn - //
	else if(turn % 2 != 0){
		var fw = parseInt(selected[0]) - 1;
	}
	var row = document.getElementById(String(fw));
	for(var i = -1; i < 2; i+=2){
		var square = row.querySelector('[y="' + String(parseInt(selected[1]) + i) + '"]');
		// - Check empty - //
		if(square != null){
			if(square.getElementsByTagName('img').length == 0){
				square.setAttribute('class','active');
				square.addEventListener('click',moveTo);
			}	
		}
	}
	checkOpponent(fw);
}	

  //____________________//
 // - Check Opponent - //
//____________________//
function checkOpponent(fw){
	for(var i = -1; i < 2; i+=2){
		var row = document.getElementById(String(fw));
		var square = row.querySelector('[y="' + String(parseInt(selected[1]) + i) + '"]');
		console.log(square)
		if(square != null){
			if(square.getElementsByTagName('img').length > 0 && square.getElementsByTagName('img')[0].getAttribute('side') != selected[2].getAttribute('side')){
				row = document.getElementById(String((fw - parseInt(selected[0])) + fw));
				if(row != null){
					freeSquare = row.querySelector('[y="' + String(parseInt(selected[1]) + i*2)  + '"]');
					if(freeSquare != null){ 
						if(freeSquare.getElementsByTagName('img').length == 0){
							square.setAttribute('class','deletable');
							freeSquare.setAttribute('class', 'eat');
							freeSquare.addEventListener('click',eatIt);
						}
					}
				}
			}
		}
	}	
}

  //_______________//
 // - King Move - //
//_______________//
function getSquaresKing(){
	for(var r = -1; r < 2; r+=2){
		var row = document.getElementById(String(parseInt(selected[0]) + r));
		for(var c = -1; c < 2; c+=2){
			if(row != null){
				var square = row.querySelector('[y="' + String(parseInt(selected[1]) + c) + '"]');
				if(square != null){ 
					if(square.getElementsByTagName('img').length == 0){
						square.setAttribute('class','active');
						square.addEventListener('click',moveTo);
					}
				}	
			}
		}
	}
	checkFood();
}

  //____________________//
 // - Check opponent - //
//____________________//
function checkFood(){
	selected[0] = selected[2].parentNode.getAttribute('x');
	selected[1] = selected[2].parentNode.getAttribute('y');
	for(var r = -1; r < 2; r+=2){
		var row = document.getElementById(String(parseInt(selected[0]) + r));
		for(var c = -1; c < 2; c+=2){
			if(row != null){
				var square = row.querySelector('[y="' + String(parseInt(selected[1]) + c) + '"]');
				if(square != null){
					if(square.getElementsByTagName('img').length > 0 && square.getElementsByTagName('img')[0].getAttribute('side') != selected[2].getAttribute('side')){
						row = document.getElementById(String(parseInt(selected[0]) + r*2));
						if(row != null){
							var freeSquare = row.querySelector('[y="' + String(parseInt(selected[1]) + c*2) + '"]'); 
							if(freeSquare != null){
								if(freeSquare.getElementsByTagName('img').length == 0){
									freeSquare.setAttribute('class','eat');
									freeSquare.addEventListener('click',eatIt);
									square.setAttribute('class','deletable');
								}
							}
						}
					}
				}
			}
		}
	}
}
  //______________________//
 // - Remove Listeners - //
//______________________//
function removeListeners(){
	var img = document.getElementsByTagName('img');
	if(document.getElementsByClassName('eat').length > 0){
		selected[2].parentNode.setAttribute('class','selected');
		for(var i = 0; i < img.length; i++){
			img[i].removeEventListener('click',selector);	
		}
	}
	else{
		for(var i = 0; i < img.length; i++){
			img[i].addEventListener('click',selector);	
		}
		turn ++;
	}
}

  //______________//
 // - Deselect - //
//______________//
function deselect(){
	if(selected[2].parentNode.getAttribute('class') == 'selected'){
		selected[2].parentNode.setAttribute('class','dark');
		LR = document.getElementsByClassName('active');
		for(var i = LR.length-1; i >= 0; i--){
			LR[i].removeEventListener('click',moveTo);
			LR[i].setAttribute('class','dark');
		}	
		LR = document.getElementsByClassName('eat');
		for(var i = LR.length-1; i >= 0; i--){
			LR[i].removeEventListener('click',eatIt);
			LR[i].setAttribute('class','dark');
		}
		var red = document.getElementsByClassName('deletable');
		for(var i = red.length - 1; i >= 0; i--){
			red[i].setAttribute('class','dark');
		}
	}
}
  //_______________//
 // - Set Kings - //
//_______________//
function setKings(square){
	if(turn % 2 == 0 && square.getAttribute('x') == '8'){
		selected[2].src = 'imgs/lightKing.png';
		selected[2].setAttribute('id','king');
	}
	else if(turn % 2 != 0 && square.getAttribute('x') == '1'){
		selected[2].src = 'imgs/darkKing.png';
		selected[2].setAttribute('id','king');
	}
}

  //__________//
 // - Move - //
//__________//
function moveTo(){
	deselect();
	this.appendChild(selected[2]);
	setKings(this);
	turn ++;
}
  //__________________//
 // - Eat opponent - //
//__________________//
function eatIt(){
    // - Search deletable position - //
	if(parseInt(selected[0]) > parseInt(this.getAttribute('x'))){
		var x = parseInt(selected[0]) - 1;
	}
	else{
		var x = parseInt(selected[0]) + 1;
	}
	if(parseInt(selected[1]) > parseInt(this.getAttribute('y'))){
		var y = parseInt(selected[1]) - 1;
	}
	else{
		var y = parseInt(selected[1]) + 1;
	}
	var red = document.getElementsByClassName('deletable');
	for(var i = red.length - 1; i >= 0; i--){
		if(red[i].getAttribute('x') == String(x) && red[i].getAttribute('y') == String(y)){
			red[i].getElementsByTagName('img')[0].remove();
		}
		red[i].setAttribute('class','dark');
	}
	deselect();
	this.appendChild(selected[2]);
	setKings(this);
	checkFood();
	removeListeners();
	if(selected[2].getAttribute('side') == 'light'){
		dark--;
		if(dark == 0){
			winner.innerHTML = 'White wins!';
			winner.addEventListener('click',restart);
		}
	}
	else{
		light--;
		if(light == 0){
			winner.innerHTML = 'Black wins!';
			winner.addEventListener('click',restart);
		}
	}
}


function restart(){
	dark = 12;
	light = 12;
	turn = 0;
	document.getElementById('chessBoard').remove();
	makeChessBoard();
}

makeChessBoard();

