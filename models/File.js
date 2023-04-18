const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
	filename: { type: String, required: true },
	filepath: { type: String, required: true },
	previewImage: String,
	preview3D: String,
	category: String,
	metadata: String,
	uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
