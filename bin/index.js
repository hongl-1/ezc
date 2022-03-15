#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()
import inquirer from 'inquirer'
import download from'download-git-repo'
import ora from 'ora'
import shell from 'shelljs'
import chalk from 'chalk'
import * as fs from 'fs'

program.usage('<command>')

program.version('0.0.1', '-v,-- version', '获取版本号')

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program
  .command('init')
  .description('初始化2')
  .argument('<type>', '输入一个类型')
  .argument('[name]', '输入一个名称')
  .action((type, name) => {
    console.log(type, name)
  })

const templateList = {
  'uni-app': 'direct:https://gitee.com/tianyong/we-vue.git#master',
  'react': 'direct:https://gitee.com/hongl_123/this-is-a-test-repo.git#master',
  'vue3-ts-vite': 'direct:http://git.lishicloud.com/hongliang/standard-manage-template-vue3.git#master',
  'vue2': 'https://www.google.com'
}

let question = [
  {
    type: 'list',
    message: '请选择一个模板',
    name: 'templateType',
    choices: [
      'uni-app',
      'vue3-ts-vite',
      'vue3-ts-wp',
      'vue2',
      'react',
      'react-ts'
    ],
    filter: function (val) {
      return val.toLowerCase()
    }
  },
  // {
  //   name: 'name',
  //   type: 'input',
  //   message: '请输入模板名称',
  //   validate(val) {
  //     if (!val) {
  //       return 'Name is required!'
  //     }
  //     // else if (templateList[val]) {
  //     //   return 'Template has already existed!'
  //     // }
  //     else {
  //       return true
  //     }
  //   }
  // },
  // {
  //   name: 'url',
  //   type: 'input',
  //   message: '请输入模板地址',
  //   validate(val) {
  //     if (val === '') return 'The url is required!'
  //     return true
  //   }
  // }
]

function successTips (projectName, isInstall) {
  return `
项目初始化成功
请运行以下命令启动项目
  cd ${projectName}
  ${isInstall ? `\n` : '\n  yarn\n'}
  npm run dev`
}

program
  .command('create')
  .description('创建一个新的项目')
  .argument('<projectName>', '输入一个项目名称')
  .action((projectName) => {
    // todo 这里记录项目名称后续创建文件夹以及package.json
    // console.log('你输入的项目名称为:', projectName)
    inquirer.prompt(question).then(ans => {
      const spinner = ora('正在创建项目，请稍等...').start()
      spinner.color = 'yellow'
      const repoUrl = templateList[ans.templateType] || ''
      // spinner.stop()
      if (!repoUrl) {
        console.error('当前模板暂未开发, 敬请期待')
      } else {
        // console.log('当前模板链接为:', repoUrl)
        download(repoUrl, projectName, { clone: true }, function (err) {

          if(err) {
            spinner.fail(chalk.red('fail') + ' 下载失败')
            console.log(err)
          } else {
            spinner.succeed(chalk.green('success') + ' 下载成功')
            shell.exec(`cd ${projectName} & yarn`)
            const files = fs.readdirSync(projectName)
            console.log(chalk.green(successTips(projectName, files.includes('node_modules'))))
          }
        })
      }
    })
  })


program.parse(process.argv)

const options = program.opts()
