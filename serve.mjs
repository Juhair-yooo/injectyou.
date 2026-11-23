import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const directory=fileURLToPath(new URL('.',import.meta.url));
const port=Number(process.env.INJECTYOU_PREVIEW_PORT||4173);
// Only serve browser assets, never databases, environment files or source metadata.
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const target=resolve(directory,'.'+(pathname==='/'?'/index.html':pathname));const name=pathname.split('/').filter(Boolean);if(!target.startsWith(directory.endsWith(sep)?directory:directory+sep)||!['GET','HEAD'].includes(req.method)||name.some(part=>part.startsWith('.'))||name.length>1||!mime[extname(target).toLowerCase()]){res.writeHead(403).end('Not allowed');return}const info=await stat(target);if(!info.isFile())throw new Error('Not a file');const bytes=await readFile(target);res.writeHead(200,{'Content-Type':mime[extname(target).toLowerCase()],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://eahlazecgokyedxaxebw.supabase.co; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:bytes)}catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found')}});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port} — private design preview`));


