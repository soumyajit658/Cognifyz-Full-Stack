const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 60
});

function cacheMiddleware(req, res, next) {
    const key = req.originalUrl;
    const cachedData = cache.get(key);

    if (cachedData) {
        console.log("Cache hit:", key);
        return res.json(cachedData);
    }

    console.log("Cache miss:", key);

    res.sendResponse = res.json;

    res.json = (body) => {
        cache.set(key, body);
        res.sendResponse(body);
    };

    next();
}

module.exports = cacheMiddleware;