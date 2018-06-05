# James Wilson Northcoders News

## Getting Started

```
git clone https://github.com/wilsonrocks/BE-PT-northcoders-news
cd BE-PT-northcoders-news
npm install
npm run seed dev
npm run dev
```

Will seed the dev database and start the server running.

`curl localhost:3000/api/topics`

should return:

```
{
    "topics":[
        {
            "_id":"5b15447545324b637b2aac99",
            "title":"Coding",
            "slug":"coding",
        },
        {
            "_id":"5b15447545324b637b2aac9a",
            "title":"Football",
            "slug":"football",
        },
        {
            "_id":"5b15447545324b637b2aac9b",
            "title":"Cooking",
            "slug":"cooking",
        }
    ]
}
```

### Prerequisites
Dependencies from npm will be installed automatically. A running instance of mongoDB is needed. If you are running the tests or the dev environment make sure you've typed `mongod` beforehand.

If you're deploying this elsewhere, for example, on heroku, make sure the `MONGODB_URI` environment variable is set appropriately.

## Running Tests

`npm test` will run an extensive series of tests for the API. The database is reseeded before each test with special test data separate from the `dev` database.

## Deployment

To deploy, make sure the server is running in an environment with the `MONGODB_URI` variable set appropriately. If you also set the `PORT` variable, the server will use that, otherwise it will default to 3000.

To deploy on heroku or similar platforms, see their documentation:)

## Built With

* mongoDB
* mongoose
* expressJS
