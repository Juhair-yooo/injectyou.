import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const directory=fileURLToPath(new URL('.',import.meta.url));
const port=Number(process.env.INJECTYOU_PREVIEW_PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const target=resolve(directory,'.'+(pathname==='/'?'/index.html':pathname));if(!target.startsWith(directory.endsWith(sep)?directory:directory+sep)||!['GET','HEAD'].includes(req.method)){res.writeHead(403).end('Not allowed');return}const info=await stat(target);if(!info.isFile())throw new Error('Not a file');const bytes=await readFile(target);res.writeHead(200,{'Content-Type':mime[extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:bytes)}catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found')}});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port} — private design preview`));
