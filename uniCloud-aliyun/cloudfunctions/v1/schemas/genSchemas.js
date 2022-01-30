const { TSBufferProtoGenerator } = require('tsbuffer-proto-generator');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

async function main() {
  let generator = new TSBufferProtoGenerator({
    baseDir: path.resolve(__dirname, '../typings/proto', 'request')
  });
  let files = glob.sync('**/*.d.ts', {
    cwd: path.resolve(__dirname, '../typings/proto', 'request')
  });

  console.log('Files: ', files);

  let result = await generator.generate(files);

  fs.writeFileSync(path.resolve(__dirname, 'schemas.json'), JSON.stringify(result, null, 2));
}

main();
