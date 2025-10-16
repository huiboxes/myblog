const r2 = require('@elog/plugin-img-r2')


module.exports = {
  write: {
    platform: 'yuque-pwd',
    'yuque-pwd': {
      username: process.env.YUQUE_USERNAME,
      password: process.env.YUQUE_PASSWORD,
      login: process.env.YUQUE_LOGIN,
      repo: process.env.YUQUE_REPO,
      onlyPublic: false,
      onlyPublished: true,
    }
  },
  deploy: {
    platform: 'local',
    local: {
      outputDir: './src/content/blog/',
      filename: 'urlname',
      catalog: true,
      format: 'markdown',
      frontMatter: {
        enable: true,
        exclude: ['status','urlname'],
      },
    },
  },
  image: {
    enable: false,
    plugin: 'r2',
    r2: {
      accessKeyId: process.env.R2_ACCESSKEYID,
      secretAccessKey: process.env.R2_SECRET_ACCESSKEY,
      bucket: process.env.R2_BUCKET,
      endpoint: process.env.R2_ENDPOINT,
      host: process.env.R2_HOST,
      prefixKey: ''
    }
  }
}
