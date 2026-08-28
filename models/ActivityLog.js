const mongoose = require('mongoose');

// Records what a user did, so the admin panel can show recent activity.
// `user` is a ref to the User collection, which is what .populate() resolves.
const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
