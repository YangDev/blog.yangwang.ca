function WuziService() {

}
function Action (from, to) {
	this.to = to;
	this.from = from;
	this.utility = 0;
	this.reverse = function () {
		return {from: this.to, to: this.from};
	};
};

var createBoard = function (m, n) {
	var width = n;
	var height = m;
	var size = n * m;
	var whites = [];
	var blacks = [];
	var map = [];
	var i;
	var path = [];
	var utility = 0;
	var stack = new Array();
	var nextAction;

	function init() {
		var i;
		for (i = 0; i < size; i++) {
			map[i] = 0;
		};

		for (i = 0; i < width; i++) {
			whites[i] = i;
			map[i] = 1;
			blacks[i] = size + i - width;
			map[size + i - width] = -1;
		};
	};

	function getIndex (x, y) {
		return x + y * width;
	};

	function getPieces (color) {
		var ret = [];
		for (var i = 0; i < map.length; i++) {
			if (map[i] === color) {
				ret.push(i);
			};
		};
		return ret;
	}
	/*function findColor (x, y) {
		var i;
		var idx = getIndex(x, y);
		for (i = 0; i < width; i++) {
			if (whites[i] === idx) {
				return 1;
			} else if (blacks[i] === idx) {
				return -1;
			}
		}
		return 0;
	};*/


	function move (action, map) {
		if (map[action.to] !== 0) {
			console.log("error: destination is occupied")
			return false;
		}
		map[action.to] = map[action.from];
		map[action.from] = 0;
		var temp = findPiece(action.from);
		if (temp != -1) {
			temp.array[temp.index] = action.to;
		}
	};

	function findPiece (index) {
		var ret = {};
		for (var i = 0; i < whites.length; i++) {
			if (whites[i] == index) {
				return {array: whites, index: i};
			}

			if (blacks[i] == index) {
				return {array: blacks, index: i};
			}
		};
		return -1;
	};

	function moveByIdx (origin, dest, map) {
		var temp = map[origin];
		map[dest] = temp;
		map[origin] = 0;
		return temp;
	};

	function getTarget (idx, map) {
		var ret = [];
		if (idx - width >= 0 && map[idx - width] == 0) {
			ret.push(idx - width);
		}
		if (idx % width != width - 1 && map[idx + 1] == 0) {
			ret.push(idx + 1);
		}
		if (idx + width < size && map[idx + width] == 0) {
			ret.push(idx + width);
		}
		if (idx % width != 0 && map[idx - 1] == 0) {
			ret.push(idx - 1);
		}
		return ret;
	};

	//get color of location x, y
	function get (array, x, y) {
		if (x >= width || x < 0 || y >= width || y < 0) {
			return 0;
		}
		return array[x + y * width];
	};

	function idxToAxis (idx) {
		return {x: idx % width, y: Math.floor(idx / width)};
	};

	function copyMap (map) {
		var ret = [];
		for (var i = 0; i < map.length; i++) {
			ret[i] = map[i]
		};
		return ret;
	};

	function eat (targetArray, map) {
		/*var pieces;
		if (map[targetArray[0]] === 1) {
			pieces = whites;
		} else {
			pieces = blacks;
		};*/
		for (var i = 0; i < targetArray.length; i++) {
			//pieces.splice(pieces.indexOf(targetArray[i]), 1);
			map[targetArray[i]] = 0;
		};
	};

	function eatTest (action, tempMap) {
		var idx = action.to;
		var orginIdx = action.from;
		var ret = [];
		var axis, x, y, temp;
		if (tempMap[idx] != 0) {
			return ret;
		}
		temp = tempMap[idx];
		tempMap[idx] = tempMap[orginIdx];
		tempMap[orginIdx] = 0;
		
		axis = idxToAxis(idx);
		x = axis.x;
		y = axis.y;
		//console.log("tempMap", tempMap, axis);
		if (tempMap[idx] === get(tempMap, x, y - 1)) {
			if (tempMap[idx] + get(tempMap, x, y - 2) === 0 && get(tempMap, x, y + 1) === 0 && get(tempMap, x, y - 3) === 0) {
				ret.push(getIndex(x, y - 2));
			}
			if (tempMap[idx] + get(tempMap, x, y + 1) === 0 && get(tempMap, x, y + 2) === 0 && get(tempMap, x, y - 2) === 0) {
				ret.push(getIndex(x, y + 1));
			}
		}
		if (tempMap[idx] === get(tempMap, x, y + 1)) {
			if (tempMap[idx] + get(tempMap, x, y - 1) === 0 && get(tempMap, x, y + 2) === 0 && get(tempMap, x, y - 2) === 0) {
				ret.push(getIndex(x, y - 1));
			}
			if (tempMap[idx] + get(tempMap, x, y + 2) === 0 && get(tempMap, x, y + 3) === 0 && get(tempMap, x, y - 1) === 0) {
				ret.push(getIndex(x, y + 2));
			}
		}
		if (tempMap[idx] === get(tempMap, x + 1, y)) {
			if (tempMap[idx] + get(tempMap, x + 2, y) === 0 && get(tempMap, x - 1, y) === 0 && get(tempMap, x + 3, y) === 0) {
				ret.push(getIndex(x + 2, y));
			}
			if (tempMap[idx] + get(tempMap, x - 1, y) === 0 && get(tempMap, x - 2, y) === 0 && get(tempMap, x + 2, y) === 0) {
				ret.push(getIndex(x - 1, y));
			}
		}
		if (tempMap[idx] === get(tempMap, x - 1, y)) {
			if (tempMap[idx] + get(tempMap, x + 1, y) === 0 && get(tempMap, x - 2, y) === 0 && get(tempMap, x + 2, y) === 0) {
				ret.push(getIndex(x + 1, y));
			}
			if (tempMap[idx] + get(tempMap, x - 2, y) === 0 && get(tempMap, x - 3, y) === 0 && get(tempMap, x + 1, y) === 0) {
				ret.push(getIndex(x - 2, y));
			}
		}
		tempMap[orginIdx] = tempMap[idx];
		tempMap[idx] = temp;
		return ret;
		
	};

	/*
	** get the utility after adding given utility
	*/
	function getPathUtility (given) {
		return utility + given;
		
	}

	/*
	** get the number of pieces that given node can eat 
	*/
	function getActionUtility (action, map) {
		return eatTest(action, map).length;
	}

	/*
	*
	*/

	function getBestChildren (pieces, origin, map) {
		var i, temp;
		var best = -1;
		var utl = 0;
		for (i = 0; i < pieces.length; i++) {
			temp = getActionUtility(pieces[i], origin, map);
			if (utl < temp) {
				best = i;
				utl = temp;
			};
		}
		return {index: best, utility: utl};
	};


	function getActions (player, map) {
		var a = [];
		var dest = [];
		var i, j;
		var pieces = (player === 1) ? getPieces(1) : getPieces(-1);
		for (i = 0; i < pieces.length; i++) {
			dest = getTarget(pieces[i], map);
			for (j = 0; j < dest.length; j++) {
				a.push(new Action(pieces[i], dest[j]));
			};
		};
		return a;
	};

	function movePiece (player, action) {
		var pieces = (map[action.from] === 1) ? getPieces(1) : getPieces(-1);
		pieces[pieces.indexOf(action.from)] = action.to;
	};
	
	function copy (array) {
		var ret = [];
		for (var i = 0; i < array.length; i++) {
			ret[i] = array[i]
		};
		return ret;
	};

	function DFS (player, map, depth) {
		var actions = getActions(player, map);
		if (actions.length === 0) {
			return 0;
		}
		var i, j, ate, tempTarget, temp, e;
		var index = 0;
		var result = -10000, u, ret = [];
		var resultArray = [];
		if (depth === 0) {
			result = 0;
			for (i = 0; i < actions.length; i++) {
				actions[i].utility = getActionUtility(actions[i], map);
				result += actions[i].utility;
			};
		} else {
			for (i = 0; i < actions.length; i++) {
				e = 1;
				stack.push(actions[i].from + " to " + actions[i].to);
				ate = eatTest(actions[i], map);
				move(actions[i], map);
				temp = map[actions[i].to];
				if (ate.length !== 0){
					eat(ate, map);
					e += 10 * ate.length;
				}

				ret.push(DFS(- player, map, depth - 1) * -1 + e);
				if (result < ret[ret.length - 1]) {
					result = ret[ret.length - 1];
					index = i;
				}
				if (ate.length !== 0){
					for (j = 0; j < ate.length; j++) {
						map[ate[j]] = - temp;
						//result += 10 * temp;
					}
				}
				stack.pop();
				move(actions[i].reverse(), map);	
			}
			//console.log("ret", ret, player, actions[ret.indexOf(result)], result, depth);
		}
		nextAction = actions[ret.indexOf(result)];
		return result;
	};

	init();
	return {
		w: function (x, y) {
			return whites;
		},
		b: function (x, y) {
			return blacks;
		},
		/*moveUp: function (x, y) {
			move(x, y, x, y - 1);
		},
		moveDown: function (x, y) {
			return move(x, y, x, y + 1);
		},*/
		getMap: function () {
			return map;
		},
		getWhites: function () {
			return getPieces(1);
		},
		getBlacks: function () {
			return getPieces(-1);
		},
		/*findColor: function (x, y) {
			return findColor(x, y);
		},
		moveByIdx: function (idx1, idx2, map) {
			return moveByIdx(idx1, idx2, map);
		},*/
		getTarget: function (idx, map) {
			return getTarget(idx, map);
		},
		eatTest: function (action, map) {
			var temp = copyMap(map);
			return eatTest(action, temp);
		},
		DFS: function (p, m, d) {
			return DFS(p, m, d);
		},
		stack: function () {
			return stack;
		},
		move: function (a, m) {
			return move(a, m);
		},
		eat: function (array, map) {
			return eat(array, map);
		},
		getNextAction: function (player, map, depth) {
			DFS(player, map, depth);
			return nextAction;
		}
	};
};