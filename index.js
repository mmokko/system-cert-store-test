import nodefetch from 'node-fetch';
import https from 'https';

const nativeFetch = async (url) => {
  try {
    const resp = await fetch(url, { method: 'GET' });
    const t = await resp.text();
    console.log(`${resp.statusText} (${resp.status}) ${resp.url} - ${JSON.stringify(resp.headers)} - Content-Len: ${t.length}`);
  } catch (error) {
    console.error(error.message);
  }
}

const nodeFetch = async (url) => {
  try {
    const resp = await nodefetch(url, { method: 'GET' });
    const t = await resp.text();
    console.log(`${resp.statusText} (${resp.status}) - ${resp.headers} - Content-Len: ${t.length}`);
  } catch (error) {
    console.error(error.message);
  }
}

const httpsGet = async (url) => {
  await new Promise((resolve) => {
    let data = '';
    https.get(url, (resp) => {
      resp.on('data', (chuck) => {
        data += chuck;
      });

      resp.on('end', () => {
        console.log(`Successfully fetched ${url} - Content-Len ${data.length}`);
        resolve();
      });
    })
    .on('error', (err) => {
      console.log(`Query failed: ${err.message}`);
      resolve();
    });
  });
}

(async () => {
  console.log(`OPENSSL_CONFIG set to: ${process.env.OPENSSL_CONF}`);

  console.log('\nUsing native fetch');
  await nativeFetch('https://www.google.com');
  await nativeFetch('https://cloud.robocorp.com/');
  await nativeFetch('https://self-signed.badssl.com/');

  console.log('\nUsing node-fetch');
  await nodeFetch('https://www.google.com');
  await nodeFetch('https://cloud.robocorp.com/');
  await nodeFetch('https://self-signed.badssl.com/');

  console.log('\nUsing https.get');
  await httpsGet('https://www.google.com');
  await httpsGet('https://cloud.robocorp.com/');
  await httpsGet('https://self-signed.badssl.com/');
})();
