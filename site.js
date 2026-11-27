// ===== Form email settings =====
// FORM_EMAIL: YOUR email (the web developer). FormSubmit sends a one-time
//             "Activate Form" email here - you click it once, the client does nothing.
// CC_EMAIL:   the client. Gets a copy of every request automatically.
var FORM_EMAIL = 'rtawam215@gmail.com';
var CC_EMAIL   = 'shahiid.ali@gmail.com';
var PHONE = '215-645-2146';
// =============================================

// Mobile menu
(function(){
  var menu = document.getElementById('mnav');
  if(!menu) return;
  function open(){ menu.classList.add('open'); document.body.classList.add('lock'); }
  function close(){ menu.classList.remove('open'); document.body.classList.remove('lock'); }
  document.querySelectorAll('[data-open-menu]').forEach(function(b){ b.addEventListener('click', open); });
  document.querySelectorAll('[data-close-menu]').forEach(function(b){ b.addEventListener('click', close); });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
})();

// Footer year
try { document.querySelectorAll('.yr').forEach(function(el){ el.textContent = new Date().getFullYear(); }); } catch(e){}

// Contact form -> email (FormSubmit)
(function(){
  var form = document.getElementById('quote');
  if(!form) return;

  // Pre-select a service if linked as contact.html?service=...
  try {
    var s = new URLSearchParams(location.search).get('service');
    if(s){ var sel = document.getElementById('s'); for(var i=0;i<sel.options.length;i++){ if(sel.options[i].text === s){ sel.selectedIndex = i; } } }
  } catch(e){}

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var g = function(id){ return document.getElementById(id).value.trim(); };
    var btn = form.querySelector('button[type=submit]');
    var msg = document.getElementById('formMsg');
    msg.className = ''; msg.innerHTML = '';
    btn.disabled = true; btn.textContent = 'Sending...';

    var data = {
      _subject: 'New Service Request - ' + g('s'),
      _template: 'table',
      _captcha: 'false',
      _cc: CC_EMAIL,
      Name: g('n'),
      Phone: g('p'),
      'Vehicle / Equipment': g('v'),
      'Service Needed': g('s'),
      Details: g('m')
    };

    fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(String(d.success) === 'true'){
        msg.className = 'ok';
        msg.textContent = "Thanks! Your request was sent. We'll get back to you shortly. Need help now? Call " + PHONE + '.';
        form.reset();
      } else {
        throw new Error(d.message || 'failed');
      }
    })
    .catch(function(err){
      // Fallback: let the customer send it from their own email app
      var body = 'Name: ' + g('n') + '\nPhone: ' + g('p') + '\nVehicle/Equipment: ' + g('v') + '\nService: ' + g('s') + '\n\n' + g('m');
      var mail = 'mailto:' + CC_EMAIL + '?subject=' + encodeURIComponent('Service Request - ' + g('s')) + '&body=' + encodeURIComponent(body);
      msg.className = 'err';
      msg.innerHTML = "We couldn't send your request right now. <a href=\"" + mail + "\">Tap here to email it</a> or call/text <a href=\"tel:+12156452146\">" + PHONE + '</a>.';
      if(window.console) console.warn('Form error:', err && err.message);
    })
    .finally(function(){ btn.disabled = false; btn.textContent = 'Send Request'; });
  });
})();

// Photo gallery lightbox (supports multiple photos per job, swipe on phones)
(function(){
  var lb = document.getElementById('lightbox');
  if(!lb) return;
  var img = lb.querySelector('img'), t = lb.querySelector('.lb-cap b'), c = lb.querySelector('.lb-cap span');
  var cnt = lb.querySelector('.lb-count'), prev = lb.querySelector('.lb-prev'), next = lb.querySelector('.lb-next');
  var list = [], idx = 0;
  function show(){
    img.src = list[idx];
    var multi = list.length > 1;
    prev.style.display = next.style.display = multi ? '' : 'none';
    cnt.textContent = multi ? (idx+1) + ' / ' + list.length : '';
  }
  function go(d){ if(list.length>1){ idx = (idx + d + list.length) % list.length; show(); } }
  function close(){ lb.classList.remove('open'); document.body.classList.remove('lock'); }
  document.querySelectorAll('.gcard').forEach(function(card){
    card.addEventListener('click', function(){
      list = card.dataset.imgs.split(','); idx = 0;
      img.alt = card.dataset.title; t.textContent = card.dataset.title; c.textContent = card.dataset.cap;
      show(); lb.classList.add('open'); document.body.classList.add('lock');
    });
  });
  prev.addEventListener('click', function(e){ e.stopPropagation(); go(-1); });
  next.addEventListener('click', function(e){ e.stopPropagation(); go(1); });
  lb.addEventListener('click', function(e){ if(e.target !== img) close(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close(); if(e.key === 'ArrowLeft') go(-1); if(e.key === 'ArrowRight') go(1);
  });
  var x0 = null;
  img.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
  img.addEventListener('touchend', function(e){
    if(x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if(Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
})();
