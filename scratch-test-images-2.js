const ids = [
  "1582268611958-ebfd161ef9cf", "1600585152915-d208bec867a1", "1512915922686-50c12e8dc776",
  "1513584684374-8bab11786282", "1502005097973-6a708b74871e", "1598228723658-493f446e04f4",
  "1584622650111-993a426fbf0a", "1583847268964-b28ce7f7fd8d", "1560518883-ce09059eeffa",
  "1564501049412-61c2a3083791", "1558036117-15d82a90b9b1", "1560448204-e02f11c3d0e2",
  "1599809275671-5097b10fa787"
];

const https = require('https');

async function testUrl(id) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
    https.request(url, { method: 'HEAD' }, (res) => {
      if (res.statusCode === 200) {
        resolve(url);
      } else {
        resolve(null);
      }
    }).on('error', () => resolve(null)).end();
  });
}

async function run() {
  const results = await Promise.all(ids.map(testUrl));
  const valid = results.filter(u => u !== null);
  console.log(JSON.stringify(valid, null, 2));
}

run();
