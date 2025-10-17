// 0.12.0及以上版本用法
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { matterMarkdownAdapter } = require("@elog/cli");

/**
 * 自定义文档插件
 * @param {DocDetail} doc doc的类型定义为 DocDetail
 * @param {ImageClient} imageClient 图床下载器，可用于图片上传
 * @return {Promise<DocDetail>} 返回处理后的文档对象
 */
const format = async (doc, imageClient) => {
  const cover = doc.properties.cover;
  if (cover) {
    doc.properties.cover = await imageClient.uploadImageFromUrl(cover, doc);
  }
  doc.body = doc.body.replace(/\n/gi, '\n\n')
  return matterMarkdownAdapter(doc);
};

module.exports = {
  format,
};