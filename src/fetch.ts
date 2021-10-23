import fetch from 'node-fetch';

export async function fetchData(
  url: string,
  options: {
    accessToken: string;
    query: string;
  }
) {
  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'GatsbySourceKibela',
    },
    body: JSON.stringify({
      query: options.query,
    }),
  }).then(async res => {
    const headers = res.headers;
    const body = await res.json();
    return {
      body,
      headers,
      status: res.status,
    };
  });
}
