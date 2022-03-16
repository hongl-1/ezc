import inquirer from 'inquirer'
import ora from 'ora'
import download from 'download-git-repo'
import chalk from 'chalk'
import shell from 'shelljs'
import fs from 'fs'
import templateList from 'template.js'

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
  ${isInstall ? `` : '\n  yarn\n'}
  npm run dev`
}

export default function createAction (projectName, opts) {
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
          opts.git && shell.exec(`cd ${projectName} & git init`)
          const files = fs.readdirSync(projectName)
          console.log(chalk.green(successTips(projectName, files.includes('node_modules'))))
        }
      })
    }
  })
}
