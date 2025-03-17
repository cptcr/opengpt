"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
function chat(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${options.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "sonar",
                    messages: [
                        { role: "system", content: "Be precise and concise." },
                        { role: "user", content: options.prompt }
                    ],
                    max_tokens: 123,
                    temperature: 0.2,
                    top_p: 0.9,
                    search_domain_filter: null,
                    return_images: false,
                    return_related_questions: false,
                    search_recency_filter: null,
                    top_k: 0,
                    stream: false,
                    presence_penalty: 0,
                    frequency_penalty: 1,
                    response_format: null
                })
            });
            return yield response.json();
        }
        catch (error) {
            return error;
        }
    });
}
