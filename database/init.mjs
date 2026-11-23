import {DatabaseSync} from 'node:sqlite';
import {readFileSync, mkdirSync, chmodSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const dir=dirname(fileURLToPath(import.meta.url));
const location=join(dir,'local');
mkdirSync(location,{recursive:true});
const filename=join(location,'injectyou.sqlite');
const db=new DatabaseSync(filename);
try {
 db.exec('PRAGMA foreign_keys = ON');
 db.exec(readFileSync(join(dir,'schema.sql'),'utf8'));
 try { chmodSync(filename,0o600); } catch { /* Windows permissions follow the directory ACL. */ }
 console.log('Local development database initialized:',filename);
 console.log('Schema version:',db.prepare('SELECT MAX(version) AS version FROM schema_migrations').get().version);
 console.log('For sample data only: no authentication or production authorization is configured.');
} finally { db.close(); }
