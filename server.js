const express = require('express');
const server = express();
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

server.use(express.json());
server.use('/users', userRouter);
server.use('/posts', postRouter);
server.use(logger);

server.get('/', (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

// custom middleware

function logger(req, res, next) {
	console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('origin')}`);
	next();
}

module.exports = server;
