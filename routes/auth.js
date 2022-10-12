const router = require('express').Router()
const fetch = require('node-fetch');
const uuid = require('uuid')
const keys = require('../config/etsy-Keys');
const fs = require('fs');
const fetchCat = require('./endpoints')


router.get('/', (req, res) => {
    let options = {
        hostname: 'https://www.etsy.com',
        pathname: '/oauth/connect',
        method: 'GET',
        query: {
            client_id: keys.KEYSTRING,
            response_type: 'code',
            redirect_uri: 'http://localhost:3003/etsy/callback',
            state: 'superstate'
        },

    }
    res.status(301).redirect(`https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${options.query.redirect_uri}&scope=listings_w%20listings_r&client_id=${options.query.client_id}&state=superstate&code_challenge=DSWlW2Abh-cf8CeLL8-g3hQ2WQyYdKyiu83u_s7nRhI&code_challenge_method=S256`)
});

router.get('/callback', async (req, res) => {
    if(req.query.error){
        return res.status(401).json({
            success: false,
            msg: 'Something went wrong!',
            data: req.query.error
        })
    }


    const response = req.query

    if(req.query.state !== response.state) {
        return res.status(401).json({
            success: false,
            msg: 'State doesn\'t match',
            data: null
        })
    }

    const authCode = req.query.code;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: keys.KEYSTRING,
            redirect_uri: 'http://localhost:3003/etsy/callback',
            code: authCode,
            code_verifier: 'vvkdljkejllufrvbhgeiegrnvufrhvrffnkvcknjvfid'
        }),
        headers: {
            'Content-Type': 'application/json', 
            'scopes': ['listings_w','listings_r']

        }
    };
    

    const responseData = await fetch(tokenUrl, requestOptions);

    if (responseData.ok) {
        const tokenData = await responseData.json();
        res.send(tokenData);
    } else {
        res.send("oops");
    }
});


router.get('/etsy', (req, res) => {
    res.json(fetchCat)
})

module.exports = router;
