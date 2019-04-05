const https = require('https');
const querystring = require('querystring');
const config = require('../qatConfig.json');
const users = require('./user2.js');

async function executeRequest(url, options, postData) {
    return await new Promise((resolve, reject) => {
        let httpReq = https.request(url, options, (res) => {
            let data = '';
    
            res.on('data', (chunk) => {
                data += chunk;
            });
    
            res.on('end', () => {
                let apiResponse;
    
                try {
                    apiResponse = JSON.parse(data);
                } catch (error) {
                    return reject({ error: error });
                }
                
                if (!apiResponse.error) {
                    return resolve(apiResponse);
                } else {
                    return reject({ error: apiResponse.error });
                }
            });
        });
    
        httpReq.on('error', function (error) {
            return reject({ error: error });
        });
        
        if (postData) {
            httpReq.write(postData);
        }
    
        httpReq.end();
    });
}

async function getToken(code) {
    const postData = querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.redirect,
        client_id: config.id,
        client_secret: config.secret
    }); 

    const options = { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    try {
        return await executeRequest('https://osu.ppy.sh/oauth/token', options, postData);
    } catch (error) {
        return { error: error };
    }
}

async function refreshToken(refreshToken) {
    const postData = querystring.stringify({
        grant_type: 'refresh_token',
        client_id: config.id,
        client_secret: config.secret,
        refresh_token: refreshToken
    });

    const options = { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    try {
        return await executeRequest('https://osu.ppy.sh/oauth/token', options, postData);
    } catch (error) {
        return { error: error };
    }
}

async function getUserInfo(token) {
    const options = { 
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    try {
        return await executeRequest('https://osu.ppy.sh/api/v2/me', options);
    } catch (error) {
        return { error: error };
    }
}

async function isLoggedIn(req, res, next) {
    if (req.session.mongoId) {
        const u = await users.service.query({ _id: req.session.mongoId }, [{ populate: 'currentParty', display: 'name' }]);
        
        // If hidden, shouldn't be able to do anything
        if (!u || u.group == 'hidden') {
            return res.redirect('/');
        }

        // Refresh if less than 30 sec left
        if (req.session.cookie.maxAge < 30000) {
            const response = await refreshToken();
            req.session.cookie.maxAge = response.expires_in * 1000;
            req.session.accessToken = response.access_token;
            req.session.refreshToken = response.refresh_token;
        }

        res.locals.userRequest = u;
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = { isLoggedIn, getToken, getUserInfo };