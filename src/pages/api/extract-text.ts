import type { NextApiRequest, NextApiResponse } from 'next';
import type { TextFromImageResponse, ErrorResponse } from '../../types/api';

type HandlerResponse = TextFromImageResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<HandlerResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fileId } = req.body;
    if (!fileId) {
        return res.status(400).json({ error: 'Missing fileId' });
    }

    const host = process.env.BACKEND_HOST;
    const user = process.env.AUTH_USER;
    const password = process.env.AUTH_PASSWORD;

    try {
        const backendRes = await fetch(`${host}/api/extract/text-from-image?fileId=${fileId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${user}:${password}`),
            },
        });

        if (!backendRes.ok) {
            return res.status(backendRes.status);
        }

        const data: TextFromImageResponse = await backendRes.json();
        return res.status(200).json(data);
    } catch (error){
        console.error('Error fetching pre-signed URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
