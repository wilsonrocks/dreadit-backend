const PORT = process.env.PORT || 3000;

let MONGO_URL;
if (process.env.MONGODB_URI) {
    MONGO_URL = process.env.MONGODB_URI;
}
else if (process.env.NODE_ENV === 'test') {
    MONGO_URL = 'mongodb://localhost/northcoders_news_test';
}
else {
    process.env.NODE_ENV = 'dev';
    MONGO_URL = 'mongodb://localhost/northcoders_news_dev';
}

module.exports = {MONGO_URL, PORT};