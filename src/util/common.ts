export const removeHtmlTag = (htmlStr: string) => {
  return htmlStr.replace(/<[^>]+>/gi, "");
};
