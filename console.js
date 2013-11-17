

//get the console.log
oldLogger = console.log;

//override log function
var log = function(){
	var args =Array.prototype.slice.call(arguments);
	args[0] = args[0].white;
	
	//in case args doesn't have link to display
	if (args[1] != undefined) {
		args[1] =	args[1].white;
	}

	var date = new Date();
   	args.unshift(date.toUTCString().white);
   	oldLogger.apply(console, args);
}

//same for error color edit
var error = function(){
	var args = Array.prototype.slice.call(arguments);

	var string = '[ERROR @'+ new Date().toUTCString() + ']';
	args.unshift(string.white);
	oldLogger.apply(console, args);
}

var info = function(){
	var args = Array.prototype.slice.call(arguments);
	args[0] = args[0].white;
	var string = '[INFO]';
	args.unshift(string.white);
	oldLogger.apply(console, args);
}


//export new console function
exports.log = log;
exports.error = error;
exports.info = info;
