const fs = require('fs');

// place the file here
const file = '../data/annual_report_dec5.json';

fs.readFile(file, 'utf8', (_, data) => {
  const o = JSON.parse(data.replace(/staging\./g, 'www.').replace(/\.dev/g, '.org').replace(/\\r\\n/g, ' '));
  Promise.all(o.posts.map(p => new Promise(resolve => {
    fs.stat('../data/min/' + p.id + '.jpg', e => {
      p.image = e === null;
      resolve();
    });
  }))).then(() => {
    fs.writeFileSync(file, JSON.stringify(o));
  });
});
