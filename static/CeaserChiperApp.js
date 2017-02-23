angular.module("CeaserChiperApp", ["chart.js"])
	.controller("myCtrl", myJsCtrl);

function myJsCtrl($http) {
	var self = this;
	self.warning = "";

	//chart variables, data array for character counts in the input & output strings
	self.labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	self.series = ['Input', 'Output'];
	self.data = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	//set 0 as the min value in the chart
	self.options ={    
		scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]}
	};

	/*function for character counting
	x represents the source of the call, 0: from input text 1:from output
	using this data array and the chart is modified
	*/
	self.charCalculator = function (x) 
	{
		self.warning="";
		if(x==0)//call from input field
			active=self.myInput;
		else//call from output field (unencrypt)
			active=self.myOutput;
		
		//reset data set
		for (i = 0; i < 26; i++)
			self.data[x][i] = 0;
		
		//fill data set with character counts
		for (i = 0; i < active.length; i++) 
		{
			pos=active[i].charCodeAt(0) - 'a'.charCodeAt(0)
			if(pos<0)//check for capital letters
				pos=active[i].charCodeAt(0) - 'A'.charCodeAt(0)
			self.data[x][pos]++;
		}

	}

	//function for encrypting text
	self.encrypt = function () {
		self.warning="";
		console.log("in encrypt")
		//json message is set
		var myMessage = { "message": self.myInput, "rot": self.myRot, "func": "encrypt" };
		
		console.log(myMessage);
		//json message is posted
		return $http.post("/", myMessage)
			.then(function (response) {
				self.myOutput = response.data.str;//json respons contains string
				self.charCalculator(1);//calculate char counts for generated output field
				if(self.myOutput===self.myInput)
				{
					self.warning="WARNING: Not a good ROT choice. Input and the output are same";
				}
			}
		);

	}
	//unencrypt the message in the output field
	self.unencrypt = function () {
		//json is set
		var myMessage = { "message": self.myOutput, "rot": self.myRot, "func": "unencrypt" };
		console.log(myMessage);

		//json is sent
		return $http.post("/", myMessage)
			.then(function (response) {
				self.myInput = response.data.str;//json response contains string
				self.charCalculator(0);//calculate char counts for generated input filed

			});
	}

}