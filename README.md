# Swappuyo

Welcome to Swappuyo!
[Click here to see a live version!](https://swappuyo-client.herokuapp.com/)

> Test Reddit and Test Swappuyo account
> reddit username: swappuyotest
> reddit password: password123
> swappuyo username: swappuyotest
> swappuyo password: password123

The Problem:

> Swappuyo was designed to scratch an itch I've had for a while. As a hobby, I'm keen to trading various items over the internet through a site known as Reddit. Because Reddit is a swapper's effective middleman, the trade process does entail us using it with the lot of its features. The problem with that is the site is a social media platform at its core. Even as great as it is, it wasn't designed for the multiple trading forums it hosts.

The Solution:

> My web app gathers these trade forums and allows users to sift through them without ever having to leave a single page. The trade items contents are and will always be dynamically generated. These are received through subsequent calls to the Official Swappuyo Api which in turn makes calls to the Reddit Api. Users are now well able to save and view trades with ease!

![example](https://i.imgur.com/IRsGVjM.png)

> Client clicks dispatch actions which effectively send the items author, title, and url to our Swappuyo Api! The Swappuyo Api vets them and saves them to Swappuyo's mongo database

![example2](https://i.imgur.com/yYcLco3.png)

> Users can delete items with the simple click of a trashcan!

![example3](https://i.imgur.com/HJvOK5k.png)

> The great thing about Swappuyo is that it's extremely scaleable. As the app matures you're going to see more features added relatively easily(thanks to the architecture). Features include (but are not limited to) user messaging and post comment viewing. Users will eventually also be able to save items they own and search for items they yearn for.

### Tech

Swappuyo uses a number of open source projects to work properly:

- [React](https://reactjs.org/) - HTML enhanced for web apps!
- [Redux](https://redux.js.org/) - Library used for enhanced react state management!
- [Node.js](https://nodejs.org/en/) - Evented I/O for the backend!
- [Express](https://expressjs.com/) - Fast node.js network app framework!
- [Mongodb](https://www.mongodb.com/) - Non-relational server side database!
- [Mongoose](https://mongoosejs.com/) - ORM used to query mongo databases!

### Installation

Swappuyo requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

$ npm install

### Post MVP Stretch Goals

- Messaging - Adds reddit messaging system
- Searching - Adds searchable items
- Personal Item Saving - Adds personable items to save
- Reddit Item Searching - Adds specific searching for items
