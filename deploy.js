const ghPages = require('gh-pages');

const printError = message => console.log('\x1b[31m%s\x1b[0m', message);
const printSuccess = message => console.log('\x1b[32m%s\x1b[0m', message);
console.log();

process.on('exit', code => {
  if (code === 0) {
    printSuccess('Deployment successful!');
  } else if (code === 1) {
    printError('Please provide a commit message');
  }
});

const messageFlagIndex = process.argv.indexOf('-m', 2) || process.argv.indexOf('--message', 2);
if (messageFlagIndex !== -1) {
  const message = process.argv[messageFlagIndex + 1];
  if (message !== undefined) {
    ghPages.publish('./_site', { message });
  } else {
    process.exit(1);
  }
} else {
  process.exit(1);
}
