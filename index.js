import fetch from 'node-fetch';

(async () => {
  try {
    const resp = await fetch('https://self-signed.badssl.com/', { method: 'GET' });
    console.log(resp.status);
  } catch (error) {
    console.error(error.message);
  }
})();