import mongoose from "mongoose";
const { Schema } = mongoose;

const regionSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Region = mongoose.model("Region", regionSchema);

export default Region;
