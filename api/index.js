export default async function handler(req, res) {
    // Bật CORS cho phép mọi nguồn gọi đến
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Chuyển tiếp URL sang Google Generative Language API
    const url = new URL(req.url, 'https://generativelanguage.googleapis.com');
    const targetUrl = `https://generativelanguage.googleapis.com${url.pathname}${url.search}`;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': req.headers['content-type'] || 'application/json',
            },
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.text();
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
        return res.status(response.status).send(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}