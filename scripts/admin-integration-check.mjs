import { mkdtemp, mkdir, copyFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const root = await mkdtemp(join(tmpdir(), 'rysen-admin-check-'));
const base = 'http://127.0.0.1:8796';
let server;
try {
  await mkdir(join(root, 'server'));
  await writeFile(join(root, 'package.json'), JSON.stringify({type:'module'}));
  for (const file of ['index.js','seed-blogs.js','seed-case-studies.js']) await copyFile(resolve('server', file), join(root, 'server', file));
  const env = { ...process.env, PORT:'8796', HOST:'127.0.0.1', ADMIN_PASSWORD:'isolated-admin-test', NODE_ENV:'test', RECAPTCHA_SECRET_KEY:'' };
  server = spawn(process.execPath, [join(root,'server/index.js')], { env, windowsHide:true, stdio:'pipe' });
  for (let i=0;i<50;i++) { try { if ((await fetch(base+'/api/health')).ok) break; } catch {} await new Promise(r=>setTimeout(r,100)); }
  const login = await fetch(base+'/api/admin/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:env.ADMIN_PASSWORD})});
  assert.equal(login.status,200);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  async function request(path, method='GET', body, auth=true) {
    const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(auth?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
    assert.ok(response.ok,`${method} ${path}: ${response.status}`);return response.json();
  }
  assert.equal((await fetch(base+'/api/contacts')).status,401,'Private enquiries require authentication');
  const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6WQAAAAASUVORK5CYII=';
  const cat=await request('/api/categories','POST',{name:'Integration category',description:'Test'});
  const blog=await request('/api/blogs','POST',{title:'Dashboard test',slug:'dashboard-test',category:cat.name,categoryId:cat.id,excerpt:'Test summary',body:'<p>Test content</p>',featuredImage:image,status:'Draft'});
  assert.ok(!(await request('/api/blogs?status=Published','GET',undefined,false)).some(x=>x.id===blog.id),'Draft hidden');
  await request('/api/blogs/'+blog.id,'PUT',{...blog,title:'Updated article',status:'Published'});
  assert.equal((await request('/api/blogs/dashboard-test','GET',undefined,false)).title,'Updated article');
  const story=await request('/api/case-studies','POST',{title:'Test story',practiceArea:'Testing',challenge:['A','B'],solution:['C','D'],impact:['E','F'],image,imageAlt:'Test',status:'Draft'});
  assert.ok(!(await request('/api/case-studies?status=Published','GET',undefined,false)).some(x=>x.id===story.id));
  await request('/api/case-studies/'+story.id,'PUT',{...story,status:'Published',solution:['Updated solution','Second solution']});
  const live=(await request('/api/case-studies?status=Published','GET',undefined,false)).find(x=>x.id===story.id);
  assert.deepEqual(live.solution,['Updated solution','Second solution']); assert.equal(live.image,image);
  const contact=await request('/api/contacts','POST',{name:'Test enquiry',email:'dashboard@example.com',interest:'Leadership',message:'Test message',organisation:'Test company'},false);
  await request('/api/contacts/'+contact.id,'PATCH',{status:'Contacted',notes:'Follow up next week'});
  const saved=(await request('/api/contacts')).find(x=>x.id===contact.id); assert.equal(saved.notes,'Follow up next week'); assert.equal(saved.status,'Contacted');
  for(const [path,id] of [['blogs',blog.id],['case-studies',story.id],['contacts',contact.id],['categories',cat.id]]) {await request('/api/'+path+'/'+id,'DELETE');assert.ok(!(await request('/api/'+path)).some(x=>x.id===id));}
  await request('/api/admin/logout','POST');
  assert.equal((await fetch(base+'/api/contacts')).status,401);
  console.log('PASS: login, protected routes, category create, article create/edit/publish, draft visibility, image persistence, full case-study fields, enquiry follow-up, delete and logout. Isolated temporary database; existing content untouched.');
} finally {
  if(server && server.exitCode===null) {server.kill();await new Promise(r=>server.once('exit',r));}
  await rm(root,{recursive:true,force:true});
}
