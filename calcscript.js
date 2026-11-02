// DOM: select the display and keypad.
const display = document.querySelector('#display');
let current = '0', previous = null, operator = null, fresh = true;
function reset(){current='0';previous=null;operator=null;fresh=true;}
function format(value){return Number.isFinite(value) ? String(Number(value.toPrecision(12))) : 'Error';}
function calculate(a,b,op){
  switch(op){case '+':return a+b;case '-':return a-b;case '*':return a*b;case '/':return b===0?NaN:a/b;}
}
// Logic: operations are evaluated sequentially, like a basic pocket calculator.
function input(key){
  if(key==='clear') reset();
  else {
    if(current==='Error') reset();
    if(/^\d+$/.test(key)){
      if(fresh){current='0';fresh=false;}
      if(current.replace(/[-.]/g,'').length+key.length<=12) current=current==='0'?String(Number(key)):current+key;
    } else if(key==='.'){
      if(fresh){current='0';fresh=false;}
      if(!current.includes('.')) current+='.';
    } else if(key==='percent') current=format(Number(current)/100);
    else if(key==='backspace'){
      if(!fresh) current=current.length>1?current.slice(0,-1):'0';
    } else if(['+','-','*','/'].includes(key)){
      if(operator!==null&&!fresh) current=format(calculate(previous,Number(current),operator));
      previous=Number(current);operator=key;fresh=true;
      if(current==='Error'){previous=null;operator=null;}
    } else if(key==='='&&operator!==null){
      current=format(calculate(previous,Number(current),operator));previous=null;operator=null;fresh=true;
    }
  }
  display.textContent=current;
}
// Events: mouse/touch and keyboard share the same logic.
document.querySelector('.keys').addEventListener('click',event=>{
  const button=event.target.closest('button');if(button) input(button.dataset.key);
});
document.addEventListener('keydown',event=>{
  const aliases={Enter:'=',Escape:'clear',Backspace:'backspace','%':'percent'};
  const key=aliases[event.key]||event.key;
  if(event.ctrlKey||event.metaKey||event.altKey)return;
  if(/^[0-9.+*/=-]$/.test(key)||Object.values(aliases).includes(key)){event.preventDefault();input(key);}
});
