# NCN backend checklist
- [X] README clear and instructions accurate
- [X] Needs instructions to seed database
- [X] Package.json includes dependencies (mocha in particular) organised into dev and not dev
- [X] Node modules ignored
- [X] Seed function relies on data and DBURL passed to it not global variables
- [X] Routes broken down with `Router.route`
- [X] Uses config file and process.env
- [X] No errors in the console
- [X] Deployed on heroku and Mlab

## implements all endpoints
- [X] `GET /api/topics`
- [X] `GET /api/topics/:topic_id/articles` (should calculate comment count in controller)
- [X] `GET /api/articles`  (should calculate comment count in controller)
- [X] `GET /api/articles/:article_id`
- [X] `GET /api/articles/:article_id/comments`
- [X] `POST /api/articles/:article_id/comments`
- [X] `PUT /api/articles/:article_id`
- [X] `PUT /api/comments/:comment_id`
- [X] `DELETE /api/comments/:comment_id`
- [X]  `GET /api/users/:username`
- [X] Error handling on server (cast error, 400 and 500)
- [X] Error handling on controllers
- [X] 404 on invalid routes.

## Testing 
- [X] Tests use test environment and DB
- [X] Tests run successfully and are explicit: no just testing the length of things
- [X] Tests are promisified and describe_it blocks organised_logically
- [X] Tests all endpoints
- [X] Tests against `usefulData`
- [X] Tests 400 and 404 errors