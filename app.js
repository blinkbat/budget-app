// THE BUDGET CONTROLLER
var budgetController = (function() {

	// capitalized = function constructor
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var data = {

		allItems: {
			exp: [],
			inc: []
		},

		totals: {
			exp: 0,
			inc: 0
		}
	}

	return {

			addItem: function(type, desc, val) {

				var newItem;

				if (type === 'exp') {
					newItem = new Expense(ID, desc, val);
				} else if (type === 'inc') {
					newItem = new Income(ID, desc, val);
				}
				
			}

	}

})();


// THE UI CONTROLLER
var uiController = (function() {

	var domStrings = {
		inputType: 	'.add__type',
		inputDesc: 	'.add__description',
		inputVal: 	'.add__value',
		inputBtn: 	'.add__btn'
	}

	// expose public methods
	return {

		getInput: function() {
			return {
				type: document.querySelector(domStrings.inputType).value, // inc or exp
				description: document.querySelector(domStrings.inputDesc).value,
				value: document.querySelector(domStrings.inputVal).value
			};

		// you need this comma inside of return, obj syntax
		},

		getDomStrings: function() {
			return domStrings;
		}

	};

})();



// THE GLOBAL APP CONTROLLER
// IIFE args are independent of name of controller
// good for module practice -- cuts down on name changing, etc
var appController = ( function(budgetCtrl, uiCtrl) {

	var setupListeners = function() {
		// import domStrings
		var domStrings = uiCtrl.getDomStrings();

		// create btn listener
		document.querySelector(domStrings.inputBtn).addEventListener('click', appAddItem);
		// create keypress listener
		document.addEventListener('keypress', function(event) {
			// two different ways to find keycode
			if (event.keyCode === 13 || event.which === 13) {
				appAddItem();
			}
		});

	}

	var appAddItem = function() {
		// get input data
		var input = uiCtrl.getInput();
		console.log(input);

		// add item to budget controller

		// add item to ui controller

		// calculate new budget

		// display budget
	}

	return {
		init: function() {
			console.log('Application online.');
			setupListeners();
		}

	}


// the args are called at the end by the IIFE
})(budgetController, uiController);


appController.init();










