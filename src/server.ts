import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connect } from 'mongoose';

import { MONGODB_URI, PORT, SECRET } from './constant/env';
import Song, { ISong } from './lib/db/Song';
import logger from './lib/logger';
const app = express();

app.use((req, res, next) => {
  // Validate secret
  if (req.headers.authorization === SECRET) {
    next();
  } else {
    res.sendStatus(401);
  }
});

app.get('/', (req, res) => {
  res.send('health ok');
});

app.get('/song', async (req, res) => {
  const queryId = req.query.id as string;
  const song = (await Song.findById(queryId)) as ISong;

  if (!song) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.status(200).json(song);
});

app.listen(PORT, async () => {
  logger(`Server started at ${PORT}`);
  logger('Connecting to db...');
  await connect(MONGODB_URI).then((_v) => {
    logger('Connected to db!');
  });
});
