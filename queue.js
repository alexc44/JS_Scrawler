
function Queue() {
  this.items = []; 
  this.length = 0;
};

Queue.prototype = {

	/**
	 * push element into queue
	 */
	push: function(item) {
	  this.items.push(item);
	  this.length++;
	},

	/**
	 * remove the first item 
	 */
	shift: function() {
	  if (this.items.length == 0) {
	  	return undefined;
	  }
	  this.length--;
	  return this.items.shift();
	},

	/**
	 * remove each items.
	 */
	clear: function() {
	  this.items.length = 0;
	},

	indexOf: function(val){
		return this.items.indexOf(val);
	},

	isEmpty: function() {
		return this.items.length == 0;
	},

	remove: function(val) {
		this.items.forEach(function(element, index, array){
    		if (element == val) {
    			console.log("ok");
        		array.splice(index, 1);
        		return true;
    		}
		});
	}
};

//export Queue object
module.exports = Queue;
