import mongoose from "mongoose";
const { Schema } = mongoose;

const trendSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  keywords: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  search_volume: {
    type: Number,
    default: 100,
  },
  page: {
    type: Schema.Types.ObjectId,
    ref: "Page",
  },
});

const Trend = mongoose.model("Trend", trendSchema);

export default Trend;
