export async function chat(options: { token: string; prompt: string }) {
    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
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

        return await response.json();
    } catch (error) {
        return error;
    }
}