const fs = require('fs');
const path = require('path');

const loadFileBufferFromPath = async ({ dir, subdir, encoding = 'utf8' }) => {
  const location = path.join(dir, subdir);
  const file = await fs.readFileSync(location);
  return Buffer.from(file, encoding);
};

module.exports = { loadFileBufferFromPath };
