// Plop 入口文件，需要导出一个函数
// 此函数接收一个 plop 对象，用于创建生成器任务

module.exports = plop => {
  plop.setGenerator('page', {
    description: 'create a page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'page name',
        default: 'MyPage'
      }
    ],
    actions: [
      {
        type: 'add', // 代表添加文件
        path: 'pages/{{name}}/index.vue',
        templateFile: 'plop-templates/component.hbs'
      }
    ]
  })
}