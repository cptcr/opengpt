"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: String,
    tokens: {
        claude: String,
        openai: String,
        perplexity: String,
        deepSeek: String
    }
});
const Model = (0, mongoose_1.model)("logins_opengpt", schema);
exports.default = Model;
