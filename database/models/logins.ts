import { model, Schema } from "mongoose";

const schema = new Schema({
    userId: String,
    tokens: {
        claude: String,
        openai: String,
        perplexity: String,
        deepSeek: String
    }
});
const Model = model("logins_opengpt", schema);
export default Model;