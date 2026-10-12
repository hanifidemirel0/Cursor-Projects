import fs from 'node:fs/promises';
import {FileBlob, SpreadsheetFile} from '@oai/artifact-tool';
const root='C:/Users/hanif/Cursor-Projects';
const path=root+'/outputs/01a0e6cb-7e1f-7113-8240-55bc8904e0f2/etl-evaluation/ETL-Tool-Comparison.xlsx';
const dir=root+'/outputs/01a1304c-359e-75c2-bf15-38aac422a6ae/etl-review';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(path));
await fs.writeFile(dir+'/baseline.json',JSON.stringify(Object.fromEntries(['Scorecard','Comparison','Sources'].map(n=>[n,wb.worksheets.getItem(n).getUsedRange().values])),null,2));
console.log((await wb.inspect({kind:'sheet',include:'id,name',maxChars:1500})).ndjson);
for(const [sheetName,range,name] of [['Scorecard','B2:H23','before-scorecard'],['Comparison','B24:G31','before-comparison']]) {
 const p=await wb.render({sheetName,range,scale:1});
 await fs.writeFile(dir+'/'+name+'.png',new Uint8Array(await p.arrayBuffer()));
}
