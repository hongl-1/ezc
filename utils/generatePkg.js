import fs from 'fs';
function generatePkg(pkgPath, options) {
    const data = fs.readFileSync(pkgPath, 'utf-8');
    let parseData = JSON.parse(data);
    parseData.name = options.name;
    parseData.author = options.author;
    parseData.description = options.description;
    return JSON.stringify(parseData, null, '\t');
}
export default generatePkg;
