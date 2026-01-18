// Subscriber Model - Newsletter & Waitlist
const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    name: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['newsletter', 'waitlist'],
        default: 'newsletter'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
