var appContainer = document.getElementById('app-container');

var app = {
	levelListId: 'level-list',
	gridListId: 'grid-list',

	levels: [2, 4, 6, 8],
	dataArray: [],

	cellSize: 50,
	prevGuess: 0,

	init: {
		game: function () {
			app.init.levels();
		},

		levels: function () {
			var ul = document.createElement('ul'),
				listElements = '',
				levelLength = app.levels.length;

			for (var i = 0; i < levelLength; i++) {
				var label = app.levels[i];

				listElements += '<li>';
				listElements += '<button class="btn" data-level-value="' + label + '">' + label + 'x' + label + '</button>';
				listElements += '</li>';
			}

			ul.id = app.levelListId;
			ul.innerHTML = listElements;

			appContainer.appendChild(ul);
			app.eventHandler.attachLevelEvent();
		},

		matrixStructure: function (dimension) {
			var size = dimension * dimension,
				listElements = '';

			for (var i = 0; i < size; i++) {
				listElements += '<li></li>';
			}

			var ul = document.createElement('ul');

			ul.id = app.gridListId;
			ul.style.width = (app.cellSize * dimension + 2) + 'px'; // add 2px; left and right border
			ul.innerHTML = listElements;

			var gridList = document.getElementById(app.gridListId);

            // remove matrix if already present
			if (gridList) {
				gridList.parentNode.removeChild(gridList);
			}

			appContainer.appendChild(ul);
			app.eventHandler.attachMatrixEvent();
		},

		matrixData: function (dimension) {
			var maxCount = (dimension * dimension) / 2;

			app.dataArray = [];

			for (var i = 1; i <= maxCount; i++) {
				app.dataArray.push(i, i);
			}

			app.init.shuffleMatrixData();
		},

		shuffleMatrixData: function () {
			var count = app.dataArray.length;

			while (count > 0) {
				var randomIndex = Math.floor(Math.random() * count);

				count--;

				var temp = app.dataArray[count];
				app.dataArray[count] = app.dataArray[randomIndex];
				app.dataArray[randomIndex] = temp;
			}
		},

		resetMatrix: function () {
			var listElements = document.getElementById(app.gridListId).querySelectorAll('li'),
				elementLength = listElements.length;

			for (var i = 0; i < elementLength; i++) {
				listElements[i].innerHTML = '';
				listElements[i].style.pointerEvents = '';
			}

			app.prevGuess = 0;
		},
	},

	eventHandler: {
		attachLevelEvent: function () {
			var listElements = document.getElementById(app.levelListId).querySelectorAll('button'),
				elementLength = listElements.length;

			for (var i = 0; i < elementLength; i++) {
				listElements[i].addEventListener('click', app.eventHandler.levelSelection);
			}
		},

		attachMatrixEvent: function () {
			var listElements = document.getElementById(app.gridListId).querySelectorAll('li'),
				elementLength = listElements.length;

			for (var i = 0; i < elementLength; i++) {
				(function (index) {
					listElements[i].onclick = function () {
						app.eventHandler.cellSelection(index);
					};
				})(i);
			}

		},

		levelSelection: function (event) {
			var levelValue = Number(event.target.getAttribute('data-level-value'));

			app.init.matrixStructure(levelValue);
			app.init.matrixData(levelValue);
		},

		cellSelection: function (index) {
			if (!app.prevGuess) {
				app.eventHandler.setData(index);
				app.prevGuess = app.dataArray[index];
			}
			else {
				if (app.dataArray[index] == app.prevGuess) {
					app.eventHandler.setData(index);
					app.prevGuess = 0;
				}
				else {
					app.init.resetMatrix();
					app.eventHandler.setData(index);
					app.prevGuess = app.dataArray[index];
				}
			}
		},

		setData: function (index) {
			var element = document.getElementById(app.gridListId).querySelectorAll('li')[index];

			element.innerHTML = app.dataArray[index];
			element.style.pointerEvents = 'none';
		}
	}
};

app.init.game();
