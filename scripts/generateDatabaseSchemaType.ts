import { resolve } from 'path';
import { readdirSync, writeFileSync, readFileSync } from 'fs';

const dir = resolve(__dirname, '../uniCloud-aliyun/database');
const fileList = readdirSync(dir).filter((f) => f.includes('sword'));

const camelCase = (name: string) => {
  const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  const MOZ_HACK_REGEXP = /^moz([A-Z])/;
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/**
 * @name 编译文件返回处理后的类型声明内容
 * @param {*} filePath
 */
const complie = (filePath: string) => {
  // 读取文件
  const { properties } = JSON.parse(readFileSync(filePath).toString());
  let _value = ``;
  for (const key in properties) {
    // 判断key是否有.，如果存在.说明是在定义外键（unicloud）
    if (key.includes('.')) {
      continue;
    }
    // 解构类型和介绍
    const { bsonType = 'string', description = '' } = properties[key];
    // 定义一些类型，在ts中表达会默认为string
    const defaultKeys = ['timestamp', 'string'];
    const objectKeys = ['object'];
    const numberKeys = ['number', 'int', 'double'];
    const booleanKeys = ['bool'];
    _value += `/* ${description} */
  ${key}: ${
      defaultKeys.includes(bsonType)
        ? 'string'
        : objectKeys.includes(bsonType)
        ? 'Record<string, unknown>'
        : numberKeys.includes(bsonType)
        ? 'number'
        : booleanKeys.includes(bsonType)
        ? 'boolean'
        : 'unknown'
    }${bsonType === 'array' ? '[]' : ''};
    `;
  }
  // 获取文件名
  const lastIndex = filePath.lastIndexOf('/') + 1;
  // 去掉sword，.schema.json等前缀并且对字符串进行格式化
  const fileName = camelCase(filePath.substring(lastIndex).replace(/sword-|.schema.json/g, ''));
  return `/* tslint:disable */
export interface ${fileName[0].toUpperCase() + fileName.substring(1)} {
${_value}
}
  `;
};

fileList.map((f) => {
  const complieResult = complie(`${dir}/${f}`);
  writeFileSync(`${resolve(__dirname, '../typings/database/')}/${f.replace('schema.json', '')}d.ts`, complieResult);
});

writeFileSync(
  `${resolve(__dirname, '../typings/database/')}/index.d.ts`,
  `${fileList.map((f) => `import './${f.replace('schema.json', '')}d.ts';`).join('\n')}
`
);
