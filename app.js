const Promise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const cmd = Promise.promisifyAll(require('node-cmd'));
const rimraf = Promise.promisify(require('rimraf'));
const fs = Promise.promisifyAll(require('fs'));
const path = require("path");
//const { ESPLoader } = require("esptool-js");

const app = express();
app.use(bodyParser.text());

const arduinoMakeFolder = path.join(__dirname, "sketches");

/**
 * Writes the arduino code
 */
const writeArduinoCodeFileAndMakeFile = async (code, board) => {
  const fileAndFolderName =
    Date.now() + "_" + Math.floor(Math.random() * 400000);

  const filePath = path.join(arduinoMakeFolder, fileAndFolderName);

  await fs.mkdirAsync(filePath);

  await fs.chmodAsync(filePath, "777");

  await fs.writeFileAsync(
    path.join(filePath, `${fileAndFolderName}.ino`),
    code
  );

  return fileAndFolderName;
};

const getBoard = (board) => {
  if (board === "uno") {
    return "arduino:avr:uno";
  }
  if (board === "mega") {
    return "arduino:avr:mega";
  }

  if (board === "flora") {
    return "adafruit:avr:flora8";
  }
  if (board === "nodewifi") {
    return "esp32:esp32:BharatPi-Node-Wifi";
  }

  return null;
};

app.use(cors());

app.post('/upload-code/:board', async (req, res) => {
  try {
    let board = req.params["board"];

    const boardName = getBoard(board);

    if (!boardName) {
      res.status(400);
      res.json({ error: "invalid board name" });
      return;
    }

    console.time("writingfile");
    const fileAndFolderName = await writeArduinoCodeFileAndMakeFile(
      req.body,
      board
    );
    console.timeEnd("writingfile");

    console.time("compiling");

    await cmd.getAsync(
      `${path.join(
        __dirname,
        "bin",
        "arduino-cli"
      )} compile --fqbn ${boardName} --output-dir ${path.join(
        arduinoMakeFolder,
        fileAndFolderName
    
      )} ${path.join(arduinoMakeFolder, fileAndFolderName)}`
    );
    console.log('Arduino folder path: ' + arduinoMakeFolder)
    console.log('File folder path: ' + fileAndFolderName)
    console.log("path:" + path)
    //console.log(boardName.replace(':', '.'))
    console.timeEnd("compiling");

    if (board === "nodewifi") {
      res.sendFile(
        path.join(
          arduinoMakeFolder,
          fileAndFolderName,
          `${fileAndFolderName}.ino.bin`
        )
      );
    } else {
    res.sendFile(
      path.join(
        arduinoMakeFolder,
        fileAndFolderName,
        // "build",
        // boardName.replace(':', '.').replace(':', '.'),
        // `${fileAndFolderName}.ino.with_bootloader.hex`
        `${fileAndFolderName}.ino.hex`
      )
    );
  }

    // await rimraf(path.join(
    //     arduinoMakeFolder,
    //     fileAndFolderName));
  } catch (err) {
    res.send(JSON.stringify({ error: err }));
    console.error('ERROR COMPILING: ' + err);
  }
});

app.get('/', (req, res) => {
  res.send('NoDe cOmpILes aRduiNo seRveR working');
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
