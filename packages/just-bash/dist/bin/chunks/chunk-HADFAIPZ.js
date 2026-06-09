#!/usr/bin/env node
import{createRequire} from"node:module";const require=createRequire(import.meta.url);
import{b,d as g}from"./chunk-VZK4FHWJ.js";import{c as p}from"./chunk-MUFNRCMY.js";function $(t,i){let r=10,s=null,f=!1,l=!1,n=!1,u=[];for(let o=0;o<t.length;o++){let e=t[o];if(e==="-n"&&o+1<t.length){let a=t[++o];i==="tail"&&a.startsWith("+")?(n=!0,r=parseInt(a.slice(1),10)):r=parseInt(a,10)}else if(i==="tail"&&e.startsWith("-n+"))n=!0,r=parseInt(e.slice(3),10);else if(e.startsWith("-n"))r=parseInt(e.slice(2),10);else if(e==="-c"&&o+1<t.length)s=parseInt(t[++o],10);else if(e.startsWith("-c"))s=parseInt(e.slice(2),10);else if(e.startsWith("--bytes="))s=parseInt(e.slice(8),10);else if(e.startsWith("--lines="))r=parseInt(e.slice(8),10);else if(e==="-q"||e==="--quiet"||e==="--silent")f=!0;else if(e==="-v"||e==="--verbose")l=!0;else if(e.match(/^-\d+$/))r=parseInt(e.slice(1),10);else{if(e.startsWith("--"))return{ok:!1,error:p(i,e)};if(e.startsWith("-")&&e!=="-")return{ok:!1,error:p(i,e)};u.push(e)}}return s!==null&&(Number.isNaN(s)||s<0)?{ok:!1,error:{stdout:"",stderr:`${i}: invalid number of bytes
`,exitCode:1}}:Number.isNaN(r)||r<0?{ok:!1,error:{stdout:"",stderr:`${i}: invalid number of lines
`,exitCode:1}}:{ok:!0,options:{lines:r,bytes:s,quiet:f,verbose:l,files:u,fromLine:n}}}async function k(t,i,r,s){let{quiet:f,verbose:l,files:n}=i;if(n.length===0)return{stdout:s(t.stdin),stderr:"",exitCode:0,stdoutEncoding:"binary"};let u="",o="",e=0,a=l||!f&&n.length>1,d=0;for(let h=0;h<n.length;h++){let c=n[h];try{let x=t.fs.resolvePath(t.cwd,c),w=await g(t.fs,x);a&&(d>0&&(u+=`
`),u+=b(`==> ${c} <==
`)),u+=s(w),d++}catch{o+=`${r}: ${c}: No such file or directory
`,e=1}}return{stdout:u,stderr:o,exitCode:e,stdoutEncoding:"binary"}}function v(t,i,r){if(r!==null)return t.slice(0,r);if(i===0)return"";let s=0,f=0,l=t.length;for(;s<l&&f<i;){let n=t.indexOf(`
`,s);if(n===-1)return`${t}
`;f++,s=n+1}return s>0?t.slice(0,s):""}function C(t,i,r,s){if(r!==null)return t.slice(-r);let f=t.length;if(f===0)return"";if(s){let o=0,e=1;for(;o<f&&e<i;){let d=t.indexOf(`
`,o);if(d===-1)break;e++,o=d+1}let a=t.slice(o);return a.endsWith(`
`)?a:`${a}
`}if(i===0)return"";let l=f-1;t[l]===`
`&&l--;let n=0;for(;l>=0&&n<i;){if(t[l]===`
`&&(n++,n===i)){l++;break}l--}l<0&&(l=0);let u=t.slice(l);return t[f-1]===`
`?u:`${u}
`}export{$ as a,k as b,v as c,C as d};
