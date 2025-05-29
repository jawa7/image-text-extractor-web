import { createMocks } from 'node-mocks-http';
import handlerGetPresignedUrl from '../get-presigned-url';
import handlerExtractText from '../extract-text';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('API: get-presigned-url', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handlerGetPresignedUrl(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toContain('Method not allowed');
  });

  it('returns 400 if fileName is missing', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handlerGetPresignedUrl(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('Missing fileName');
  });

  it('returns 200 and data for valid request', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ fileId: 'abc', url: 'http://s3-url' }),
    });
    const { req, res } = createMocks({ method: 'POST', body: { fileName: 'test.png' } });
    await handlerGetPresignedUrl(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toContain('fileId');
    expect(res._getData()).toContain('url');
  });

  it('checks status code if fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });
    const { req, res } = createMocks({ method: 'POST', body: { fileName: 'test.png' } });
    await handlerGetPresignedUrl(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(401);
  });
});

describe('API: extract-text', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handlerExtractText(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toContain('Method not allowed');
  });

  it('returns 400 if fileId is missing', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handlerExtractText(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain('Missing fileId');
  });

  it('returns 200 and text for valid request', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Extracted text' }),
    });
    const { req, res } = createMocks({ method: 'POST', body: { fileId: 'abc' } });
    await handlerExtractText(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toContain('Extracted text');
  });

  it('returns backend error if fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401});
    const { req, res } = createMocks({ method: 'POST', body: { fileId: 'abc' } });
    await handlerExtractText(req as NextApiRequest, res as NextApiResponse);
    expect(res._getStatusCode()).toBe(401);
  });
});
