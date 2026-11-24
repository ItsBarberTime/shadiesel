// ===== Email that receives form requests =====
var FORM_EMAIL = 'shahiid.ali@gmail.com';
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
      var mail = 'mailto:' + FORM_EMAIL + '?subject=' + encodeURIComponent('Service Request - ' + g('s')) + '&body=' + encodeURIComponent(body);
      msg.className = 'err';
      msg.innerHTML = "We couldn't send your request right now. <a href=\"" + mail + "\">Tap here to email it</a> or call/text <a href=\"tel:+12156452146\">" + PHONE + '</a>.';
      if(window.console) console.warn('Form error:', err && err.message);
    })
    .finally(function(){ btn.disabled = false; btn.textContent = 'Send Request'; });
  });
})();
