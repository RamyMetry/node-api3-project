const express = require('express');
const postdb = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
	postdb.get().then((posts) => res.json(posts)).catch((err) => res.status(500).json({ message: 'server error' }));
});

router.get('/:id', validatePostId, (req, res) => {
	const { id } = req.params;
	postdb
		.getById(id)
		.then((post) => res.json(post))
		.catch((err) => res.status(500).json({ message: 'server error.' }));
});

router.delete('/:id', validatePostId, (req, res) => {
	const { id } = req.params;
	postdb
		.remove(id)
		.then((post) => res.status(200).json({ message: 'successfully deleted.' }))
		.catch((err) => res.status(500).json({ message: 'server error.' }));
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
	const { id } = req.params;
	const { text } = req.body;
	postdb
		.update(id, { text })
		.then((updated) => res.json({ message: 'successfully updated.' }))
		.catch((err) => res.status(500).json({ message: 'server error.' }));
});

// custom middleware

function validatePost(req, res, next) {
	const { text } = req.body;
	if (!text) {
		res.status(400).json({ message: 'please provide the text to add the content.' });
	} else next();
}

function validatePostId(req, res, next) {
	const { id } = req.params;
	postdb.getById(id).then((post) => {
		if (!post) {
			res.status(404).json({ message: 'this post with this specific id is not exist.' });
		} else {
			next();
		}
	});
}

module.exports = router;
