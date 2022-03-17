import inquirer from 'inquirer'
import ora from 'ora'
// @ts-ignore
import download from 'download-git-repo'
import chalk from 'chalk'
import shell from 'shelljs'
// @ts-ignore
import { writeFileSync, readdirSync } from 'fs'
import templateList from '../src/template'
import { resolve } from 'path'
import generatePkg from '../utils/generatePkg'

// import { log } from '../utils'

const __dirname = resolve()

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
    filter: function (val: any) {
      return val.toLowerCase()
    }
  },
  {
    name: 'author',
    type: 'input',
    message: 'please input author name: '
  },
  {
    name: 'description',
    type: 'input',
    message: 'please input project description: '
  }
]

function successTips (projectName: string, isInstall: boolean) {
  return `
项目初始化成功
请运行以下命令启动项目
  cd ${projectName} 
  ${isInstall ? `` : '\n  yarn\n'}
  npm run dev`
}

export default function createAction (projectName: string, opts: any) {
  inquirer.prompt(question).then((ans: any) => {
    const spinner = ora('正在创建项目，请稍等...').start()
    spinner.color = 'yellow'
    const repoUrl: string = (templateList as any)[ans.templateType] || ''
    // spinner.stop()
    if (!repoUrl) {
      console.error('当前模板暂未开发, 敬请期待')
    } else {
      console.log('当前模板链接为:', repoUrl)
      download(repoUrl, projectName, { clone: true }, function (err: any) {

        if(err) {
          spinner.fail(chalk.red('fail') + ' 下载失败')
          console.log(err)
        } else {
          spinner.succeed(chalk.green('success') + ' 下载成功')
          console.log('正在安装相关依赖...')
          shell.exec(`cd ${projectName} & yarn`)
          if (opts.git) {
            console.log('正在初始化git仓库...')
            opts.git && shell.exec(`cd ${projectName} & git init`)
          }
          const files = readdirSync(projectName)
          console.log(chalk.green(successTips(projectName, files.includes('node_modules'))))
          const projectPkgPath = resolve(__dirname, projectName, 'package.json')
          const projectPkg = generatePkg(projectPkgPath, {
            name: projectName,
            author: ans.author || 'ls',
            description: ans.description || `a ${ans.templateType} template`
          })
          writeFileSync(projectPkgPath, projectPkg)

        }
      })
    }
  })
}
