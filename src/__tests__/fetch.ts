import nock from 'nock';

import { fetchData } from '../fetch';

const accessToken = 'accessToken';
const baseUrl = 'https://example.com';
const query = `query {
  currentUser {
    account
    realName
  }
}`;

const nockBase = nock(baseUrl)
  .matchHeader('Authorization', `Bearer ${accessToken}`)
  .matchHeader('Accept', 'application/json')
  .matchHeader('Content-Type', 'application/json')
  .matchHeader('User-Agent', 'GatsbySourceKibela');

describe('fetch', () => {
  it('default request', async () => {
    nockBase
      .post('/', {
        query,
      })
      .reply(200, { body: {} });
    const res = await fetchData(baseUrl, { accessToken, query });
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.headers).toBeDefined();
  });

  it('invalid access token', async () => {
    nockBase
      .post('/', {
        query,
      })
      .reply(401, {
        errors: [
          {
            message: 'The access token is invalid',
            extensions: {},
          },
        ],
      });
    const res = await fetchData(baseUrl, {
      accessToken,
      query,
    });
    expect(res.status).toBe(401);
    expect(res.body.errors).toBeDefined();
  });

  it('error request', async () => {
    nockBase
      .post('/', {
        query,
      })
      .reply(400);
    await expect(
      fetchData(baseUrl, {
        accessToken,
        query,
      })
    ).rejects.toThrow();
  });
});
