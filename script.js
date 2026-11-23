(function () {
  const C = window.F2G;
  const $ = (s) => document.querySelector(s);
  const wa = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;

  // Fill dynamic info
  $('#addr').textContent = C.address;
  $('#hours').textContent = C.hours;
  $('#phoneLink').textContent = C.phoneDisplay;
  $('#yr').textContent = new Date().getFullYear();
  $('#map').src = 'https://www.google.com/maps?q=' + encodeURIComponent(C.mapsQuery) + '&output=embed';
  $('#dirBtn').href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(C.mapsQuery);
  $('#igBtn').href = $('#igFoot').href = C.instagram;
  $('#gBtn').href = C.googleProfile;
  document.querySelectorAll('[data-tel]').forEach((a) => (a.href = 'tel:+' + C.whatsapp));

  // WhatsApp links with pre-filled messages
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = wa(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  $('#phoneBook').textContent = C.phoneDisplay;
  $('#fAddr').textContent = C.address;
  $('#fHours').textContent = C.hours;
  $('#fPhone').textContent = C.phoneDisplay;
  $('#fDir').href = $('#dirBtn').href;
  $('#addrBook').textContent = C.address;

  // Mobile menu
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => { menu.classList.toggle('open', open); burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // In-page links: scroll smoothly without adding #section to the URL
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;           // e.g. tel links handled elsewhere
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', location.pathname + location.search);
    });
  });
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);

  // Nav background on scroll
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Hide gallery section if no photos are present
  const gal = $('#gallery');
  const galCheck = () => { if (gal && !gal.querySelector('.gal-grid img')) gal.remove(); };
  window.addEventListener('load', () => setTimeout(galCheck, 300));

  // Reveal on scroll
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    }), { threshold: 0.12 });
    els.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
  } else els.forEach((el) => el.classList.add('in'));

  // Booking form
  const form = $('#bookForm');
  const msg = $('#formMsg');
  const today = new Date().toISOString().split('T')[0];
  form.date.min = today;

  const sb = C.supabaseUrl && C.supabaseAnonKey && window.supabase
    ? window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey) : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const phone = d.phone.replace(/\D/g, '');
    form.name.classList.toggle('err', !d.name.trim());
    form.phone.classList.toggle('err', phone.length < 10);
    if (!d.name.trim() || phone.length < 10) {
      msg.textContent = 'Please enter your name and a valid phone number.';
      return;
    }

    const text =
`Hi F2G Fitness Studio! I'd like to book a session.

Name: ${d.name.trim()}
Phone: ${phone}
Interested in: ${d.interest}
Preferred slot: ${d.slot}
Preferred date: ${d.date || 'Flexible'}${d.message.trim() ? '\nNote: ' + d.message.trim() : ''}`;

    // Open WhatsApp immediately (must be in the click handler to avoid popup blockers)
    window.open(wa(text), '_blank', 'noopener');
    msg.textContent = 'Opening WhatsApp… just tap Send. We will confirm shortly!';

    // Save to Supabase in the background (optional)
    if (sb) {
      const { error } = await sb.from('booking_requests').insert({
        name: d.name.trim(), phone, interest: d.interest, slot: d.slot,
        preferred_date: d.date || null, message: d.message.trim() || null
      });
      if (error) console.warn('Supabase save failed:', error.message);
    }
    form.reset();
  });
})();
