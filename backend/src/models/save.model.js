const mongoose = require('mongoose');


const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clip',
        required: true
    }
}, {
    timestamps: true
})

saveSchema.index({ user: 1, clip: 1 }, { unique: true });
saveSchema.index({ clip: 1 });

const saveModel = mongoose.model('save', saveSchema);

module.exports = saveModel;
