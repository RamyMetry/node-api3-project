const express = require('express');
const userdb = require('./userDb');
const postdb = require('../posts/postDb.js');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
	const { name } = req.body;
	userdb
		.insert({ name })
		.then((user) => res.status(201).json(user))
		.catch((err) => res.status(500).json({ error: 'Error inserting user' }));
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
	const { id: user_id } = req.params;
	const { text } = req.body;
	postdb
		.insert({ user_id, text })
		.then((post) => res.status(200).json(post))
		.catch((err) => res.status(500).json({ message: 'error while adding post to the database.' }));
});

router.get('/', (req, res) => {
	userdb.get().then((users) => res.json(users)).catch((err) => res.status(500).json({ message: 'not found' }));
});

router.get('/:id', validateUserId, (req, res) => {
	const { id } = req.params;
	userdb
		.getById(id)
		.then((user) => res.json(user))
		.catch((err) => res.status(500).json({ message: 'Proplem with the server.' }));
});

router.get('/:id/posts', validateUserId, (req, res) => {
	const { id } = req.params;
	userdb
		.getUserPosts(id)
		.then((posts) => res.json(posts))
		.catch((err) => res.status(500).json({ message: 'error with the server' }));
});

router.delete('/:id', validateUserId, (req, res) => {
	const { id } = req.params;
	userdb
		.remove(id)
		.then((removedUser) => res.status(200).end())
		.catch((err) => res.status(500).json({ message: 'There is a proplem deleting the user.' }));
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	userdb
		.update(id, { name })
		.then((updated) => {
			res.status(200).json(updated);
		})
		.catch((err) => res.status(500).json({ error: 'There was a proplem updaing that user.' }));
});

//custom middleware

function validateUserId(req, res, next) {
	const { id } = req.params;
	userdb.getById(id).then((user) => {
		if (!user) {
			res.status(404).json({ message: 'this user with this specific id is not found' });
		} else {
			next();
		}
	});
}

function validateUser(req, res, next) {
	const { name } = req.body;
	if (!name) {
		res.status(400).json({ message: 'A name is required for a new user' });
	} else if (typeof name !== 'string') {
		res.status(400).json({ message: 'Name must be a string' });
	} else {
		next();
	}
}

function validatePost(req, res, next) {
	const { text } = req.body;
	if (!req.body) {
		return res.status(400).json({ error: 'Missing post data' });
	} else if (!text) {
		return res.status(400).json({ error: 'Missing required text field' });
	} else {
		next();
	}
}

module.exports = router;
