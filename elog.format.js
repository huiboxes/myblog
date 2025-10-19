// 0.12.0及以上版本用法
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { matterMarkdownAdapter } = require("@elog/cli");
const { generateSummary, generateTags } = require('./src/lib/silicon-flow-client.js');

/**
 * 自定义文档插件
 * @param {DocDetail} doc doc的类型定义为 DocDetail
 * @param {ImageClient} imageClient 图床下载器，可用于图片上传
 * @return {Promise<DocDetail>} 返回处理后的文档对象
 */
const format = async (doc, imageClient) => {
  // 处理封面图片
  const cover = doc.properties.cover;
  if (cover) {
    doc.properties.cover = await imageClient.uploadImageFromUrl(cover, doc);
  }
  
  // 确保日期格式正确
  if (doc.properties.date) {
    doc.properties.publishDate = new Date(doc.properties.date).toISOString();
    delete doc.properties.date; // 删除原始的 date 字段
  } else if (doc.properties.publishDate) {
    doc.properties.publishDate = new Date(doc.properties.publishDate).toISOString();
  } else {
    doc.properties.publishDate = new Date().toISOString();
  }

  if (!!process.env.SILICON_FLOW_API_KEY) {
    try {
      console.log('开始生成博客摘要和标签...')
      doc.properties.description = await generateSummary(process.env.SILICON_FLOW_API_KEY, doc.body);

      doc.properties.tags = await generateTags(process.env.SILICON_FLOW_API_KEY, doc.properties.title, doc.body);
      console.log('生成博客摘要和标签成功')
    } catch (err) {
      console.error('生成博客摘要和标签是出错：', err.message ?? '未知错误');
    }
  }

  if (doc.properties.updated) {
    doc.properties.updatedDate = new Date(doc.properties.updated).toISOString();
    delete doc.properties.updated;
  }
  
  doc.body = doc.body.replace(/\n/gi, '\n\n');
  return matterMarkdownAdapter(doc);
};

module.exports = {
  format,
};