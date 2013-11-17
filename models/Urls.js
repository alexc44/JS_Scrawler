var mongoose = require( 'mongoose' )
	, Schema   = mongoose.Schema;

var ScraperSchema = new Schema({
    url    : String,
    scrawled_at : { type : Date, default : Date.now }
});
 
module.exports = mongoose.model('urls', ScraperSchema);