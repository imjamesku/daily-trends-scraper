"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dailyTrendSchema = new Schema({
    date: Date,
    trendingSearches: [String],
    geo: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: Date
});
var DailyTrend = mongoose.model('DailyTrend', dailyTrendSchema);
exports.default = DailyTrend;
//# sourceMappingURL=dailyTrend.js.map