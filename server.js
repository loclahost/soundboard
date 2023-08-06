import Express from 'express';
import fs from 'fs-extra';
import  path from 'path';
import SoundPlayer from 'play-sound';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let sounds = [];
let player = SoundPlayer();

function reloadSounds() {

	console.log("Reading sounds from disk");

	let newSounds = [];

	fs.readdir("./sounds", (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			process.exit(1);
		}

		files.forEach(file => {
			newSounds.push(path.basename(file, '.mp3'));
			console.log("Pushing meta " + file);
		});
		sounds = newSounds;
	});
}

function playSound(sound) {
	player.play(path.join(__dirname, sound), function (err) {
		if (err) {
			console.log("Trouble playing file", err);
		}
	});
}


// Define app
let app = Express();
app.disable('x-powered-by');

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/api/get/cover/:soundName', function (request, response) {
	response.sendFile(path.join(__dirname, 'covers', request.params.soundName + ".png"));
});

app.get('/api/get/sounds', function (request, response) {
	response.json(sounds);
});

app.get('/api/play/sound/:soundName', function (request, response) {
	let soundName = request.params.soundName;
	let sound = sounds.find(sound => sound == soundName);

	if (!sound) {
		console.log('Meta desync: could not find ' + soundName);
		response.sendStatus(400);
		return;
	}

	playSound('sounds/' + sound + ".mp3");
	response.status(200).end();
});

app.use('/', Express.static('./dist'));

// Handle errors
app.use(function (error, request, response, next) {
	console.error('Error in express', error);
	response.status(500).json({ message: error.message });
});

// Start app on port 8765
app.listen(34567, function () {
	reloadSounds();
	console.log("Listening on 34567");
});