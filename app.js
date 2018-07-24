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

			deleteItem: function(type, id) {

				var idArr, index;

				// roundabout way of finding the key (id)
				var idArr = data.allItems[type].map( function(current) {
					return current.id;
				});

				index = idArr.indexOf(id);

				if (index !== -1) {
					
					// delete item if index present
					// spice method removes elements -- see args
					data.allItems[type].splice(index, 1);

				}

			},

			calculateBudget: function() {

				// calc total income & expenses
				calculateTotal('exp');
				calculateTotal('inc');

				// calc the budget: inc - exp
				data.budget = data.totals.inc - data.totals.exp;

				// calc the percentage of spent income IF possible
				if (data.totals.inc > 0) {
					data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
				} else {
					data.percentage = -1;
				}

			},

			getBudget: function() {

				// this function only returns the budget data
				return {
					budget: 		data.budget,
					totalInc: 	data.totals.inc,
					totalExp: 	data.totals.exp,
					percentage: data.percentage
				}

			},

			testing: function() {
				console.log(data);
			}

	}

})();





// THE UI CONTROLLER
var uiController = (function() {

	var domStrings = {
		inputType: 				'.add__type',
		inputDesc: 				'.add__description',
		inputVal: 				'.add__value',
		inputBtn: 				'.add__btn',
		incContainer: 		'.income__list',
		expContainer: 		'.expenses__list',
		budgetLabel: 			'.budget__value',
		incomeLabel: 			'.budget__income--value',
		expensesLabel: 		'.budget__expenses--value',
		percentageLabel: 	'.budget__expenses--percentage',
		container: 				'.container'
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

					html = '<div class="item clearfix" id="inc-$id$"><div class="item__description">$descrip$</div><div class="right clearfix"> <div class="item__value">$value$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			} else if (type === 'exp') {

					element = domStrings.expContainer;

					html = '<div class="item clearfix" id="exp-$id$"><div class="item__description">$descrip$</div><div class="right clearfix"><div class="item__value">$value$</div><div class="item__percentage">$percent$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}

			// populate str with data
			// setting actual DOM ids etc. is extremely useful for manipulation
			newHtml = html.replace('$id$', obj.id);
			newHtml = newHtml.replace('$descrip$', obj.description);
			newHtml = newHtml.replace('$value$', obj.value);

			// insert HTML to DOM
			// uses insertAdjacentHTML method -- see args
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem: function(selectorId) {

			var item;

			// weird way to delete element. maybe just do display: none?
			item = document.getElementById(selectorId);
			item.parentNode.removeChild(item);

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

		displayBudget: function(obj) {

			document.querySelector(domStrings.budgetLabel).textContent = obj.budget;

			document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;

			document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(domStrings.percentageLabel).textContent = '-';
			}

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

		// event delegation -- select parent class of all inc/exp rows (container)
		document.querySelector(domStrings.container).addEventListener('click', appDeleteItem);

	};

	var appUpdateBudget = function() {

		// calculate new budget
		budgetCtrl.calculateBudget();

		// return the budget
		var budget = budgetCtrl.getBudget();

		// display budget
		uiCtrl.displayBudget(budget);

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

	var appDeleteItem = function(event) {

		var itemId, splitId, type, id;

		// use event arg to determine where user clicked
		// parentNode moves to next outer element in HTML structure
		// invoked parentNode 4x to move up to "item" element

		// hardcoded DOM traversing could potentially be a problem. careful!
		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemId) {

			// split id into parts
			splitId = itemId.split('-');
			type = splitId[0];
			// make sure to convert ID to number for type comparison woes
			id = parseInt(splitId[1]);

			// delete item from data structure
			budgetCtrl.deleteItem(type, id);

			// delete item from UI
			uiCtrl.deleteListItem(itemId);

			// update & show new budget
			appUpdateBudget();

		}

	};

	return {
		init: function() {
			console.log('Application online.');
			uiCtrl.displayBudget({
					budget: 		0,
					totalInc: 	0,
					totalExp: 	0,
					percentage: -1
			});
			appSetupListeners();
		}

	};


// the args are called at the end by the IIFE
})(budgetController, uiController);

// start it up
appController.init();





