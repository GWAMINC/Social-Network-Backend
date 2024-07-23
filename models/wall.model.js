import mongoose from 'mongoose';

const wallSchema = new mongoose.Schema({
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
})

export const Wall = mongoose.model('Wall', wallSchema);
