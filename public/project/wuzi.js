angular.module("wuziApp", []).controller("boardController" , function ($scope) {
	var WIDTH = 5;
	var board = createBoard(WIDTH, WIDTH);
	var unitWidth = 900 / WIDTH;
	var map = board.getMap();
	var selectedWhite, selectedBlack, selected;
	var w = board.getWhites();
	var b = board.getBlacks();
	var t = [];
	var horizaontalLines = [];
	var verticalLines = [];
	var SIZE = 25;
	var i;
	$scope.targets = [];
	$scope.mode = 0;
	for (i = 0; i < WIDTH; i++) {
		horizaontalLines[i] = {x1:unitWidth / 2, y1:unitWidth / 2 + i * unitWidth, x2:900 - unitWidth / 2, y2:unitWidth / 2 + i * unitWidth};
		verticalLines[i] = [unitWidth / 2 + i * unitWidth, unitWidth / 2, unitWidth / 2 + i * unitWidth, 900 - unitWidth / 2];
	}
	var trans = function (array, width) {
		var ret = [];
		for (var i = 0; i < array.length; i++) {
			ret[i] = {};
			ret[i].x = array[i] % WIDTH * unitWidth + unitWidth / 2;
			ret[i].y = Math.floor(array[i] / WIDTH) * unitWidth + unitWidth / 2;
			ret[i].selected = false;
		};
		return ret;
	};


	var setAllFalse = function (array) {

	};


	$scope.selectWhite = function (idx) {
		if ($scope.mode === 0) {
			return 0;
		}
		if (selectedWhite !== undefined) {
			$scope.whites[selectedWhite].selected = false;
		}
		$scope.whites[idx].selected = true;
		w = board.getWhites();
		selectedWhite = idx;
		selected = w[idx];
		console.log("************************************************************************");
		console.log("map", map, board.w())
		t = board.getTarget(selected, map);
		$scope.targets = trans(t, WIDTH);
		console.log(board.getNextAction(1, map, 4));
	};
	$scope.selectBlack = function (idx) {
		if (selectedBlack !== undefined) {
			$scope.blacks[selectedBlack].selected = false;
		}
		b = board.getBlacks();
		$scope.blacks[idx].selected = true;
		selectedBlack = idx;
		selected = b[idx];
		console.log("********************************************************************************");
		console.log("map", map, board.b());
		t = board.getTarget(selected, map);
		$scope.targets = trans(t, WIDTH);
		console.log(board.getNextAction(-1, map, 4));
	};


	$scope.moveToTarget = function (idx) {
		var action = new Action(selected, t[idx]);
		var ate = board.eatTest(action, map);
		var a;
		board.eat(ate, map);
		board.move(action, map);
		$scope.blacks = trans(board.getBlacks(), WIDTH);
		$scope.whites = trans(board.getWhites(), WIDTH);
		$scope.targets = [];
		a = board.getNextAction(1, map, 4);
		ate = board.eatTest(a, map);
		board.eat(ate, map);
		board.move(a, map);
		$scope.blacks = trans(board.getBlacks(), WIDTH);
		$scope.whites = trans(board.getWhites(), WIDTH);
	};
	
	$scope.whites = trans(w, WIDTH);
	$scope.blacks = trans(b, WIDTH);


});



