import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import download from 'download-git-repo';
import chalk from 'chalk';
import shell from 'shelljs';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

var templateList = {
    'uni-app': 'direct:https://gitee.com/tianyong/we-vue.git#master',
    'react': 'direct:https://gitee.com/hongl_123/this-is-a-test-repo.git#master',
    'vue3-ts-vite': 'direct:http://git.lishicloud.com/hongliang/standard-manage-template-vue3.git#master',
    'vue2': 'https://www.google.com'
};

function generatePkg(pkgPath, options) {
    const data = readFileSync(pkgPath, 'utf-8');
    let parseData = JSON.parse(data);
    parseData.name = options.name;
    parseData.author = options.author;
    parseData.description = options.description;
    return JSON.stringify(parseData, null, '\t');
}

// import { log } from '../utils'
const __dirname = resolve();
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
            return val.toLowerCase();
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
];
function successTips(projectName, isInstall) {
    return `
项目初始化成功
请运行以下命令启动项目
  cd ${projectName} 
  ${isInstall ? `` : '\n  yarn\n'}
  npm run dev`;
}
function createAction(projectName, opts) {
    inquirer.prompt(question).then((ans) => {
        const spinner = ora('正在创建项目，请稍等...').start();
        spinner.color = 'yellow';
        const repoUrl = templateList[ans.templateType] || '';
        // spinner.stop()
        if (!repoUrl) {
            console.error('当前模板暂未开发, 敬请期待');
        }
        else {
            console.log('当前模板链接为:', repoUrl);
            download(repoUrl, projectName, { clone: true }, function (err) {
                if (err) {
                    spinner.fail(chalk.red('fail') + ' 下载失败');
                    console.log(err);
                }
                else {
                    spinner.succeed(chalk.green('success') + ' 下载成功');
                    console.log('正在安装相关依赖...');
                    shell.exec(`cd ${projectName} & yarn`);
                    if (opts.git) {
                        console.log('正在初始化git仓库...');
                        opts.git && shell.exec(`cd ${projectName} & git init`);
                    }
                    const files = readdirSync(projectName);
                    console.log(chalk.green(successTips(projectName, files.includes('node_modules'))));
                    const projectPkgPath = resolve(__dirname, projectName, 'package.json');
                    const projectPkg = generatePkg(projectPkgPath, {
                        name: projectName,
                        author: ans.author || 'ls',
                        description: ans.description || `a ${ans.templateType} template`
                    });
                    writeFileSync(projectPkgPath, projectPkg);
                }
            });
        }
    });
}

var name = "ezc";
var version = "1.0.3";
var description = "";
var bin = {
	la: "bin/la.js"
};
var type = "module";
var scripts = {
	compile: "tsc",
	start: "ts-node bin/index.ts",
	dev: "nodemon --watch / -e ts --exec tsc",
	"release-it": "release-it",
	test: "echo \"Error: no test specified\" && exit 1"
};
var author = "";
var license = "ISC";
var devDependencies = {
	"@rollup/plugin-commonjs": "^21.0.2",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.1.3",
	"@rollup/plugin-typescript": "^8.3.1",
	"@types/chalk": "^2.2.0",
	"@types/commander": "^2.12.2",
	"@types/inquirer": "^8.2.0",
	"@types/node": "^17.0.21",
	"@types/shelljs": "^0.8.11",
	"release-it": "^14.12.5",
	"rollup-plugin-commonjs": "^10.1.0",
	"rollup-plugin-node-resolve": "^5.2.0",
	"rollup-plugin-terser": "^7.0.2",
	"ts-node-dev": "^1.1.8",
	typescript: "^4.6.2"
};
var dependencies = {
	chalk: "^5.0.1",
	commander: "^9.0.0",
	"download-git-repo": "^3.0.2",
	inquirer: "^8.2.1",
	"log-symbols": "^5.1.0",
	"node-fetch": "^2.6.7",
	ora: "^6.1.0",
	shell: "^0.9.2",
	shelljs: "^0.8.5"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	bin: bin,
	type: type,
	scripts: scripts,
	author: author,
	license: license,
	devDependencies: devDependencies,
	dependencies: dependencies
};

// #!/usr/bin/env node
const program = new Command();
program.usage('<command>');
program.version(pkg.version, '-v, --version', '获取版本号');
program
    .command('init')
    .description('初始化2')
    .argument('<type>', '输入一个类型')
    .argument('[name]', '输入一个名称')
    .action((type, name) => {
    console.log(type, name);
});
program
    .command('create')
    .description('创建一个新的项目')
    .argument('<projectName>', '输入一个项目名称')
    .option('-g, --git', 'init git repo', true)
    .option('-n, --no-git', 'not init git repo')
    .action((projectName, opts) => {
    createAction(projectName, opts);
});
program.parse(process.argv);
program.opts();
