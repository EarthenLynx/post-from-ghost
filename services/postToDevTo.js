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
	let markdown = turndownService.turndown(html);
	markdown += `\n> This post was originally published at ${url}`;
	markdown += `\nThank you for reading. If you enjoyed this article, let's stay in touch on Twitter 🐤 [@qbitme](https://twitter.com/qbitme)`;
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
	const options = { method: 'post', timeout: 10000, headers, body };
	const response = await fetch(devToEndpoint, options);

	// Do error handlung
	if (response.status !== 201) {
		const e = await response.json();
		console.log(`Something went wrong: ${e.error}`);
		// If everything went well, send a confirmation response
	} else {
		const data = await response.json();
		console.log(`Post created successfully and available under ${data.url}`);
	}

	// In any way, send a message to the webhook to stop sending
	res.status(200).send('stop');
});

module.exports = router;
