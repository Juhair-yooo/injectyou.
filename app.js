const createClient = window.supabase?.createClient;
if (!createClient) {
 document.querySelector('#app').innerHTML = '<main class="info-page" id="main-content"><h1>Connection unavailable.</h1><p>We could not load account access. Check your connection and refresh the page.</p></main>';
 throw new Error('Unable to load the account SDK.');
}
const client = createClient('https://eahlazecgokyedxaxebw.supabase.co','sb_publishable_k471rGmWLwU3pqzUWSmUzg_wqRLHxeT');
const root = document.querySelector('#app');
const landing = document.querySelector('#landing-template');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brand = '<a class="brand" href="#/"><span class="brand-mark" aria-hidden="true">↗</span>inJectyou<span class="brand-period">.</span></a>';
let routeTicket = 0;
function authLayout(content) {
 root.innerHTML = `<main class="auth-page" id="main-content"><section class="auth-story">${brand}<h1>A little curiosity.<br><em>A new chapter.</em></h1><p>Bring who you are today. Discover what you could do tomorrow.</p><small>REAL PROJECTS. MEANINGFUL PROGRESS.</small><span class="auth-spark" aria-hidden="true">✳</span></section><section class="auth-content"><a class="auth-back" href="#/">← Back to inJectyou</a><div class="auth-panel">${content}</div></section></main>`;
}
function choice(signin) {
 authLayout(`<p class="eyebrow">${signin?'WELCOME BACK':'YOUR START, YOUR WAY'}</p><h2>${signin?'Find your workspace.':'Where do we begin?'}</h2><p>Choose your account type to continue.</p>${['intern','company'].map(role=>`<a class="role-card" href="#/${signin?'signin':'join'}/${role}"><span class="field-icon" style="background:#e0eabf">↗</span><div><strong>I’m ${role==='intern'?'an intern':'a company'}</strong><small>${role==='intern'?'Explore projects. Build your experience.':'Bring your next project to life.'}</small></div><span>↗</span></a>`).join('')}<p class="form-foot">${signin?'New here? <a href="#/join">Get started</a>':'Already have an account? <a href="#/signin">Sign in</a>'}</p>`);
}
function authForm(role, signin) {
 const admin=role==='admin';
 authLayout(`<span class="private-chip">◇ ${admin?'Private admin workspace':'Private account workspace'}</span><h2>${admin?'Admin sign in':signin?'Good to see you.':role==='company'?'Let’s bring it to life.':'Start with curiosity.'}</h2><p>${admin?'Admin accounts are provisioned separately.':signin?'Sign in to your account.':role==='company'?'Your company account will require review.':'Create your account to get started.'}</p><form id="account-access" data-role="${role}" data-mode="${signin?'signin':'signup'}"><label for="auth-email">Email address</label><input id="auth-email" name="email" type="email" autocomplete="email" required maxlength="254"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" autocomplete="${signin?'current-password':'new-password'}" required minlength="8"><p class="form-error" id="auth-error" role="alert"></p><button class="button button-primary" type="submit">${signin?'Sign in':'Create account'} <span>↗</span></button></form>${!admin?`<p class="form-foot">${signin?'New here?':'Already have an account?'} <a href="#/${signin?'join':'signin'}/${role}">${signin?'Get started':'Sign in'}</a></p>`:''}`);
}
function setupForm(role) {
 authLayout(`<span class="private-chip">◇ Account setup</span><h2>One last step.</h2><p>Tell us how to address you${role==='company'?'. Company accounts are reviewed before activation':''}.</p><form id="account-setup" data-role="${role}"><label for="account-name">${role==='company'?'Company name':'Your name'}</label><input id="account-name" name="name" maxlength="120" required>${role==='company'?'<label for="account-contact">Contact person</label><input id="account-contact" name="contact" maxlength="120" required>':''}<p class="form-error" id="auth-error" role="alert"></p><button class="button button-primary" type="submit">Finish account setup <span>↗</span></button></form><button class="button button-outline" data-signout>Sign out</button>`);
}
function setupChoice() {
 authLayout('<p class="eyebrow">ACCOUNT SETUP</p><h2>Choose your workspace.</h2><p>Your email is signed in. Choose the account you want to set up.</p><a class="role-card" href="#/setup/intern"><span class="field-icon">↗</span><div><strong>I’m an intern</strong><small>Build your experience.</small></div><span>↗</span></a><a class="role-card" href="#/setup/company"><span class="field-icon coral">▤</span><div><strong>I’m a company</strong><small>Bring your next project to life.</small></div><span>↗</span></a><button class="button button-outline" data-signout>Sign out</button>');
}
async function accountPage(account, ticket) {
 const status=account.status==='pending'?'Your company account is awaiting review.':account.status==='blocked'?'This account is currently unavailable.':'Your account is active.';
 let content='', accounts=[];
 if(account.status==='active'&&['company','admin'].includes(account.role)) {
  const briefsResult=await client.from('injectyou_briefs').select('id,company_id,title,description,field,deadline,status,created_at').order('created_at',{ascending:false});
  const accountsResult=account.role==='admin'?await client.from('injectyou_accounts').select('id,display_name,contact_name,status,role').order('created_at',{ascending:false}):null;
  if(ticket!==routeTicket)return;
  if(briefsResult.error||accountsResult?.error) content='<div class="preview-notice">Project tools are being prepared. Please try again later.</div>';
  else {
   const briefs=briefsResult.data||[];accounts=accountsResult?.data||[];const companies=accounts.filter(a=>a.role==='company');
   if(account.role==='company')content=`<h3>Your project briefs</h3><p>Send a brief to the inJectyou team for review.</p><form id="brief-form"><label for="brief-title">Project title</label><input id="brief-title" name="title" maxlength="120" required><label for="brief-field">Field</label><select id="brief-field" name="field" required><option>Design</option><option>Data analysis</option><option>Cybersecurity</option><option>Management</option></select><label for="brief-description">Project description</label><textarea id="brief-description" name="description" rows="5" maxlength="5000" required></textarea><label for="brief-deadline">Deadline (optional)</label><input id="brief-deadline" name="deadline" type="date"><p class="form-error" role="alert"></p><button class="button button-primary" type="submit">Submit brief <span>↗</span></button></form>`;
   else content=`<h3>Company accounts</h3>${companies.length?companies.map(c=>`<article class="role-card"><div><strong>${esc(c.display_name)}</strong><small>${esc(c.contact_name)} · ${esc(c.status)}</small>${c.status!=='active'?`<button type="button" data-review-company="${esc(c.id)}" data-status="active">Approve</button>`:''}${c.status!=='blocked'?` <button type="button" data-review-company="${esc(c.id)}" data-status="blocked">Block</button>`:''}</div></article>`).join(''):'<p>No company accounts yet.</p>'}<h3>Company briefs</h3>`;
   content+=briefs.length?briefs.map(b=>`<article class="role-card"><div><strong>${esc(b.title)}</strong><small>${esc(b.field)} · ${esc(b.status)}${b.deadline?' · Due '+esc(b.deadline):''}</small><p>${esc(b.description)}</p>${account.role==='admin'?`<small>Company: ${esc(companies.find(c=>c.id===b.company_id)?.display_name||b.company_id)}</small>${b.status==='submitted'?`<button type="button" data-review-brief="${esc(b.id)}">Mark reviewed</button>`:''}`:''}</div></article>`).join(''):'<p>No project briefs yet.</p>';
  }
 }
 if(account.status==='active'&&['admin','intern'].includes(account.role)) {
  const [opportunitiesResult,applicationsResult]=await Promise.all([
   client.from('injectyou_opportunities').select('id,title,description,field,fee_minor,currency,deadline,status').order('created_at',{ascending:false}),
   client.from('injectyou_applications').select('id,opportunity_id,intern_id,message,status').order('created_at',{ascending:false})
  ]);
  if(ticket!==routeTicket)return;
  if(opportunitiesResult.error||applicationsResult.error)content+='<div class="preview-notice">Opportunity tools are being prepared. Please try again later.</div>';
  else {
   const opportunities=opportunitiesResult.data||[],applications=applicationsResult.data||[];
   if(account.role==='admin')content+=`<h3>Publish an opportunity</h3><p>Use a brief that is safe to share with interns; company identity and private details should stay out of this description.</p><form id="opportunity-form"><label for="opportunity-title">Title</label><input id="opportunity-title" name="title" maxlength="120" required><label for="opportunity-field">Field</label><select id="opportunity-field" name="field"><option>Design</option><option>Data analysis</option><option>Cybersecurity</option><option>Management</option></select><label for="opportunity-description">Description for interns</label><textarea id="opportunity-description" name="description" maxlength="5000" rows="5" required></textarea><label for="opportunity-fee">Intern fee (USD cents)</label><input id="opportunity-fee" name="fee" type="number" min="0" max="100000000" step="1" required><label for="opportunity-deadline">Deadline (optional)</label><input id="opportunity-deadline" name="deadline" type="date"><p class="form-error" role="alert"></p><button class="button button-primary" type="submit">Publish opportunity <span>↗</span></button></form>`;
   content+='<h3>Opportunities</h3>';
   content+=opportunities.length?opportunities.map(o=>{const application=applications.find(a=>a.opportunity_id===o.id);return `<article class="role-card"><div><strong>${esc(o.title)}</strong><small>${esc(o.field)} · ${esc(o.status)} · $${(o.fee_minor/100).toFixed(2)} ${esc(o.currency)}${o.deadline?' · Due '+esc(o.deadline):''}</small><p>${esc(o.description)}</p>${account.role==='intern'?(application?`<small>Your application: ${esc(application.status)}</small>`:`<form class="application-form" data-opportunity="${esc(o.id)}"><label>Why are you interested?<textarea name="message" rows="3" maxlength="2000" required></textarea></label><p class="form-error" role="alert"></p><button class="button button-outline" type="submit">Apply</button></form>`):o.status==='open'?`<button type="button" data-close-opportunity="${esc(o.id)}">Close opportunity</button>`:''}</div></article>`;}).join(''):'<p>No opportunities available yet.</p>';
   if(account.role==='admin')content+=`<h3>Applications</h3>${applications.length?applications.map(a=>`<article class="role-card"><div><strong>${esc(opportunities.find(o=>o.id===a.opportunity_id)?.title||'Opportunity')}</strong><small>${esc(accounts.find(u=>u.id===a.intern_id)?.display_name||a.intern_id)} · ${esc(a.status)}</small><p>${esc(a.message)}</p>${a.status==='applied'?`<button type="button" data-review-application="${esc(a.id)}" data-status="assigned">Assign</button> <button type="button" data-review-application="${esc(a.id)}" data-status="declined">Decline</button>`:''}</div></article>`).join(''):'<p>No applications yet.</p>'}`;
  }
 }
 authLayout(`<span class="private-chip">◇ ${esc(account.role)} account</span><h2>Welcome, ${esc(account.display_name)}.</h2><p>${esc(status)}</p>${content}<p class="form-error" id="workspace-error" role="alert"></p><button class="button button-outline" data-signout>Sign out</button>`);
}
async function getAccount(user) {
 const {data,error}=await client.from('injectyou_accounts').select('id,role,display_name,contact_name,status').eq('id',user.id).maybeSingle();
 if(error) throw error;
 return data;
}
async function route() {
 const ticket=++routeTicket, path=(location.hash.replace(/^#\/?/,'')||'').split('/');
 if(!path[0]) {root.innerHTML=landing.innerHTML;renderCards();return;}
 if(['join','signin','admin-login','workspace','setup'].includes(path[0])) {authLayout('<p class="eyebrow">COMING SOON</p><h2>We’re getting things ready.</h2><p>Accounts are not open yet. Please check back when inJectyou launches.</p><a class="button button-primary" href="#/">Return to home <span>↗</span></a>');return;}
 if(path[0]==='admin-login'){authForm('admin',true);return;}
 if(path[0]==='workspace') {
  authLayout('<p>Opening your account…</p>');
  try {const {data,error}=await client.auth.getUser();if(error||!data.user){location.hash='/signin';return;}const account=await getAccount(data.user);if(ticket!==routeTicket)return;if(account)await accountPage(account,ticket);else {const role=sessionStorage.getItem('injectyou-account-role');if(!['intern','company'].includes(role)){setupChoice();return;}setupForm(role);}}
  catch {authLayout('<h2>Unable to open your account.</h2><p>Please check your connection and try again.</p><a href="#/workspace">Try again</a>');}return;
 }
 if(path[0]==='setup' && ['intern','company'].includes(path[1])) {
  sessionStorage.setItem('injectyou-account-role',path[1]);location.hash='/workspace';return;
 }
 if(path[0]==='privacy'||path[0]==='about-preview'){authLayout('<h2>About inJectyou</h2><p>Account access is being connected. Project workflows and payments are not yet available. Please do not enter confidential project information.</p>');return;}
 location.hash='/';
}
const projects=[{field:'Design',title:'Give a greener idea a fresh identity.',description:'Shape a thoughtful brand kit for a circular-economy initiative.',fee:'450',icon:'✳',color:'#f3b198'},{field:'Data analysis',title:'Make community impact visible.',description:'Turn a sample dataset into a clear, compelling visual story.',fee:'380',icon:'⌁',color:'#c8d8f2'},{field:'Cybersecurity',title:'Make a safer digital starting point.',description:'Review a practice website and write a clear security checklist.',fee:'400',icon:'◇',color:'#dad2ee'},{field:'Management',title:'Turn a good idea into a clear plan.',description:'Map the milestones for a fictional community event.',fee:'320',icon:'▤',color:'#f1d6a2'}];
function renderCards(field='All'){const container=document.querySelector('#sample-projects');if(!container)return;const list=field==='All'?projects.slice(0,3):projects.filter(p=>p.field===field);container.innerHTML=list.map(p=>`<article class="public-project"><div class="public-project-top"><span class="field-icon" style="background:${p.color}">${p.icon}</span><small>Sample project</small></div><p class="eyebrow">${esc(p.field.toUpperCase())}</p><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="public-project-bottom"><div><small>ILLUSTRATIVE INTERN FEE</small><strong>$${p.fee}</strong></div></div></article>`).join('');}
document.addEventListener('click',async e=>{
 const signout=e.target.closest('[data-signout]');if(signout){signout.disabled=true;await client.auth.signOut();sessionStorage.removeItem('injectyou-account-role');location.hash='/';return;}
 const reviewCompany=e.target.closest('[data-review-company]'),reviewBrief=e.target.closest('[data-review-brief]');
 if(reviewCompany||reviewBrief){const button=reviewCompany||reviewBrief;button.disabled=true;const result=reviewCompany?await client.rpc('injectyou_review_company',{target_id:reviewCompany.dataset.reviewCompany,desired_status:reviewCompany.dataset.status}):await client.from('injectyou_briefs').update({status:'reviewed'}).eq('id',reviewBrief.dataset.reviewBrief);if(result.error){document.querySelector('#workspace-error').textContent='Unable to save this change. Please try again.';button.disabled=false;}else await route();return;}
 const closeOpportunity=e.target.closest('[data-close-opportunity]'),reviewApplication=e.target.closest('[data-review-application]');
 if(closeOpportunity||reviewApplication){const button=closeOpportunity||reviewApplication;button.disabled=true;const result=closeOpportunity?await client.from('injectyou_opportunities').update({status:'closed'}).eq('id',closeOpportunity.dataset.closeOpportunity):await client.from('injectyou_applications').update({status:reviewApplication.dataset.status}).eq('id',reviewApplication.dataset.reviewApplication);if(result.error){document.querySelector('#workspace-error').textContent='Unable to save this change. Please try again.';button.disabled=false;}else await route();return;}
 const field=e.target.closest('[data-field]');if(field){document.querySelectorAll('[data-field]').forEach(b=>{b.classList.toggle('active',b===field);b.setAttribute('aria-pressed',String(b===field));});renderCards(field.dataset.field);}
 const scroll=e.target.closest('[data-scroll]');if(scroll){e.preventDefault();document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});document.querySelector('.desktop-nav')?.classList.remove('open');}
 const menu=e.target.closest('[data-action="menu"]');if(menu){const open=document.querySelector('.desktop-nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');}
});
document.addEventListener('submit',async e=>{
 const form=e.target;if(!['account-access','account-setup','brief-form','opportunity-form'].includes(form.id)&&!form.classList.contains('application-form'))return;e.preventDefault();const button=form.querySelector('button[type=submit]'), errorEl=form.querySelector('#auth-error')||form.querySelector('.form-error'), values=new FormData(form);button.disabled=true;errorEl.textContent='';
 try {
  if(form.id==='account-access'){
   const role=form.dataset.role,email=String(values.get('email')).trim(),password=String(values.get('password'));sessionStorage.setItem('injectyou-account-role',role);
   const result=form.dataset.mode==='signup'?await client.auth.signUp({email,password}):await client.auth.signInWithPassword({email,password});if(result.error)throw result.error;
   if(!result.data.session){authLayout('<h2>Check your email.</h2><p>If the address can be registered, we sent a confirmation link. Once confirmed, return here and sign in to finish setting up your account.</p><a class="button button-primary" href="#/signin">Go to sign in <span>↗</span></a>');return;}
   const account=await getAccount(result.data.user);if(account&&account.role!==role){await client.auth.signOut();throw new Error('This account belongs to a different workspace. Please choose the correct account type.');}location.hash='/workspace';
  } else if(form.id==='opportunity-form') {
   const title=String(values.get('title')||'').trim(),description=String(values.get('description')||'').trim(),fee=Number(values.get('fee'));if(!title||!description||!Number.isSafeInteger(fee)||fee<0)throw new Error('Please complete the title, description and fee.');
   const result=await client.from('injectyou_opportunities').insert({title,description,field:String(values.get('field')),fee_minor:fee,deadline:values.get('deadline')||null});if(result.error)throw result.error;await route();
  } else if(form.classList.contains('application-form')) {
   const {data,error}=await client.auth.getUser();if(error||!data.user)throw new Error('Your session has expired. Please sign in again.');const message=String(values.get('message')||'').trim();if(!message)throw new Error('Please add a short message.');
   const result=await client.from('injectyou_applications').insert({intern_id:data.user.id,opportunity_id:form.dataset.opportunity,message});if(result.error)throw result.error;await route();
  } else if(form.id==='brief-form') {
   const {data,error}=await client.auth.getUser();if(error||!data.user)throw new Error('Your session has expired. Please sign in again.');
   const title=String(values.get('title')||'').trim(),description=String(values.get('description')||'').trim();if(!title||!description)throw new Error('Please complete the title and description.');
   const result=await client.from('injectyou_briefs').insert({company_id:data.user.id,title,description,field:String(values.get('field')),deadline:values.get('deadline')||null});if(result.error)throw result.error;await route();
  } else {
   const role=form.dataset.role;const {data,error}=await client.auth.getUser();if(error||!data.user)throw new Error('Your session has expired. Please sign in again.');const name=String(values.get('name')||'').trim(),contact=String(values.get('contact')||'').trim();if(!name||(role==='company'&&!contact))throw new Error('Please complete all fields.');
   const result=await client.from('injectyou_accounts').insert({id:data.user.id,role,display_name:name,contact_name:role==='company'?contact:null,status:role==='company'?'pending':'active'});if(result.error)throw result.error;await route();
  }
 } catch(err) {errorEl.textContent=err.message||'Something went wrong. Please try again.';} finally {button.disabled=false;}
});
window.addEventListener('hashchange',route);route();
