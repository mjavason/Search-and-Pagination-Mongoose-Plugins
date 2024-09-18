import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import { paginatePlugin, searchPlugin } from './db-plugins';

dotenv.config();

const DB_NAME = process.env.MONGO_DB_NAME || 'mongodb-transactions-demo';
const DB_CONNECTION_STRING =
  process.env.MONGO_DB_URL + DB_NAME || 'mongodb://localhost:27017/' + DB_NAME;

// Connect to MongoDB
export async function connectToDatabase(
  connectionString = DB_CONNECTION_STRING
) {
  try {
    // mongoose
    // .plugin(mongooseAutoPopulate)
    // .plugin(paginatePlugin)
    // .plugin(searchPlugin);

    await mongoose.connect(connectionString, {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 50000,
      family: 4,
    });

    console.log('Connected to database');
    return true;
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from database');
    return true;
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
}

// Profile schema
export const ProfileModel = mongoose.model(
  'Profile',
  new mongoose.Schema(
    {
      bio: String,
    },
    {
      timestamps: true,
      toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
          return ret;
        },
      },
    }
  )
);

// User schema with reference to Profile
export const UserModel:any = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      name: String,
      email: { type: String, required: true, unique: true },
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        autopopulate: true,
      },
    },
    {
      timestamps: true,
      toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
          delete ret._id;
          delete ret.__v;
          return ret;
        },
      },
    }
  )
    .plugin(mongooseAutoPopulate)
    .plugin(paginatePlugin)
    .plugin(searchPlugin)
);
