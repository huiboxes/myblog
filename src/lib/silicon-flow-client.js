/**
 * 硅基流动(Silicon Flow) API客户端（简化版）
 * 用于在JavaScript环境中调用硅基流动API
 */

// 硅基流动API基础URL
const SILICON_FLOW_API_BASE = 'https://api.siliconflow.cn/v1'

/**
 * 调用硅基流动聊天完成API
 * @param {string} apiKey - API密钥
 * @param {Object} request - 请求参数
 * @returns {Promise<Object>} 响应数据
 */
async function chatCompletion(apiKey, request) {
  if (!apiKey) {
    throw new Error('SILICON_FLOW_API_KEY 未配置')
  }

  const response = await fetch(`${SILICON_FLOW_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error(`硅基流动API请求失败: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * 生成文章摘要
 * @param {string} apiKey - API密钥
 * @param {string} content - 文章内容
 * @param {string} model - 使用的模型
 * @returns {Promise<string>} 生成的摘要
 */
async function generateSummary(apiKey, content, model = 'Qwen/Qwen3-8B') {
  try {
    const response = await chatCompletion(apiKey, {
      model: model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的编辑，能够为文章生成简洁准确的摘要。摘要应该在100字以内，突出文章的核心观点。'
        },
        {
          role: 'user',
          content: `请为以下文章生成摘要：\n\n${content.substring(0, 20000)}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content?.trim() || '无法生成摘要'
  } catch (error) {
    console.error('生成摘要失败:', error)
    return '摘要生成失败'
  }
}

/**
 * 为文章生成标签
 * @param {string} apiKey - API密钥
 * @param {string} title - 文章标题
 * @param {string} content - 文章内容
 * @param {string} model - 使用的模型
 * @returns {Promise<string[]>} 生成的标签列表
 */
async function generateTags(apiKey, title, content, model = 'Qwen/Qwen3-8B') {
  try {
    const response = await chatCompletion(apiKey, {
      model: model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的编辑，能够根据文章标题和内容生成相关的标签。请提供3-5个最相关的标签，用英文逗号分隔。标签应该简洁明了，用中文表达。'
        },
        {
          role: 'user',
          content: `文章标题：${title}\n\n文章内容：${content.substring(0, 20000)}`
        }
      ],
      max_tokens: 100,
      temperature: 0.5
    })

    const tagsContent = response.choices[0]?.message?.content?.trim() || ''
    return tagsContent.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  } catch (error) {
    console.error('生成标签失败:', error)
    return []
  }
}

module.exports = {
  generateSummary,
  generateTags
}