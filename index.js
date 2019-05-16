const express = require('express');
var router = express.Router();



//############################################################  simple auth  middleware ############################################################
// const crypto = require('crypto');

// const accessToken = process.env.ACCESSTOKEN || 'something';

// async function validateAuth(suppliedToken) {
//     console.log("validateAuth")
//     //Replay attack hardened auth checker
//     function safeCompare(a, b) {
//         if (a.length === b.length) {
//             if (crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     return new Promise((resolve, reject) => {
//         if (!safeCompare(accessToken, suppliedToken)) {
//             reject(403)
//         } else {
//             resolve('success')
//         }
//     })
// }

// var auth = function(req, res, next) {
//     validateAuth(req.header('x-auth-token') || 'Not Supplied')
//         .then(o=>next())
//         .catch(e=>res.sendStatus(e))
// }

// router.use(auth)
//############################################################  simple auth  middleware ############################################################



//############################################################  async map multiple requests ############################################################
// var Promise = require("bluebird");
// const fetch = require('node-fetch');
// //list of urls
// var list = Array(5).fill('https://httpbin.org/get')
//  Promise.all(Promise.map(list, (item) => {
//         //fun fetch on each
//         return fetch(item)
//             //convert output
//             .then(v => v.json())
//             .catch(e => { return { fetchErr: e, item: item } })
//     }, { concurrency: 5 }))
//     //send output
//     .then((value) => {
//         //do shit
//     })
//     .catch((err) => {
//         //it fucked up
//         console.log(err)
//     })
//############################################################  async map multiple requests ############################################################


router.get('/', (req, res) => {
    res.send(200)
})



exports.template = router