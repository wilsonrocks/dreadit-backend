# James Wilson Northcoders News

This is the backend API for a news website similar to Reddit.
It is a RESTful api which returns users, topics, articles and comments and allows them to be created, updated and deleted.

There is a demo version live at [https://immense-spire-53107.herokuapp.com/](https://immense-spire-53107.herokuapp.com/). All API endpoints start with `/api`.


## Getting Started

### Prerequisites
Dependencies from npm will be installed automatically. A running instance of mongoDB is needed. If you are running the tests or the dev environment make sure you've typed `mongod` beforehand.

The app was developed with nod 9.4.0, mongoDB 3.4.15 and expressJS 4.16.3 but other versions ought to be supported.

### Installation

    git clone https://github.com/wilsonrocks/BE-PT-northcoders-news
    cd BE-PT-northcoders-news
    npm install

You need to have mongoDB running - the easiest way is to type `mongod` in another terminal window.

    npm run seed
    npm start

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


## Running Tests

`npm test` will run an extensive series of tests for the API. The database is reseeded before each test with special test data separate from the `dev` database.

# API reference
Please see `/public/doc.html` or make a GET request to the `/api` endpoint.

## Deployment

If the `MONGODB_URI` environment variable is set, the app will use that. Otherwise, it will use the default dev URL found in `constants.js`.

The `PORT` environment variable will be used, if it exists. 
Otherwise, you can specify a port on the command line `npm start 8000`. If you don't do this, the default port set in `constants.js` will be used.

If you want to seed the deployed version, you will have to run `npm run seed` in the deployment environment.

## Built With

* mongoDB
* mongoose
* expressJS
