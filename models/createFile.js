import mongoose from "mongoose";

const createFile = (collectionName) => {
  const fileSchema = new mongoose.Schema(
    {
      _id: { type: Number, required: true },
      caption: String,
      fileSize: { type: Number, required: true },
    },
    { autoCreate: false }
  );

  if (mongoose.models[collectionName]) {
    return mongoose.model(collectionName);
  } else {
    return mongoose.model(collectionName, fileSchema, collectionName);
  }
};

export default createFile;
