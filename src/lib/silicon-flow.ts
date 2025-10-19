import type { AstroGlobal } from 'astro'

/**
 * 硅基流动(Silicon Flow) API集成模块
 * 提供与硅基流动平台的交互功能
 */

// 硅基流动API基础URL
const SILICON_FLOW_API_BASE = 'https://api.siliconflow.cn/v1'

// 硅基流动API密钥 - 从环境变量获取
const SILICON_FLOW_API_KEY = import.meta.env.SILICON_FLOW_API_KEY

/**
 * 硅基流动聊天完成请求参数
 */
export interface SiliconFlowChatCompletionRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

/**
 * 硅基流动聊天完成响应
 */
export interface SiliconFlowChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * 检查API密钥是否已配置
 */
export function isSiliconFlowConfigured(): boolean {
  return !!SILICON_FLOW_API_KEY
}

/**
 * 调用硅基流动聊天完成API
 * @param request 聊天完成请求参数
 * @returns 聊天完成响应
 */
export async function chatCompletion(
  request: SiliconFlowChatCompletionRequest
): Promise<SiliconFlowChatCompletionResponse> {
  if (!SILICON_FLOW_API_KEY) {
    throw new Error('SILICON_FLOW_API_KEY 未配置，请在环境变量中设置')
  }

  const response = await fetch(`${SILICON_FLOW_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SILICON_FLOW_API_KEY}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`硅基流动API请求失败: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * 生成文章摘要
 * @param content 文章内容
 * @param model 使用的模型
 * @returns 生成的摘要
 */
export async function generateSummary(content: string, model = 'Qwen/Qwen2.5-7B-Instruct'): Promise<string> {
  try {
    const response = await chatCompletion({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的编辑，能够为文章生成简洁准确的摘要。摘要应该在100字以内，突出文章的核心观点。',
        },
        {
          role: 'user',
          content: `请为以下文章生成摘要：\n\n${content.substring(0, 2000)}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content?.trim() || '无法生成摘要'
  } catch (error) {
    console.error('生成摘要失败:', error)
    return '摘要生成失败'
  }
}

/**
 * 为文章生成标签
 * @param title 文章标题
 * @param content 文章内容
 * @param model 使用的模型
 * @returns 生成的标签列表
 */
export async function generateTags(
  title: string,
  content: string,
  model = 'Qwen/Qwen2.5-7B-Instruct'
): Promise<string[]> {
  try {
    const response = await chatCompletion({
      model,
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的编辑，能够根据文章标题和内容生成相关的标签。请提供3-5个最相关的标签，用逗号分隔。标签应该简洁明了，用中文表达。',
        },
        {
          role: 'user',
          content: `文章标题：${title}\n\n文章内容：${content.substring(0, 1000)}`,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
    })

    const tagsContent = response.choices[0]?.message?.content?.trim() || ''
    return tagsContent.split('，').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
  } catch (error) {
    console.error('生成标签失败:', error)
    return []
  }
}