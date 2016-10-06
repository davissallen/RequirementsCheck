// module dependencies
var mongoose = require('mongoose');

function emailForm(v) {
	var split = v.split('@');
	return split[0] + '@' + split[1].toLowerCase();
}

// Users need unique emails, and the password is required
var UserSchema = new mongoose.Schema({
	email: { type: String, set: emailForm, unique: true },
	password: { type: String, required: true },
	plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }
});

mongoose.model('User', UserSchema);