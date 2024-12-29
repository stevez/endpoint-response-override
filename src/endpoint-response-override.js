const express = require('express');

const overrideRouter = express.Router();

const endpointsOverride = [];

const responseOverrideMiddleware = (req, res, next) => {
    const found = endpointsOverride.find(({url:overrideUrl, method:overrideMethod}) => req.url.match(overrideUrl) && req.method === overrideMethod);
    if (found) {
        const { response } = found;
        return res.status(response.status).jsonp(response.body);
    }
    else {
       next();
    }
};

overrideRouter.post('/register', (req, res, next) => {
    const { body } = req;
    const { url, method, response } = body;
    endpointsOverride.push({url, method: method.toUpperCase(), response});
    res.status(200).jsonp({message: 'Override endpoint Success'});
});

overrideRouter.post('/reset', (req, res, next) => {
  endpointsOverride.length = 0;
  res.status(200).jsonp({message: 'Reset Endpoints Success'});
});

module.exports = {
    overrideRouter,
    responseOverrideMiddleware
}

