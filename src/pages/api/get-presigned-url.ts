import type { NextApiRequest, NextApiResponse } from 'next';
import type { PreSignedUrlResponse, ErrorResponse } from '../../types/api';

type HandlerResponse = PreSignedUrlResponse | ErrorResponse;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HandlerResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fileName } = req.body;
    if (!fileName) {
        return res.status(400).json({ error: 'Missing fileName' });
    }

    const host = process.env.BACKEND_HOST;
    const user = process.env.AUTH_USER;
    const password = process.env.AUTH_PASSWORD;

    try {
        const backendRes = await fetch(`${host}/s3/pre-signed-url?filename=${encodeURIComponent(fileName)}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64'),
            },
        });

        if (!backendRes.ok) {
            return res.status(backendRes.status);
        }

        const data: PreSignedUrlResponse = await backendRes.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching pre-signed URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
