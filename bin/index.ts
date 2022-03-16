#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()
import createAction from '../actions/create.action.js'
import * as fs from 'fs'
// @ts-ignore
import path from 'path'

program.usage('<command>')

program.version('1.0.0', '-v, --version', '获取版本号')

program
  .command('init')
  .description('初始化2')
  .argument('<type>', '输入一个类型')
  .argument('[name]', '输入一个名称')
  .action((type, name) => {
    console.log(type, name)
  })

program
  .command('create')
  .description('创建一个新的项目')
  .argument('<projectName>', '输入一个项目名称')
  .option('-g, --git', 'init git repo', true)
  .option('-n, --no-git', 'not init git repo')
  .action((projectName, opts) => {
    createAction(projectName, opts)
  })


program.parse(process.argv)

const options = program.opts()
