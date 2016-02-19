angular.module("myApp", []).controller("pageController", function ($scope, $http) {
	$scope.buttonStyle="";
	$scope.result = "";
	$scope.inputLabel = "";
	$scope.sample = "";
	$scope.mode = 0;
	//$scope.active = 
	$scope.setModeTrain = function () {
		$scope.tab1 = 2;
	};

	$scope.setModeLearn = function () {
		$scope.tab1 = 1;
	};

	$scope.setModeAuto = function () {
		$scope.tab2 = 2;
	};

	$scope.setModeManual = function () {
		$scope.tab2 = 1;
	};

	$scope.learn = function () {
		trainAll(samples, labels, WEIGHTS);
	};

	$scope.recognize = function () {
		perdict();
		clearContext();
	};

	$scope.add = function () {
		if (label[0].value !== "") {
			var temp = label[0].value;
			imgData = ctx_img.getImageData(0, 0, image.width, image.height);
			//updateImgArray(imgData, imgArray);
			imgLib.push(imgData);
			addSample(samples, createImgArray(imgData), temp);
			//samples.push({data: createImgArray(imgData), label: temp});
			addLabel(temp);
			WEIGHTS.push(createWeight(400));
			sampleLabel.push(temp);
			label[0].value = "";
			ctx_img.clearRect(0, 0, 20, 20);
			ctx.clearRect(0, 0, cvs.width, cvs.height);
		}
	};

	$scope.addOneSample = function () {
		addSample(samples, createImgArray(imgData), $scope.result);
		$scope.mode = 0;
		$scope.learn();
		$scope.sample += $scope.result;
		console.log(samples);
		clearContext();
	};

	$scope.addNewSample = function () {
		if ($scope.inputLabel !== "") {
			addSample(samples, createImgArray(imgData), $scope.inputLabel);
			
			WEIGHTS.push(createWeight(400));
			sampleLabel.push($scope.inputLabel);
			if (labels.indexOf($scope.inputLabel) === -1) {
				addLabel($scope.inputLabel);
				//$http.post('/weight', {label: $scope.inputLabel, weight: WEIGHTS[WEIGHTS.length - 1]});
			}
			$scope.learn();
			$scope.sample += $scope.inputLabel;
			$scope.inputLabel = "";
			$scope.mode = 0;
			console.log(samples);
			clearContext();
		} else{
			console.log("input label is empty");
		}
	};


	$scope.getLabel = function () {
		$scope.mode = 2;
	}


	console.log(screen.width);










	var down = 0;
	var cvs = document.getElementById("input");
	var image = document.getElementById("image");
	//var b1 = document.getElementById("b1");
	//var b2 = document.getElementById("b2");
	//var b3 = document.getElementById("b3");
	//var b4 = document.getElementById("b4");
	var label = document.getElementsByTagName("input");

	
	image.width = 20;
	image.height = 20;
	if (screen.width < 600) {
		cvs.width = screen.width;
		cvs.height = screen.width;
	} else {
		cvs.width = 600;
		cvs.height = 600;
	}
	var ctx = cvs.getContext('2d');
	var ctx_img = image.getContext('2d');
	var offset_l = ctx_img.canvas.offsetLeft;
	var offset_t = ctx_img.canvas.offsetTop;
	var ratio = cvs.width / image.width
	var samples = [];
	var sampleLabel = [];
	var labels = [];
	var WEIGHTS = [];
	var output;
	var imgData;
	var imgLib = [];
	var idleTime;
	//console.log(ctx_img);
	//console.log(offset_l);
	var imgArray = [];
	var sigmoid = function (x) {
		return 1 / (1 + Math.exp(-x));
	}

	var addSample = function (array, sample, label) {
		array.push({data: sample, label:label});
		//$http.post('/sample', {data: sample, label:label});
	};

	var sigmoidGradient = function (a) {
		return a * (1 - a);
	};
	var updateImgArray = function (imgdata, array) {
		var i, j;
		j = 0;
		for (i = 3; i < imgdata.data.length; i += 4) {
			array[j] = imgdata.data[i] / 255 / 400;
			j++;
		};
	};

	var createImgArray = function (imgdata) {
		var array = [];
		var i, j;
		j = 0;
		for (i = 3; i < imgdata.data.length; i += 4) {
			array[j] = imgdata.data[i] / 102000;
			j++;
		};
		return array;
	};

	var restoreImgArray = function (imgArray) {
		var n = imgArray.length * 4;
		var array = [];
		var i, j, k;
		k = 0;
		j = 0;
		for (i = 0; i < n; i++) {
			if (j === 3) {
				array[i] = imgArray[k] * 102000;
				j = 0;
			} else {
				array[i] = 0;
			}
			j++;
			k++;
		}
		return array;
	};

	var createWeight = function (numberWeights) {
		var i;
		var weight = [];
		for (i = 0; i < numberWeights; i++) {
			weight[i] = 0.45 + Math.random() * 0.1;
		};
		return weight;
	}
	
	var feedForward = function (input, numberOutput) {
		var outputActivation = []
		var sum;
		var i, j;
		//console.log(input, WEIGHTS);
		for (i = 0; i < numberOutput; i++){
			sum = 0.0;
			for (j = 0; j < input.length; j++) {
				//console.log(weights[i][j]);
				sum += input[j] * WEIGHTS[i][j];
				//console.log(sum);
			};
			//console.log("sum is " + sum);
			outputActivation[i] = sigmoid(sum);
		}
		return outputActivation;
	}

	var getDelta = function (output, trueLabel, labels) {
		var delta = [];
		for (var i = 0; i < labels.length; i++) {
			if (labels[i] == trueLabel) {
				delta[i] = 1.0 - output[i];
			} else {
				delta[i] = 0.0 - output[i];
			}
		};
		return delta;
	}

	var trainAll = function (inputs, labels) {
		var error1 = 0;
		var error2 = 0;
		var error3 = 0;
		var i, j;
		for (i = 0; i < 2000; i++) {
			for (j = 0; j < inputs.length; j++) {
				train(inputs[j], labels, inputs[j].label);
			};
		}
		error1 = train(inputs[0], labels, inputs[0].label);
		console.log(error1);
		//console.log(WEIGHTS);
	}

	//l: true label
	var train = function (input, labels, l) {
		var output = feedForward(input.data, labels.length);
		var delta = [];
		var i, j;
		//console.log(labels);
		delta = getDelta(output, l, labels);
		for (i = 0; i < labels.length; i++) {
			for (j = 0; j < WEIGHTS[i].length; j++) {
				//console.log(delta[i] , input[j] ,5， sigmoidGradient(output[i]));
				WEIGHTS[i][j] += 100 * delta[i] * input.data[j] * sigmoidGradient(output[i]);
			}
		}
		//console.log(WEIGHTS)
		return delta;
	}
	var getX = function (context, e) {
		return e.pageX - context.canvas.offsetLeft;
	};

	var getY = function (context, e) {
		return e.pageY - context.canvas.offsetTop - window.pageYOffset;
	};
	var beginDraw = function (e, context, ratio) {
		context.beginPath();
		//var x = e.pageX - 
		context.moveTo(getX(context, e) / ratio, getY(context, e) / ratio);
	};

	var endDraw = function (e, context, ratio) {
		context.lineTo(getX(context, e) / ratio, getY(context, e) / ratio);
		context.stroke();
	};

	var createImg = function (imgData, label) {
		var img = [];
		updateImgArray(imgData, img);
		return {
			data:img,
			label:label
		}
	};

	var clearContext = function () {
		ctx_img.clearRect(0, 0, 20, 20);
		ctx.clearRect(0, 0, cvs.width, cvs.height);
	};

	var addLabel = function (l) {
		if (labels.indexOf(l) === -1) {
			labels.push(l);
		}
	};

	var countSecond = function () {
		console.log("good");
	}

	var promptLearn = function () {

	}
	var process = function () {
		var idx = -1;
		imgData = ctx_img.getImageData(0, 0, image.width, image.height);
		updateImgArray(imgData, imgArray);
		var p = feedForward(imgArray, labels.length);
		if (p[0] === undefined) {
			//promptLearn();
			console.log("empty");
			$scope.mode = 2;
		} else {
			$scope.mode = 1;
			idx = maxIndex(p);
			$scope.result = labels[idx];
			console.log($scope.result);
			console.log(labels[idx]);
			console.log(p);
		}
		$scope.$apply();
	}


	var maxIndex = function (array) {
		var idx = -1;
		var max = 0;
		for (var i = 0; i < array.length; i++) {
			if (max < array[i]) {
				max = array[i];
				idx = i;
			}
		};
		return idx;
	}


	//console.log(maxIndex([1,2,3,5,4]));
	
//***************** event listeners **************************
	/*//button:train 
	b1.addEventListener("click", function () {
		trainAll(samples, labels, WEIGHTS);
	});


	//button:add sample 
	b2.addEventListener("click", function () {
		if (label[0].value !== "") {
			var temp = label[0].value;
			imgData = ctx_img.getImageData(0, 0, image.width, image.height);
			//updateImgArray(imgData, imgArray);
			imgLib.push(imgData);
			samples.push(createImgArray(imgData));
			addLabel(temp);
			WEIGHTS.push(createWeight(400));
			sampleLabel.push(temp);
			label[0].value = "";
			ctx_img.clearRect(0, 0, 20, 20);
			ctx.clearRect(0, 0, 600, 600);
		}

		//console.log(samples);
		//console.log(labels);
		//console.log(weights);
	});

	//perdict
	b3.addEventListener("click", function () {
			imgData = ctx_img.getImageData(0, 0, image.width, image.height);
			updateImgArray(imgData, imgArray);
			var p = feedForward(imgArray, labels.length);
			console.log(p);
			ctx_img.clearRect(0, 0, 20, 20);
			ctx.clearRect(0, 0, 600, 600);

		//console.log(samples);
		//console.log(labels);
		//console.log(weights);
	});*/

	cvs.addEventListener('mousedown', function(e){
		down = 1;
		clearTimeout(idleTime);
		beginDraw(e, ctx, 1);
		beginDraw(e, ctx_img, ratio);
	});

	
	cvs.addEventListener('mouseup', function(e){
		down = 0;
		idleTime = setTimeout(process, 1000)
	});

	cvs.addEventListener('mousemove', function(e){
		//console.log(cvs);
		e.preventDefault();
		if (down === 1) {
			endDraw(e, ctx, 1);
			endDraw(e, ctx_img, ratio);
		}
	});

	cvs.addEventListener('touchstart', function(e){
		clearTimeout(idleTime);
		beginDraw(e, ctx, 1);
		beginDraw(e, ctx_img, ratio);
	});

	cvs.addEventListener('touchmove', function(e){
		e.preventDefault();
		endDraw(e, ctx, 1);
		endDraw(e, ctx_img, ratio);
	});
	cvs.addEventListener('touchend', function(e){
		idleTime = setTimeout(process, 1000)
	});
// *************************************************************

	var assert = function (left, right) {
		if (left === right) {
			return true;
		} else {
			return false;
		}
	}

	var a = getDelta([0.5, 0.5], 1, [1, 2]);
	console.log(assert(a[0], 0.5));
	console.log(assert(a[1], -0.5));

	
	var createMatrix = function (m, n, num) {
		var matrix = [];
		var i, j;
		for (i = 0; i < m; i++) {
			matrix[i] = [];
			for (j = 0; j < n; j++) {
				matrix[i][j] = num;
			}
		}
		return matrix;
	};
	
	var multiply = function (A, B) {
		var matrix = createMatrix(A.length, B[0].length, 0);
		var i, j, k;

		if (A[0].length !== B.length) {
			console.log("error: matrix dimensions do not agree");
			return undefined;
		}
		for (i = 0; i < A.length; i++) {
			for (j = 0; j < B[0].length; j++) {
				for (k = 0; k < A[0].length; k++) {
					matrix[i][j] += A[i][k] * B[k][j];
				}
			}
		}
		return matrix;
	};

	var product = function (v, w) {
		if (v.length !== w.length) {
			console.log("error: vector dimensions do not agree");
			return undefined;
		}
		var sum = 0;
		for (var i = 0; i < v.length; i++) {
			sum += v[i] * w[i];
		};
		return sum;
	};

	function equal(A, B) {
		for (var i = 0; i < A.length; i++) {
			for (var j = 0; j < A[i].length; j++) {
				if (A[i][j] !== B[i][j]) {
					return false;
				};
			};
		};
		return true;
	};

});
