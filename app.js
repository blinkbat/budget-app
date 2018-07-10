// THE BUDGET CONTROLLER
var budgetController = (function() {

	// capitalized = function constructor
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};


	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};


	var calculateTotal = function(type) {

		var sum = 0;

		data.allItems[type].forEach( function(curr) {
			sum += curr.value;
		});

		data.totals[type] = sum;

	};


	var data = {

			allItems: {
				exp: [],
				inc: []
			},

			totals: {
				exp: 0,
				inc: 0
			},

			budget: 0,

			// -1 means nonexistent? ok
			percentage: -1

	};


	return {

			addItem: function(type, desc, val) {

				// var setup
				var newItem, ID;

				// id should be the last item in arr + 1 (ie. length - 1)
				// look carefully at this line
				if (data.allItems[type].length > 0) {
					ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
				} else {
					ID = 0;
				}

				// create newItem based on type
				if (type === 'exp') {
					newItem = new Expense(ID, desc, val);
				} else if (type === 'inc') {
					newItem = new Income(ID, desc, val);
				}
				
				// push the newItem to the corresponding array in data obj
				data.allItems[type].push(newItem);

				// return the newItem
				return newItem;

			},

			calculateBudget: function() {

				// calc total income & expenses
				calculateTotal(exp);
				calculateTotal(inc);

				// calc the budget: inc - exp
				data.budget = data.totals.inc - data.totals.exp;

				// calc the percentage of spent income
				data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );

			},

			testing: function() {
				console.log(data);
			}

	}

})();





// THE UI CONTROLLER
var uiController = (function() {

	var domStrings = {
		inputType: 		'.add__type',
		inputDesc: 		'.add__description',
		inputVal: 		'.add__value',
		inputBtn: 		'.add__btn',
		incContainer: '.income__list',
		expContainer: '.expenses__list'
	};

	// expose public methods
	return {

		getInput: function() {
			return {
				type: document.querySelector(domStrings.inputType).value, // inc or exp
				description: document.querySelector(domStrings.inputDesc).value,
				value: parseFloat( document.querySelector( domStrings.inputVal ).value )
			};

		// you need this comma inside of return, obj syntax
		},

		addListItem: function(obj, type) {

			var html, newHtml, element;

			// create HTML str
			if (type === 'inc') {

					element = domStrings.incContainer;

					html = '<div class="item clearfix" id="income-$id$"><div class="item__description">$descrip$</div><div class="right clearfix"> <div class="item__value">$value$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			} else if (type === 'exp') {

					element = domStrings.expContainer;

					html = '<div class="item clearfix" id="expense-$id$"><div class="item__description">$descrip$</div><div class="right clearfix"><div class="item__value">$value$</div><div class="item__percentage">$percent$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}

			// populate str with data
			newHtml = html.replace('$id$', obj.id);
			newHtml = newHtml.replace('$descrip$', obj.description);
			newHtml = newHtml.replace('$value$', obj.value);

			// insert HTML to DOM
			// uses insertAdjacentHTML method -- see args
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function() {

			// returns a list, not an arr
			fields = document.querySelectorAll(domStrings.inputDesc + ', ' + domStrings.inputVal);

			// convert the returned list to arr using slice method -- sneaky
			// slice lives in Array proto
			// uses call method to "trick" js into making our arr
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array) {

				current.value = '';

			});

			fieldsArr[0].focus();

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

	var appSetupListeners = function() {
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

	};

	var appUpdateBudget = function() {

		// calculate new budget



		// return the budget



		// display budget



	};

	var appAddItem = function() {

			// var declare
			var input, newItem;

			// get input data
			var input = uiCtrl.getInput();
			console.log(input);

			// check for data
			if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

					// add item to budget controller
					var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

					// add item to ui controller
					uiCtrl.addListItem(newItem, input.type);

					// clear the fields
					uiCtrl.clearFields();

					// calculate & update budget
					appUpdateBudget();

			}

	};

	return {
		init: function() {
			console.log('Application online.');
			appSetupListeners();
		}

	};


// the args are called at the end by the IIFE
})(budgetController, uiController);


appController.init();










