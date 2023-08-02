const Express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
const winston = require('winston');
const http = require('http');
const SoundPlayer = require('play-sound');
require('winston-daily-rotate-file');


winston.level = "info";
winston.add(new winston.transports.DailyRotateFile({
	dirname: './logs',
	filename: 'soundboard-%DATE%.log',
	createTree: true,
	localTime: true
}));
winston.remove(winston.transports.Console);

let sounds = [];
let player = SoundPlayer();

function reloadSounds() {

	winston.info("Reading sounds from disk");

	let newSounds = [];

	fs.readdir("./sounds", (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			process.exit(1);
		}

		files.forEach(file => {
			newSounds.push(path.basename(file, '.mp3'));
			winston.info("Pushing meta " + file);
		});
		sounds = newSounds;
	});
}

function playSound(sound) {
	player.play(path.join(__dirname, sound), function (err) {
		if (err) {
			winston.error("Trouble playing file", err);
		}
	});
}


// Define app
let app = Express();
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/covers/:soundName', function (request, response) {
	response.sendFile(path.join(__dirname, 'covers', request.params.soundName + ".png"));
});

app.get('/api/get/sounds', function (request, response) {
	response.json(sounds);
});

app.get('/api/play/sound/:soundName', function (request, response) {
	let soundName = request.params.soundName;
	let sound = sounds.find(sound => sound == soundName);

	if (!sound) {
		winston.info('Meta desync: could not find ' + soundName);
		response.sendStatus(400);
		return;
	}

	playSound('sounds/' + sound + ".mp3");
	response.status(200).end();
});

// Handle errors
app.use(function (error, request, response, next) {
	winston.error('Error in express', error);
	response.status(500).json({ message: error.message });
});

// Start app on port 8765
app.listen(34567, function () {
	reloadSounds();
	winston.info("Listening on 34567");
});