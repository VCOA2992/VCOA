import mongoose from "mongoose";

export default async (collectionName) => {
  const collections = await mongoose.connection.db.listCollections().toArray();

  const collectionExist =
    collections.filter((collection) => {
      return collection.name == collectionName;
    }).length > 0;

  return collectionExist;
};
