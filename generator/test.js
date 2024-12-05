import { config } from "dotenv";
config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import lookup from "country-code-lookup";
console.log(lookup.byCountry("India"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const test = async () => {
  const prompt = `write an article on "rajputana biodiesel ipo allotment status" which is current happening in India`;
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
};
//test();
