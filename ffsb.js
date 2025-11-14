(function(){
if(window.__ffsb) return;
window.__ffsb = 1;

const K='ffsb_v1';
const L = ()=>{ try { return JSON.parse(localStorage.getItem(K))||{} } catch { return {} } };
const S = d => localStorage.setItem(K, JSON.stringify(d));
const p = (m,d)=>{ let v = prompt(m, d||''); return v===null ? null : v.trim(); };

function dispatchEvents(el){
  try{
    ['input','change'].forEach(ev=>el.dispatchEvent(new Event(ev,{bubbles:1})));
    ['mousedown','mouseup','click'].forEach(ev=>el.dispatchEvent(new MouseEvent(ev,{bubbles:1,cancelable:1,view:window})));
  }catch(e){}
}
function set(el,v){
  try{
    if(!el) return;
    if(el.tagName && el.tagName.toLowerCase()==='select'){
      for(let i=0;i<el.options.length;i++){
        if((''+el.options[i].text||'').toLowerCase().indexOf((''+v).toLowerCase())>-1){
          el.selectedIndex = i; break;
        }
      }
    } else {
      if('value' in el) el.value = v;
    }
    dispatchEvents(el);
  }catch(e){}
}

const rletters=(min=6,max=13)=>{ let a='abcdefghijklmnopqrstuvwxyz',L=Math.floor(Math.random()*(max-min+1))+min,s=''; for(let i=0;i<L;i++) s+=a[Math.floor(Math.random()*a.length)]; return s; };
const rndDigits=n=>{ let s=''; for(let i=0;i<n;i++) s+=Math.floor(Math.random()*10); return s; };

const PROV=["Hà Nội","TP Hồ Chí Minh","Đà Nẵng","Hải Phòng","Cần Thơ","An Giang","Bà Rịa - Vũng Tàu","Bắc Giang","Bắc Kạn","Bạc Liêu","Bắc Ninh","Bến Tre","Bình Định","Bình Dương","Bình Phước","Bình Thuận","Cà Mau","Cao Bằng","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","Hà Tĩnh","Hải Dương","Hậu Giang","Hòa Bình","Hưng Yên","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hóa","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"];

function visible(e){
  try{
    return e.offsetParent !== null && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
  }catch{return false;}
}

function fillBank(silent){
  let d = L();
  if(!d.stk && !silent) return alert('Chưa lưu STK');
  let branch = PROV[Math.floor(Math.random()*PROV.length)];
  let ins = [...document.querySelectorAll('input,select')].filter(visible);
  let branchEl = null, stkEl = null;
  ins.forEach(e=>{
    let t = ((e.placeholder||'') + (e.name||'') + (e.id||'') + (e.getAttribute('ng-model')||'')).toLowerCase();
    if(!branchEl && /ví dụ.*hồ chí minh|thành phố|chi nhánh|tỉnh|city|province/i.test(t)) branchEl = e;
    if(!stkEl && /ví dụ|970|9704|số tài khoản|stk|account|sotaikhoan|sotk/i.test(t)) stkEl = e;
  });
  if(branchEl) set(branchEl, branch);
  if(stkEl && d.stk) set(stkEl, d.stk);
  if(!silent) alert('BANK done');
}

function fillMK(silent){
  let d = L();
  if(!d.wd && !silent) return alert('Chưa lưu mật khẩu rút');
  let ins = [...document.querySelectorAll('input')].filter(visible);
  let c = 0;
  ins.forEach(inp=>{
    let m = ((inp.placeholder||'') + (inp.name||'') + (inp.id||'') + ((inp.labels&&inp.labels[0])?inp.labels[0].innerText:'')).toLowerCase();
    if(/mật khẩu rút|pin|withdraw|money password|withdrawal/i.test(m) && c<2){
      set(inp, d.wd); c++;
    }
  });
  if(!silent) alert('MK done');
}

async function upformFill(){
  const removeDiacritics = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');
  const genBD = ()=>{ let n=new Date(), maxY=n.getFullYear()-22, minY=maxY-50, y=Math.floor(Math.random()*(maxY-minY+1))+minY, m=('0'+(Math.floor(Math.random()*12)+1)).slice(-2), d=('0'+(Math.floor(Math.random()*28)+1)).slice(-2); return `${y}/${m}/${d}`; };
  let d = L();
  try{
    let clip = await navigator.clipboard.readText();
    if(clip){
      try{ d = {...d, ...JSON.parse(atob(clip)) } }catch{}
    }
  }catch){}
  let username = d.username||'', pw=d.pw||'', wd=d.wd||'', name=d.name||'', phone=d.phone||'';
  if(name) name = removeDiacritics(name).toUpperCase();
  let inputs = [...document.querySelectorAll('input,textarea,select')].filter(visible);
  for(let inp of inputs){
    try{
      let meta = ((inp.placeholder||'')+' '+(inp.name||'')+' '+(inp.id||'')+' '+((inp.labels&&inp.labels[0])?inp.labels[0].innerText:'')+' '+(inp.getAttribute('aria-label')||'')).toLowerCase();
      if(/mã xác minh|otp|mã xác nhận/i.test(meta)){ try{ inp.focus(); inp.scrollIntoView({behavior:'smooth',block:'center'}) }catch{} continue }
      if(/tên tài khoản|username|user name|tên đăng nhập|tài khoản/i.test(meta)){ if(username) set(inp,username); continue; }
      if(/mật khẩu thành viên|password|mật khẩu/i.test(meta)){ if(pw) set(inp,pw); continue; }
      if(/xác nhận mật khẩu|confirm/i.test(meta)){ if(pw) set(inp,pw); continue; }
      if(/mật khẩu rút|withdraw|pin/i.test(meta)){ if(wd) set(inp,wd); continue; }
      if(/họ và tên|full.?name|fullname|viết họ tên/i.test(meta)){ if(name) set(inp,name); continue; }
      if(/số điện thoại|phone|sdt|mobile|\+84|nhập số/i.test(meta)){ let v = phone||''; if(/nhập|bắt đầu/.test(meta)) v = (v||'').replace(/^0/,''); set(inp,v); continue; }
      if(/email|địa chỉ email/i.test(meta)){ let mail = username ? (username + '@gmail.com') : (d.email||''); if(mail) set(inp, mail); continue; }
      if(/ngày sinh|birthdate|dob/i.test(meta)){ set(inp, genBD()); continue; }
    }catch(e){}
  }
  alert('UPFORM done');
}

function fillNohu(){
  let d = L();
  if(!d.username) return alert('Chưa có data');
  let inputs = [...document.querySelectorAll('input,textarea')].filter(visible);
  if(inputs[0]) set(inputs[0], d.username||'');
  if(inputs[1]) set(inputs[1], d.pw||'');
  if(inputs[2]) set(inputs[2], d.pw||'');
  if(inputs[3]) set(inputs[3], d.wd||'');
  if(inputs[4]) set(inputs[4], d.name||'');
  if(inputs[5]) inputs[5].scrollIntoView({behavior:'smooth',block:'center'});
  alert('NOHU done');
}

/* UI */
let ui = document.getElementById('_ffsb');
if(!ui){
  ui = document.createElement('div'); ui.id = '_ffsb';
  ui.style = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:2147483647;font-family:sans-serif';
  ui.innerHTML = '<div style="background:rgba(0,0,0,0.6);padding:8px;border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:92vw;color:#fff">' +
    '<button id="bi" style="padding:6px 10px;border:0;border-radius:6px;font-size:13px;font-weight:600;background:#fff;color:#000">Set</button>' +
    '<button id="bg" style="padding:6px 10px;border:0;border-radius:6px;font-size:13px;font-weight:600;background:#0b84ff;color:#fff">Auto</button>' +
    '<button id="be" style="padding:6px 10px;border:0;border-radius:6px;font-size:13px;font-weight:600;background:#444;color:#fff">Copy</button>' +
    '<button id="bmb" style="padding:6px 10px;border:0;border-radius:6px;font-size:13px;font-weight:600;background:#9c27b0;color:#fff">MK+BANK</button>' +
    '<button id="bx" style="padding:6px 10px;border:0;border-radius:50%;font-size:13px;font-weight:700;background:#0b84ff;color:#fff">—</button>' +
    '</div>';
  document.body.appendChild(ui);

  let mini = document.createElement('div'); mini.id='_ffsb_mini';
  mini.style='position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:8px 12px;background:#0b84ff;color:#fff;border-radius:50%;cursor:pointer;display:none;font-weight:700';
  mini.innerText='Menu';
  document.body.appendChild(mini);

  document.getElementById('bx').onclick = ()=>{ ui.style.display='none'; mini.style.display='flex'; };
  mini.onclick = ()=>{ ui.style.display='block'; mini.style.display='none'; };
}

document.getElementById('bi').onclick = ()=>{
  let d=L();
  let un=p('Username (tên đăng nhập):', d.username);
  if(un===null) return;
  let n=p('Họ và tên:', d.name);
  if(n===null) return;
  let ph=p('Số điện thoại:', d.phone);
  if(ph===null) return;
  let s=p('Số tài khoản:', d.stk);
  if(s===null) return;
  let pw=p('Mật khẩu đăng nhập:', d.pw);
  if(pw===null) return;
  let wd=p('Mật khẩu rút (6 số):', d.wd);
  if(wd===null || wd.length!==6) return alert('Mật khẩu rút phải 6 số');
  d = {...d, username:un, name:n, phone:ph, stk:s, pw:pw, wd:wd};
  S(d); alert('Đã lưu');
};

document.getElementById('bmb').onclick = ()=>{ fillMK(false); fillBank(false); };
document.getElementById('bg').onclick = ()=>{ upformFill(); };
document.getElementById('be').onclick = ()=>{
  let d=L();
  if(!d.username||!d.name||!d.phone||!d.stk||!d.pw||!d.wd) return alert('Chưa đủ dữ liệu');
  let s = btoa(JSON.stringify(d));
  try{ navigator.clipboard.writeText(s); alert('Đã copy base64'); }catch(e){ prompt('Copy:', s); }
};

})();
