"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const axios = require('axios')
// const mongoose = require('mongoose')
var axios_1 = __importDefault(require("axios"));
var mongoose_1 = __importDefault(require("mongoose"));
var dailyTrend_1 = __importDefault(require("./models/dailyTrend"));
var moment_1 = __importDefault(require("moment"));
var db_1 = __importDefault(require("./db"));
var node_cron_1 = __importDefault(require("node-cron"));
var fakeDailyTrend = {
    date: new Date(Date.now()),
    trendingSearches: ['JamesKu', 'game', 'web dev'],
    geo: 'US',
};
var getTrends = function (geo) { return __awaiter(void 0, void 0, void 0, function () {
    var hl, tz, res, startIdx, trendsData, trendingSearchesDays, ret, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                hl = 'en-US';
                tz = '240';
                return [4 /*yield*/, axios_1.default.get("https://trends.google.com/trends/api/dailytrends?hl=" + hl + "&tz=" + tz + "&geo=" + geo + "&ns=1")
                    // console.log(res.data)
                ];
            case 1:
                res = _a.sent();
                startIdx = res.data.indexOf(',');
                trendsData = JSON.parse(res.data.substring(startIdx + 1));
                trendingSearchesDays = trendsData.default.trendingSearchesDays;
                ret = trendingSearchesDays.map(function (trendingSearchesDay) { return ({
                    date: moment_1.default(trendingSearchesDay.date, 'YYYYMMDD').toDate(),
                    trendingSearches: trendingSearchesDay.trendingSearches.map(function (trendingSearch) { return trendingSearch.title.query; }),
                    geo: geo
                }); });
                // console.log(trendingSearchesDays)
                return [2 /*return*/, ret];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var saveDailyTrends = function (dailyTrends) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, dailyTrends_1, dailyTrend, trend, newTrend, error_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                _i = 0, dailyTrends_1 = dailyTrends;
                _a.label = 1;
            case 1:
                if (!(_i < dailyTrends_1.length)) return [3 /*break*/, 10];
                dailyTrend = dailyTrends_1[_i];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 8, , 9]);
                return [4 /*yield*/, dailyTrend_1.default.findOne({ date: dailyTrend.date, geo: dailyTrend.geo })];
            case 3:
                trend = _a.sent();
                if (!trend) return [3 /*break*/, 5];
                trend.trendingSearches = __spreadArrays(dailyTrend.trendingSearches);
                trend.updatedAt = new Date(Date.now());
                return [4 /*yield*/, trend.save()];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                newTrend = new dailyTrend_1.default(dailyTrend);
                return [4 /*yield*/, newTrend.save()];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                console.log(error_2.message);
                return [3 /*break*/, 9];
            case 9:
                _i++;
                return [3 /*break*/, 1];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var geoCodes, _i, geoCodes_1, geo, trends, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                console.log('Updating DB');
                geoCodes = ['AR', 'AU', 'AT', 'BE', 'BR', 'CA', 'CL', 'FI', 'TW', 'US', 'FR', 'HK', 'IN', 'ID', 'GB', 'RU'];
                return [4 /*yield*/, db_1.default()];
            case 1:
                _a.sent();
                _i = 0, geoCodes_1 = geoCodes;
                _a.label = 2;
            case 2:
                if (!(_i < geoCodes_1.length)) return [3 /*break*/, 6];
                geo = geoCodes_1[_i];
                return [4 /*yield*/, getTrends(geo)];
            case 3:
                trends = _a.sent();
                return [4 /*yield*/, saveDailyTrends(trends)];
            case 4:
                _a.sent();
                console.log(geo + " done");
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6:
                // console.log(trends)
                // Save to db
                mongoose_1.default.disconnect();
                return [2 /*return*/];
            case 7:
                error_4 = _a.sent();
                console.log('connection error');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
node_cron_1.default.schedule("0 * * * *", main);
// main()
// getTrends()
//# sourceMappingURL=index.js.map