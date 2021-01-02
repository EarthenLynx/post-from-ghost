const router = require('express').Router();
const fetch = require('node-fetch');
const TurndownService = require('turndown');
const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });

router.post('/', async (req, res) => {
	// Define relevant interface config
	const devToEndpoint = 'https://dev.to/api/articles';
	const headers = { 'content-type': 'application/json', 'api-key': process.env.API_KEY };

	// Build up the payload for the api
	const { title, html, feature_image, tags, url } = req.body.post.current;
	const markdown = turndownService.turndown(html);
	const body = JSON.stringify({
		article: {
			title: title,
			body_markdown: markdown,
			published: false,
			main_image: feature_image,
			tags: tags.map(tag => tag.name),
		},
	});

	// Send the payload and create a new article
	const options = { method: 'post', timeout: 1500, headers, body };
	const response = await fetch(devToEndpoint, options);

	// Do error handlung
	if (response.status !== 201) {
    const e = await response.json();
    console.log(`Something went wrong: ${e.error}`)
    // If everything went well, send a confirmation response
	} else {
		const data = await response.json();
		console.log('Post created');
		console.log(data);
	}

	// If everything went well, send a message back to the server
	res.status(200).send('stop');
});

module.exports = router;
