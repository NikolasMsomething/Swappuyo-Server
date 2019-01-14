# Swappuyo

Swappuyo is a fast and efficient way to trade items on reddit.com.

[Click here to see a live version!](ppuyo-client.herokuapp.com)


![example](https://i.imgur.com/rjJ367C.png)

This backend exposes a RESTful API. 

It supports:

* User registration and authentication

* Fetching a user's next flashcards

* Flashcard statistics tracking

This app is deployed using a CI/CD setup with Travis-CI and Heroku.

## Technologies

This backend is built using JavaScript, Node, and Express.

- [PassportJS](http://www.passportjs.org/) - User authentication

- [MongoDb](https://www.mongodb.com/) - Non-Relational database

- [Mongoose](https://mongoosejs.com/) -
  ORM used to query database
