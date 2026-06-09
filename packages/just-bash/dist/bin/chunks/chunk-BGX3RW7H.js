#!/usr/bin/env node
import{createRequire} from"node:module";const require=createRequire(import.meta.url);
async function c(e,t){if(e.length>0&&e[0]!=="-"){let i=t.fs.resolvePath(t.cwd,e[0]);try{let o=(await t.fs.readFile(i)).split(`
`);o[o.length-1]===""&&o.pop();let r=o.reverse();return{stdout:r.length>0?`${r.join(`
`)}
`:"",stderr:"",exitCode:0}}catch{return{stdout:"",stderr:`tac: ${e[0]}: No such file or directory
`,exitCode:1}}}let n=t.stdin.split(`
`);n[n.length-1]===""&&n.pop();let s=n.reverse();return{stdout:s.length>0?`${s.join(`
`)}
`:"",stderr:"",exitCode:0}}var u={name:"tac",execute:c},f={name:"tac",flags:[],stdinType:"text",needsFiles:!0};export{u as a,f as b};
