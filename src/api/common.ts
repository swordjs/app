/**
 * @name 客户端直传云存储(阿里云)
 * @param params
 * @doc https://uniapp.dcloud.io/uniCloud/storage?id=uploadfile
 */
export function uploadFileToCloudStorage(params: { filePath: string; cloudPath: string }): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { filePath, cloudPath } = params;
    // 获取当前时间戳
    const timestamp: number = new Date().getTime();
    // 获取file的后缀文件类型名
    const typeName = filePath.substr(filePath.lastIndexOf('.'));
    uniCloud
      .uploadFile({
        filePath,
        cloudPath: cloudPath + `.${timestamp}${typeName}`
      })
      .then((res) =>
        resolve({
          success: true,
          data: res
        })
      )
      .catch((err) => {
        resolve({
          success: false,
          data: err
        });
      });
  });
}

/**
 * @name 内容安全函数，调用即可检测内容是否有违规字段
 * @param params
 * @returns
 */
export async function checkContentSecurity(params: { content: string }): Promise<
  ActionResult<{
    errCode: number;
    errMsg: string;
  }>
> {
  let platform = '';
  // #ifdef MP-WEIXIN
  platform = 'mp-weixin';
  // #endif
  // #ifdef MP-QQ
  platform = 'mp-qq';
  // #endif
  const res = await uniCloud.callFunction<{
    errCode: number;
    errMsg: string;
  }>({
    name: 'content-security',
    data: {
      content: params.content,
      platform
    }
  });
  return {
    ...res,
    data: res.result
  };
}
