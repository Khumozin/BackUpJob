const { spawn } = require('child_process');
const path = require('path');
const moment = require('moment');
const cron = require('node-cron');

// RESTORE
// mongorestore --db=TestData --archive=./TestData.gzip --gzip

// BACKUP
// mongodump --db=TestData --archive=./TestData.gzip --gzip

const getDate = () => {
  // YYYY-MM-DD HH:mm:ss
  return moment().format('YYYY-MM-DDTHH-mm-ss');
};

const DB_NAME = `TestData`;
let ARCHIVE_PATH = '';

const backupJob = () => {
  // EVERY MIDNIGHT =>
  const everyFiveSec = '*/5 * * * * *';
  const everyFiveMin = '*/5 * * * *';
  const everyMidNight = '0 0 * * *';
  cron.schedule(everyMidNight, () => backupMongoDB());
};

const backupMongoDB = () => {
  ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}${getDate()}.gzip`);

  const child = spawn('mongodump', [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    `--gzip`,
  ]);

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });

  child.stderr.on('data', (data) => {
    console.log('stderr:\n', Buffer.from(data).toString());
  });

  child.on('error', (error) => {
    console.log('error:\n', error);
  });

  child.on('exit', (code, signal) => {
    code
      ? console.log(`Process exited with code: ${code}`)
      : signal
      ? console.log(`Process killed with signal: ${signal}`)
      : console.log(`Backup was successful! ✅`);
  });
};

const restoreMongoDB = () => {
  const child = spawn('mongorestore', [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    `--gzip`,
  ]);

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });

  child.stderr.on('data', (data) => {
    console.log('stderr:\n', data);
  });

  child.on('error', (error) => {
    console.log('error:\n', error);
  });

  child.on('exit', (code, signal) => {
    code
      ? console.log(`Process exited with code: ${code}`)
      : signal
      ? console.log(`Process killed with signal: ${signal}`)
      : console.log(`Restore was successful! ✅`);
  });
};

backupJob();
// getDate();
