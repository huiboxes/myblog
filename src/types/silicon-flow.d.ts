/**
 * 硅基流动(SiliconFlow)集成配置类型定义
 */

export interface SiliconFlowIntegrationConfig {
  /** 是否启用硅基流动功能 */
  enable: boolean
  /** 默认使用的模型 */
  defaultModel: string
}

// 扩展集成用户配置类型
declare module 'astro-pure/types' {
  interface IntegrationUserConfig {
    /** 硅基流动集成配置 */
    siliconFlow?: SiliconFlowIntegrationConfig
  }
}