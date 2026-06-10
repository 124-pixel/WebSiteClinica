    function switchTab(tab, el) {
      document.getElementById('tab-estudios').style.display    = tab === 'estudios'    ? 'block' : 'none';
      document.getElementById('tab-condiciones').style.display = tab === 'condiciones' ? 'block' : 'none';
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
    }

    function switchFaqTab(tab, el) {
      ['acceso','procedimiento','cobertura'].forEach(t => {
        document.getElementById('faq-' + t).style.display = t === tab ? 'block' : 'none';
      });
      document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
    }

    function toggleFaq(el) {
      const item = el.parentElement;
      item.classList.toggle('open');
    }