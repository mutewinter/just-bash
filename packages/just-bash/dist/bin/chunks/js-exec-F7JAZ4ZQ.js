#!/usr/bin/env node
import{createRequire} from"node:module";const require=createRequire(import.meta.url);
import{a as C,b as F}from"./chunk-SF2OLINE.js";import"./chunk-3MRB66F4.js";import"./chunk-O2BCKSMK.js";import"./chunk-NYIPFY36.js";import{a as w,b as g}from"./chunk-UNWZQG7U.js";import{a as j}from"./chunk-MROECM42.js";import{b as v}from"./chunk-LX2H4DPL.js";import{a as S}from"./chunk-DHIKZU63.js";import{a as b,b as h}from"./chunk-PBOVSFTJ.js";import{a as k}from"./chunk-I4IRHQDW.js";import{b as E}from"./chunk-MUFNRCMY.js";import"./chunk-LNVSXNT7.js";import{AsyncLocalStorage as O}from"node:async_hooks";import{randomBytes as R}from"node:crypto";import{fileURLToPath as _}from"node:url";import{Worker as L}from"node:worker_threads";var U=1e4,I=6e4,A=new O,M=`js-exec - Sandboxed JavaScript/TypeScript runtime with Node.js-compatible APIs

Usage: js-exec [OPTIONS] [-c CODE | FILE] [ARGS...]

Options:
  -c CODE          Execute inline code
  -m, --module     Enable ES module mode (import/export)
  --strip-types    Strip TypeScript type annotations
  --version, -V    Show version
  --help           Show this help

Examples:
  js-exec -c "console.log(1 + 2)"
  js-exec script.js
  js-exec app.ts
  echo 'console.log("hello")' | js-exec

File Extension Auto-Detection:
  .js              script mode (module mode if top-level await detected)
  .mjs             ES module mode
  .ts, .mts        ES module mode + TypeScript stripping

Node.js Compatibility:
  Code written for Node.js largely works here. Both require and import
  are supported, the node: prefix works, and standard globals like process,
  console, and fetch are available. All I/O is synchronous.

  Available modules:
    fs, path, child_process, process, console,
    os, url, assert, util, events, buffer, stream,
    string_decoder, querystring

  fs (global, require('fs'), or import from 'node:fs'):
    readFileSync, writeFileSync, appendFileSync, copyFileSync, renameSync
    readdirSync, mkdirSync, rmSync, unlinkSync, rmdirSync
    statSync, lstatSync, existsSync, realpathSync, chmodSync
    symlinkSync, readlinkSync, readFileBuffer
    fs.promises.readFile, fs.promises.writeFile, fs.promises.access, ...

  path: join, resolve, dirname, basename, extname, normalize,
    relative, isAbsolute, parse, format, sep, delimiter

  child_process:
    execSync(cmd)       throws on non-zero exit, returns stdout
    spawnSync(cmd, args) returns { stdout, stderr, status }

  process (also global): argv, cwd(), exit(), env, platform, arch,
    version, versions

  os: platform(), arch(), homedir(), tmpdir(), type(), hostname(),
    EOL, cpus(), endianness()

  url: URL, URLSearchParams, parse(), format()

  assert: ok(), equal(), strictEqual(), deepEqual(), throws(),
    doesNotThrow(), fail()

  util: format(), inspect(), promisify(), types, inherits()

  events: EventEmitter (on, once, emit, off, removeListener, ...)

  buffer: Buffer.from(), Buffer.alloc(), Buffer.concat(),
    Buffer.isBuffer(), toString(), slice(), equals()

  stream: Readable, Writable, Duplex, Transform, PassThrough, pipeline

  string_decoder: StringDecoder (write, end)

  querystring: parse(), stringify(), escape(), unescape()

Other Globals:
  console            log (stdout), error/warn (stderr)
  fetch(url, opts)   HTTP; returns Promise<Response> (Web Fetch API)
  URL, URLSearchParams, Headers, Request, Response
  Buffer             Buffer.from(), Buffer.alloc(), etc.

Not Available:
  http, https, net, tls, crypto, zlib, dns, cluster, worker_threads,
  vm, v8, readline, and other Node.js built-in modules that require
  native bindings. Use fetch() for HTTP requests.

Limits:
  Memory: 64 MB per execution
  Timeout: 10 s (60 s with network; configurable via maxJsTimeoutMs)
  Engine: QuickJS (compiled to WebAssembly)
`;function J(t){let e={code:null,scriptFile:null,showVersion:!1,scriptArgs:[],isModule:!1,stripTypes:!1};if(t.length===0)return e;for(let r=0;r<t.length;r++){let s=t[r];if(s==="-m"||s==="--module"){e.isModule=!0;continue}if(s==="--strip-types"){e.stripTypes=!0;continue}if(s==="-c")return r+1>=t.length?{stdout:"",stderr:`js-exec: option requires an argument -- 'c'
`,exitCode:2}:(e.code=t[r+1],e.scriptArgs=t.slice(r+2),e);if(s==="--version"||s==="-V")return e.showVersion=!0,e;if(s.startsWith("-")&&s!=="-"&&s!=="--")return{stdout:"",stderr:`js-exec: unrecognized option '${s}'
`,exitCode:2};if(s==="--")return r+1<t.length&&(e.scriptFile=t[r+1],e.scriptArgs=t.slice(r+2)),e;if(!s.startsWith("-"))return e.scriptFile=s,e.scriptArgs=t.slice(r+1),e}return e}var c=null,y=null,u=[],n=null,D=_(new URL("./js-exec-worker.js",import.meta.url));function p(){for(;u.length>0&&u[0].canceled;)u.shift();if(n||u.length===0)return;let t=u.shift();if(!t)return;n=t,H().postMessage(n.input)}function N(t,e){if(!t||typeof t!="object")return{success:!1,error:"Malformed worker response"};let r=t;return typeof r.protocolToken!="string"||r.protocolToken!==e?{success:!1,error:"Malformed worker response: invalid protocol token"}:typeof r.success!="boolean"?{success:!1,error:"Malformed worker response: missing success flag"}:r.success?{success:!0}:{success:!1,error:typeof r.error=="string"&&r.error.length>0?r.error:"Worker execution failed"}}function H(){if(y&&(g(y),y=null),c)return c;let t=v.runTrusted(()=>new L(D));return c=t,t.on("message",e=>{if(c===t){if(n){let r=N(e,n.input.protocolToken);n.resolve(r),n=null}u.length>0?p():z()}}),t.on("error",e=>{if(c===t){if(n){let r=h(k(e));n.resolve({success:!1,error:r}),n=null}for(let r of u)r.resolve({success:!1,error:"Worker crashed"});u.length=0,c=null}}),t.on("exit",()=>{c===t&&(c=null,n&&(n.resolve({success:!1,error:"Worker exited unexpectedly"}),n=null),u.length>0&&p())}),t}function z(){y=w(()=>{c&&!n&&u.length===0&&(c.terminate(),c=null)},5e3)}async function $(t,e,r,s=[],o,i,a){return A.getStore()?{stdout:"",stderr:`js-exec: recursive invocation is not supported
`,exitCode:1}:G(t,e,r,s,o,i,a)}async function V(t,e,r){let s,o=new Promise(l=>{s=l}),i={input:t,resolve:()=>{}},a=w(()=>{if(n===i){let l=c;l&&(c=null,l.terminate()),n=null,p()}else i.canceled=!0,n||p();i.resolve({success:!1,error:`Execution timeout: exceeded ${r}ms limit`})},r);i.resolve=l=>{g(a),s(l)},u.push(i),p();let[f,d]=await Promise.all([e.run(r),o.catch(l=>({success:!1,error:h(k(l))}))]);return{bridgeOutput:f,workerResult:d}}function Q(t){let e=t.limits?.maxJsTimeoutMs??U;return t.fetch?Math.max(e,I):e}async function G(t,e,r,s=[],o,i,a){let f=C(),d=e.exec,l=d?(P,q)=>A.run(!0,()=>d(P,q)):void 0,W=new F(f,e.fs,e.cwd,"js-exec",e.fetch,e.limits?.maxOutputSize??0,l,e.invokeTool),T=Q(e),B={protocolToken:R(16).toString("hex"),sharedBuffer:f,jsCode:t,cwd:e.cwd,env:j(e.env),args:s,scriptPath:r,bootstrapCode:o,isModule:i,stripTypes:a,timeoutMs:T,hasInvokeTool:e.invokeTool!==void 0},{bridgeOutput:m,workerResult:x}=await V(B,W,T);return!x.success&&x.error?{stdout:m.stdout,stderr:`${m.stderr}js-exec: ${h(x.error)}
`,exitCode:m.exitCode||1}:{...m}}var ae={name:"js-exec",async execute(t,e){if(E(t))return{stdout:M,stderr:"",exitCode:0};let r=J(t);if("exitCode"in r)return r;if(r.showVersion)return{stdout:`QuickJS (quickjs-emscripten)
`,stderr:"",exitCode:0};let s,o;if(r.code!==null)s=r.code,o="-c";else if(r.scriptFile!==null){let d=e.fs.resolvePath(e.cwd,r.scriptFile);if(!await e.fs.exists(d))return{stdout:"",stderr:`js-exec: can't open file '${r.scriptFile}': No such file or directory
`,exitCode:2};try{s=await e.fs.readFile(d),o=d}catch(l){return{stdout:"",stderr:`js-exec: can't open file '${r.scriptFile}': ${b(l.message)}
`,exitCode:2}}}else if(S(e.stdin).trim())s=S(e.stdin),o="<stdin>";else return{stdout:"",stderr:`js-exec: no input provided (use -c CODE or provide a script file)
`,exitCode:2};let i=r.isModule,a=r.stripTypes;o&&o!=="-c"&&o!=="<stdin>"&&((o.endsWith(".mjs")||o.endsWith(".mts")||o.endsWith(".ts"))&&(i=!0),(o.endsWith(".ts")||o.endsWith(".mts"))&&(a=!0)),!i&&/\bawait\s+[\w([`]/.test(s)&&(i=!0);let f=e.jsBootstrapCode;return $(s,e,o,r.scriptArgs,f,i,a)}},de={name:"node",async execute(){return{stdout:"",stderr:`node: this sandbox uses js-exec instead of node

${M}`,exitCode:1}}};export{ae as jsExecCommand,de as nodeStubCommand};
