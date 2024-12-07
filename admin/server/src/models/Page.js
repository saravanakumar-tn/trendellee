import mongoose from "mongoose";
const { Schema } = mongoose;

const pageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  reading_time: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  html: {
    type: String,
    required: true,
  },
  trend: {
    type: Schema.Types.ObjectId,
    ref: "Trend",
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  is_image: {
    type: Boolean,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "raised",
    emum: ["raised", "under-review", "published"],
  },
});

const Page = mongoose.model("Page", pageSchema);

export default Page;
