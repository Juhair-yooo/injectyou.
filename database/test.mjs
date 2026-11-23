import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const db=new DatabaseSync(':memory:');
try {
 db.exec('PRAGMA foreign_keys=ON');
 db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
 db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
 assert.equal(db.prepare('SELECT count(*) AS n FROM fields').get().n,4);
 db.exec("INSERT INTO accounts(id,role,name,email,status) VALUES (1,'company','Example Co','co@example.test','active'),(2,'intern','Sample Intern','intern@example.test','active')");
 db.exec("INSERT INTO companies(account_id,contact_name) VALUES (1,'Example Contact'); INSERT INTO projects(id,company_id,field_id,title,specification) VALUES (1,1,1,'Example project','Sample brief'); INSERT INTO assignments(id,project_id,intern_id) VALUES (1,1,2)");
 assert.throws(()=>db.exec("INSERT INTO applications(project_id,intern_id) VALUES (99,2)"),/FOREIGN KEY/);
 assert.throws(()=>db.exec("INSERT INTO intern_payouts(assignment_id,amount_minor,currency) VALUES (1,-1,'USD')"),/CHECK/);
 assert.throws(()=>db.exec("INSERT INTO accounts(role,name,email) VALUES ('other','Invalid','bad@example.test')"),/CHECK/);
 assert.throws(()=>db.exec('INSERT INTO assignments(project_id,intern_id) VALUES (1,2)'),/UNIQUE/);
 console.log('Database schema: initialization, foreign keys, monetary constraints and duplicate assignment checks passed.');
} finally { db.close(); }
