const fs = require('fs');
const generateTSConfig = (stagedFilenames) => {
  return (type) => {
    const tsconfig = JSON.parse(fs.readFileSync(`tsconfig.json`, 'utf8'));
    tsconfig.include = stagedFilenames;
    console.log(tsconfig);
    fs.writeFileSync(`tsconfig.${type}.lint.json`, JSON.stringify(tsconfig));
    return `${type} --noEmit --project tsconfig.${type}.lint.json --skipLibCheck`;
  };
};

module.exports = {
  '*.{ts,tsx}': ['prettier --write', 'eslint --fix', (fileName) => generateTSConfig(fileName)('tsc')],
  '*.vue': ['prettier --write', 'eslint --fix', (fileName) => generateTSConfig(fileName)('vue-tsc')],
  '*.{json,js,jsx}': ['prettier --write', 'eslint --fix']
};
