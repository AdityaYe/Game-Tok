const mongoose = require('mongoose');


const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    clip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clip',
        required: true
    }
}, {
    timestamps: true
})


const saveModel = mongoose.model('save', saveSchema);

module.exports = saveModel;