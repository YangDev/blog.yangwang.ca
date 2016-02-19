/**
 * Neural Networks module for AngularJS
 * @author Yang Wang
 * @version v0.0.1
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function(window, angular, undefined){
    'use strict';
    
    angular.module('neural.networks.util', []);
    angular.module('neural.networks', ['neural.networks.util']);
    
    /**
     * Calculates output activation
     * 
     * @param Array input 
     * @param Number numberOutput
     * @return Number 
     */
    function feedForward(input, numberOutput) {
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
    
    angular.module('neural.networks.util').factory('$feed', function(){
        return {
            a: 1
        }
    });
    
})(window, window.angular);