module.exports = {
apps: [
  {
    name: 'wecode.co.zw',
    port: '3033',
    exec_mode: 'cluster',
    instances: '1',
    script: './.output/server/index.mjs',
  
  }
]
}
