// DOM and state.
const list=document.querySelector('#tasks'), field=document.querySelector('#new-task');
const storageKey='lab-todo-v1';
let tasks=[{id:'sample-1',text:'See Lecture',done:false},{id:'sample-2',text:'Solve assignment',done:false}],filter='all';
try{
  const saved=localStorage.getItem(storageKey);
  if(saved!==null){const parsed=JSON.parse(saved);if(Array.isArray(parsed)&&parsed.every(t=>t&&typeof t.id==='string'&&typeof t.text==='string'&&typeof t.done==='boolean'))tasks=parsed;}
}catch{document.querySelector('#status').textContent='Browser storage is unavailable. Tasks will last for this session.';}
function save(){
  try{localStorage.setItem(storageKey,JSON.stringify(tasks));}
  catch{document.querySelector('#status').textContent='Unable to save in this browser. Keep this page open to retain your tasks.';}
}
function commit(){save();render();}
function editTask(task,row){
  if(row.querySelector('input[type=text]'))return;
  const label=row.querySelector('.task'),editor=document.createElement('input');
  editor.type='text';editor.maxLength=250;editor.value=task.text;editor.setAttribute('aria-label','Edit task');label.replaceWith(editor);editor.focus();editor.select();
  let finished=false;
  function finish(cancel){if(finished)return;finished=true;const value=editor.value.trim();if(!cancel&&value)task.text=value;commit();}
  editor.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();finish(false);}if(e.key==='Escape')finish(true);});
  editor.addEventListener('blur',()=>finish(false));
}
function render(){
  list.replaceChildren();
  const visible=tasks.filter(t=>filter==='all'||(filter==='completed'?t.done:!t.done));
  for(const task of visible){
    const row=document.createElement('li');row.classList.toggle('done',task.done);
    const check=document.createElement('input');check.type='checkbox';check.checked=task.done;check.setAttribute('aria-label','Mark '+task.text+' '+(task.done?'active':'completed'));
    check.addEventListener('change',()=>{task.done=check.checked;commit();});
    const label=document.createElement('span');label.className='task';label.textContent=task.text;label.addEventListener('dblclick',()=>editTask(task,row));
    const edit=document.createElement('button');edit.className='edit';edit.textContent='Edit';edit.setAttribute('aria-label','Edit '+task.text);edit.addEventListener('click',()=>editTask(task,row));
    const remove=document.createElement('button');remove.className='delete';remove.textContent='\u{1F5D1}';remove.setAttribute('aria-label','Delete '+task.text);remove.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==task.id);commit();});
    row.append(check,label,edit,remove);list.append(row);
  }
  if(!visible.length){const empty=document.createElement('li');empty.className='empty';empty.textContent=filter==='all'?'No tasks yet. Add your first task above.':'No '+filter+' tasks.';list.append(empty);}
  const remaining=tasks.filter(t=>!t.done).length;document.querySelector('#count').textContent=remaining+' item'+(remaining===1?'':'s')+' left';
  document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===filter)));
}
// Events.
document.querySelector('#add-form').addEventListener('submit',event=>{
  event.preventDefault();const text=field.value.trim();if(!text){field.focus();return;}
  tasks.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2),text,done:false});field.value='';commit();field.focus();
});
document.querySelector('.filters').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(button){filter=button.dataset.filter;render();}});
document.querySelector('#clear-completed').addEventListener('click',()=>{tasks=tasks.filter(t=>!t.done);commit();});
document.querySelector('#clear-all').addEventListener('click',()=>{tasks=[];commit();});
render();
