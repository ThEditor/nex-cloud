import { model, models, ObjectId, Schema } from 'mongoose';

export interface ISong {
  _id: ObjectId;
  name: string;
  artistId: string;
  streamUrl: string;
  imgUrl: string;
  duration: number;
  releaseTimestamp: number;
  addTimestamp: number;
}

export const songSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  artistId: {
    type: String,
    required: true,
  },
  streamUrl: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  releaseTimestamp: {
    type: Number,
    required: true,
  },
  addTimestamp: {
    type: Number,
    required: true,
  },
});

export default models.Song || model('song', songSchema);
