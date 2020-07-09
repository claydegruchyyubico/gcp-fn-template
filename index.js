const express = require('express');
const Promise = require('bluebird');
const fetch = require('node-fetch')
const crypto = require('crypto');


//#### VARIOUS PREFLIGHT VARIBLES ####

const YOUR_ZENDESK_URL = process.env.YOUR_ZENDESK_URL
const YOUR_ZENDESK_EMAIL = process.env.YOUR_ZENDESK_EMAIL
const YOUR_ZENDESK_API_TOKEN = process.env.YOUR_ZENDESK_API_TOKEN
const sumoEndPoint = process.env.sumoEndPoint
const accessToken = process.env.ACCESSTOKEN || 'something';

const toolName = 'ss/gcp-fn-template';

var app = express()



//#### AUTH ####
async function validateAuth(suppliedToken) {
    console.log("validateAuth")
    //Replay attack hardened auth checker
    function safeCompare(a, b) {
        if (a.length === b.length) {
            if (crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))) {
                return true;
            }
        }
        return false;
    }

    return new Promise((resolve, reject) => {
        if (!safeCompare(accessToken, suppliedToken)) {
            reject(403)
        } else {
            resolve('success')
        }
    })
}

var auth = function(req, res, next) {
    validateAuth(req.header('x-auth-token') || 'Not Supplied')
        .then(o => next())
        .catch(e => res.sendStatus(e))
}

// usage
/*
generically on all requests
    app.use(auth)

use on a particualr endppoint
    validateAuth(req.header('x-auth-token') || 'Not Supplied')
    .then(o=>DO STUFF)

*/




//#### LOGGING ####

async function logSumo(category, text) {
    console.log("logSumo", category, text)
    if (!sumoEndPoint || !toolName) {
        console.log("aborting logSumo due to config error")
        return
    }
    var log = {
        "appName": toolName,
        "category": category,
        "message": text,
        "filename": __filename,
        "timestamp": new Date().toISOString()
    };
    return fetch(sumoEndPoint, { method: 'POST', body: JSON.stringify(log) })
        .catch(e => {
            console.error("logginng error", text, JSON.stringify(log), e)
            process.stdout.write('Error logging to SUMO', e)
        });
}



//#### ZENDESK STUFF ####

function ZDFetch(url, options = { method: 'get' }) {
    console.log(options.method, YOUR_ZENDESK_URL + url, options)

    if (!options.headers) options.headers = {}
    options.headers["Authorization"] = 'Basic ' + Buffer.from(YOUR_ZENDESK_EMAIL + "/token:" + YOUR_ZENDESK_API_TOKEN).toString('base64')

    return fetch(YOUR_ZENDESK_URL + url, options)
        .then(r => {
            if (!r.ok) throw r
            return r.json()
        })
}


//#### GENERIC USEFUL STUFF ####

function objectPromise(object) {
    if (!object) return false
    return Promise.all(Object.values(object))
        .then(data => {
            return Object.keys(object).map(function(v, i) {
                return [v, data[i]];
            });
        })
        .then(data => Object.assign(...data.map(([key, val]) => ({
            [key]: val
        }))))

}

// #### ROUTING ####
//logging middleware
app.use((req, res, next) => {
    logSumo('info', `[${req.method}] - ` + req.protocol + '://' + req.get('host') + req.originalUrl)
    next()
})


app.post('/', (req, res, next) => {
    res.send("ok")
})



app.use((err, req, res, next) => {
    var unqiueErrorCode = Math.random().toString(36).substring(7)
    logSumo('error', { context: "generic error", input: req.code, error: err, code: unqiueErrorCode })
    return res.status(500).json({ error: "Something failed! We're working to fix this.", code: unqiueErrorCode + "-" + "G" })
})

exports.template = app