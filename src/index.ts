// const axios = require('axios')
// const mongoose = require('mongoose')
import axios from 'axios'
import mongoose from 'mongoose'
import DailyTrend from './models/dailyTrend'
import moment from 'moment'
import connectDB from './db'

type dailyTrend = {
    date: Date;
    trendingSearches: string[];
    geo: string;
}

type DailyTrendResponse = {
    date: string;
    trendingSearches: Array<trendingSearch>;
    geo: string;
    [x: string]: any;
}

type trendingSearch = {
    title: title,
    [x: string]: any;
}

type title = {
    query: string;
    [x: string]: any;
}

const fakeDailyTrend: dailyTrend = {
    date: new Date(Date.now()),
    trendingSearches: ['JamesKu', 'game', 'web dev'],
    geo: 'US',
}


const getTrends = async (geo: string): Promise<Array<dailyTrend>> => {
    try {
        const hl = 'en-US'
        const tz = '240'
        const res = await axios.get(`https://trends.google.com/trends/api/dailytrends?hl=${hl}&tz=${tz}&geo=${geo}&ns=1`)
        // console.log(res.data)
        const startIdx = res.data.indexOf(',')
        // console.log(startIdx)
        // console.log(res.data.substring(startIdx + 1, 100))
        const trendsData = JSON.parse(res.data.substring(startIdx + 1))
        // console.log(trendsData.default)
        const trendingSearchesDays: Array<DailyTrendResponse> = trendsData.default.trendingSearchesDays
        const ret: Array<dailyTrend> = trendingSearchesDays.map(trendingSearchesDay => ({
            date: moment(trendingSearchesDay.date, 'YYYYMMDD').toDate(),
            trendingSearches: trendingSearchesDay.trendingSearches.map(trendingSearch => trendingSearch.title.query),
            geo: geo
        }))

        // console.log(trendingSearchesDays)
        return ret

    } catch (error) {
        console.error(error)
        return []
    }
}

const saveDailyTrends = async (dailyTrends: Array<dailyTrend>) => {
    try {
        for (const dailyTrend of dailyTrends) {

            try {
                const trend = await DailyTrend.findOne({ date: dailyTrend.date, geo: dailyTrend.geo })
                if (trend) {
                    trend.trendingSearches = [...dailyTrend.trendingSearches]
                    trend.updatedAt = new Date(Date.now())
                    await trend.save()
                }
                else {
                    const newTrend = new DailyTrend(dailyTrend)
                    await newTrend.save()
                }

            } catch (error) {
                console.log(error.message)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const main = async () => {
    try {
        const geoCodes = ['AR', 'AU', 'AT', 'BE', 'BR', 'CA', 'CL', 'FI', 'TW', 'US', 'FR', 'HK', 'IN', 'ID', 'GB', 'RU']
        await connectDB()
        for (const geo of geoCodes) {
            const trends = await getTrends(geo)
            await saveDailyTrends(trends)
            console.log(`${geo} done`)
        }

        // console.log(trends)
        // Save to db
        mongoose.disconnect()
        return
    } catch (error) {
        console.log('connection error')
    }
}

main()




// getTrends()