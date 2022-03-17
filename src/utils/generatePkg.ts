import { readFileSync } from 'fs'

interface OptionsType {
  name: string
  author: string
  description: string
}

function generatePkg (pkgPath: string, options: OptionsType): string {
  const data = readFileSync(pkgPath, 'utf-8')
  let parseData: any = JSON.parse(data)
  parseData.name = options.name
  parseData.author = options.author
  parseData.description = options.description
  return JSON.stringify(parseData, null, '\t')
}

export default generatePkg
