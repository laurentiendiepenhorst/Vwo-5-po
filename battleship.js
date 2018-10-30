function resetFunction() {
	//console.log("bla");
	//document.getElementById("myform").reset();
	location.reload();
}

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	//Hier wordt de boardsize naar 7 gezet(horizontaal en verticaal)
	//Er zijn 3 schepen van 3 vakjes lang
	//Er zijn nog 0 schepen gezonken
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

//Hier worden de locaties van de schepen op 0 gezet zodat ze later random kunnen worden bepaald
//Het aantal hits worden ook naar 0 gezet omdat de speler nog geen schip heeft geraakt

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			//Met deze for loop wordt er gekeken naar iedere keer dat de speler iets raakt
			//of het al eerder is geraakt en zo ja wordt daar een bericht van gegeven
			//of een schip geraakt is en zo ja wordt daar bericht van gegeven
			//of een schip is gezonken en zo ja wordt daar bericht van gegeven
			//of er gemist is en zo ja wordt daar bericht van gegeven
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	    //hier wordt er gekeken hoeveel keer een schip geraakt is en of een schip dus al gezonken is
	    //als het nog niet gezonken is is het false en zowel is het true
	},
	

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
		//Hier worden de locaties van de schepen random bepaald doormiddel van andere functies zoals generateShip en collision
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { 
			row = Math.floor(Math.random() * this.boardSize);
			//De rij locatie wordt bepaald door een random nummer keer de grootte van het bord en dan afgerond
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		//De kolom locatie wordt bepaald door een random nummer keer de grootte van het bord min de lengte van het schip plus 1 en dat afgerond.
		//Hier wordt het schip naar horizontaal gezet
		    
		    
		} else { 
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		//Hier gebeurt precies hetzelfde alleen dan andersom bij het horizontale gedeelte
		//Hier wordt het schip naar verticaal gezet
		    
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
				//Hier wordt het bepaald als het schip horizontaal staat
			} else {
				newShipLocations.push((row + i) + "" + col);
				//En hier als het verticaal staat
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
				//Hier wordt ervoor gezorgd dat twee schepen niet elkaar overlappen
			}
		}
		return false;
	}
	
}; 


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
		//Hier is er een plek gemaakt voor een message en die wordt aangepast aan wat de message is
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
		//Hier wordt de klasse hit aangeroepen als er iets geraakt is
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
		//Hier wordt de klasse miss aangeroepen als er een schip gemist is
	}

}; 

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			
			    //Hier staat dat wanneer als de gezonken schepen gelijk is aan het aantal schepen dan komt er een bericht dat alle schepen zijn gezonken
			    
			}
		}
	}
}


function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} 
	//Als wat er geraden is gelijk is aan null of groter is dan 2 wordt dit bericht weergegeven
	else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		//Hierboven wordt gezet dat het de rij het eerste karakter heeft en de column het tweede karakter heeft
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
			//Als wat er geraden is niet een nummer is wordt dit bericht weergegeven
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
			//Als wat er geraden is naast het bord ligt wordt dit bericht weergegeven
		} else {
			return row + column;
		}
	}
	return null;
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
	//Iedere keer dat de speler iets raad wordt er gekeken naar de controller variabele en dan wordt de input terug gezet naar leeg
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
		//Dit is een event die gaat over als je op de knop klikt dat er iets gaat gebeuren
	}
}

window.onload = init;

function init() {

	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}
//Als de pagina wordt opgestart wordt alles op de achtergrond opgeladen
