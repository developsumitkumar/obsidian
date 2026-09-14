/* ===========================================================
   App shell — navigation, routing, resource pages, search
   =========================================================== */

(function(){
  const el = Render.el, esc = Render.escapeHtml;

  const RESOURCE_PAGES = [
    { id:'cheatsheet', label:'Command Cheat Sheet' },
    { id:'glossary', label:'Glossary' },
    { id:'comparisons', label:'Concept Comparisons' },
    { id:'scenarios', label:'Real-World Scenarios' },
    { id:'practice-lab', label:'Practice Lab' },
    { id:'final-check', label:'Final Knowledge Check' },
    { id:'next-steps', label:'What To Learn Next' },
  ];

  const mainEl = document.getElementById('main-content');
  const sideNav = document.getElementById('side-nav');
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');

  function currentRoute(){
    const h = location.hash.replace(/^#\/?/, '');
    return h || 'home';
  }

  function navigate(id){
    location.hash = '#/' + id;
  }

  function updateProgressUI(){
    const pct = State.overallPercent(LEVELS);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = pct + '%';
  }

  function buildNav(){
    sideNav.innerHTML = '';
    const route = currentRoute();

    const groupLevels = el('div');
    groupLevels.appendChild(el('div','nav-group-label','Levels'));
    LEVELS.forEach(level => {
      const btn = el('button','nav-item' + (route===level.id?' active':''));
      const pct = State.percentForLevel(level);
      btn.type='button';
      btn.innerHTML = `<span class="num">${level.num}</span><span>${esc(level.title)}</span>${pct===100?'<span class="check">✓</span>':''}`;
      btn.addEventListener('click', () => navigate(level.id));
      groupLevels.appendChild(btn);
    });
    sideNav.appendChild(groupLevels);

    const groupRes = el('div');
    groupRes.appendChild(el('div','nav-group-label','Resources'));
    RESOURCE_PAGES.forEach(p => {
      const btn = el('button','nav-item' + (route===p.id?' active':''));
      btn.type='button';
      btn.innerHTML = `<span class="num">•</span><span>${esc(p.label)}</span>`;
      btn.addEventListener('click', () => navigate(p.id));
      groupRes.appendChild(btn);
    });
    sideNav.appendChild(groupRes);

    updateProgressUI();
  }

  /* ---------- HOME / HERO ---------- */
  function renderHome(){
    const wrap = el('div','hero');
    wrap.innerHTML = `
      <div class="hero-eyebrow">An interactive learning book</div>
      <h1>Git is not complicated once you can see what is happening.</h1>
      <p class="lede">This is a compact, hands-on simulator for Git, GitHub, branches, pull requests, and the full CI/CD pipeline — built for people with zero computer science background. You'll click, break, and fix things before you ever memorize a command.</p>
      <div class="hero-diagram diagram-frame">
        <div class="flow">
          <div class="step">YOUR CODE</div><div class="arrow">↓</div>
          <div class="step">GIT</div><div class="arrow">↓</div>
          <div class="step">GITHUB</div><div class="arrow">↓</div>
          <div class="step">PULL REQUEST</div><div class="arrow">↓</div>
          <div class="step">CI</div><div class="arrow">↓</div>
          <div class="step">STAGING</div><div class="arrow">↓</div>
          <div class="step hl">PRODUCTION</div>
        </div>
        <div class="diagram-caption">Let's understand what happens at every step.</div>
      </div>
      <div class="hero-cta">
        <button class="btn primary" data-go="level-0" type="button">Start Learning →</button>
        <button class="btn" data-go="practice-lab" type="button">Explore Git Playground</button>
      </div>
      <div class="hero-progress">Progress: <b class="hp"></b> — pick up anywhere from the sidebar. Nothing here requires an account or internet connection.</div>
      <hr class="sep">
      <h3>What this book covers</h3>
      <div class="compare-grid" style="grid-template-columns:repeat(3,1fr)">
        ${['Git fundamentals & the 3-zone model','Branches, merges & conflicts','Pull requests & code review','Team workflow habits','Environments (dev/stage/prod)','CI/CD pipelines & deployment'].map(t=>`<div class="compare-col"><p style="margin:0;font-size:13px">${esc(t)}</p></div>`).join('')}
      </div>`;
    wrap.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.go)));
    wrap.querySelector('.hp').textContent = State.overallPercent(LEVELS) + '%';
    return wrap;
  }

  /* ---------- CHEAT SHEET ---------- */
  function renderCheatsheet(){
    const wrap = el('div');
    wrap.innerHTML = `<div class="level-header"><div class="level-kicker">Reference</div><h1 class="level-title">Command Cheat Sheet</h1><p class="level-summary">Searchable, printable, one screen. Click any command's name to animate what it actually does.</p></div>
      <input class="cs-search" placeholder="Search commands… e.g. push" style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--bg-elev-1);color:var(--text);font-size:14px;margin-bottom:18px;">
      <div class="cheat-grid"></div>
      <hr class="sep">
      <h3>Daily workflow, at a glance</h3>
      <div class="diagram-frame"><div class="flow">
        <div class="step">git status</div><div class="step">git pull</div><div class="step">git switch -c feature/my-feature</div>
        <div class="step">git add .</div><div class="step">git commit -m "…"</div><div class="step">git push -u origin feature/my-feature</div>
        <div class="arrow">↓</div><div class="step">Open PR</div><div class="arrow">↓</div><div class="step">Review</div><div class="arrow">↓</div><div class="step">CI</div><div class="arrow">↓</div><div class="step hl">Merge</div>
      </div></div>
      <h3>Emergency / common commands</h3>
      <div class="diagram-frame"><div class="flow">
        <div class="step">git status</div><div class="step">git diff</div><div class="step">git log</div><div class="step">git restore</div><div class="step">git stash</div><div class="step">git revert</div>
      </div></div>`;
    const grid = wrap.querySelector('.cheat-grid');
    function renderCards(filter){
      const f = (filter||'').toLowerCase();
      grid.innerHTML = '';
      CHEATSHEET.filter(c => !f || c.cmd.toLowerCase().includes(f) || c.what.toLowerCase().includes(f)).forEach(c => {
        const card = el('div','cheat-card');
        card.innerHTML = `
          <h4 class="cs-run" style="cursor:pointer" title="Click to animate what happens">${esc(c.cmd)} ▸</h4>
          <div class="cs-anim" hidden></div>
          <div class="field"><b>What:</b> ${esc(c.what)}</div>
          <div class="field"><b>When:</b> ${esc(c.when)}</div>
          <div class="field"><b>Example:</b> <span class="mono">${esc(c.example)}</span></div>
          <div class="field"><b>Changes:</b> ${esc(c.changes)}</div>
          <div class="field"><b>Common mistake:</b> ${esc(c.mistake)}</div>
          <div class="field"><b>Related:</b> ${c.related.map(esc).join(', ')}</div>
          <div class="field"><span class="risk ${c.risk}">${c.risk.toUpperCase()} RISK</span></div>`;
        const animBox = card.querySelector('.cs-anim');
        card.querySelector('.cs-run').addEventListener('click', () => {
          animBox.hidden = !animBox.hidden;
          if(!animBox.hidden && !animBox.dataset.built){
            animBox.dataset.built = '1';
            const parts = c.cmd.split(/\s+/);
            animBox.innerHTML = `<div class="diagram-frame" style="margin:10px 0"><div class="flow" style="font-size:12px">
              ${parts.map(p=>`<div class="step">${esc(p)}</div>`).join('<div class="arrow">→</div>')}
            </div><div class="diagram-caption">${esc(c.what)}</div></div>`;
          }
        });
        grid.appendChild(card);
      });
    }
    wrap.querySelector('.cs-search').addEventListener('input', (e) => renderCards(e.target.value));
    renderCards('');
    return wrap;
  }

  /* ---------- GLOSSARY ---------- */
  function renderGlossary(){
    const wrap = el('div');
    wrap.innerHTML = `<div class="level-header"><div class="level-kicker">Reference</div><h1 class="level-title">Glossary</h1><p class="level-summary">Every term used in this book, alphabetically. Each entry includes a plain definition and an analogy.</p></div>
      <input class="gl-search" placeholder="Search terms…" style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--bg-elev-1);color:var(--text);font-size:14px;margin-bottom:14px;">
      <div class="az-bar"></div>
      <div class="glossary-grid"></div>`;
    const azBar = wrap.querySelector('.az-bar');
    const grid = wrap.querySelector('.glossary-grid');
    const letters = Array.from(new Set(GLOSSARY.map(g=>g.term[0].toUpperCase()))).sort();
    let activeLetter = null, searchTerm = '';

    function renderAz(){
      azBar.innerHTML = `<button type="button" class="${activeLetter===null?'active':''}" data-l="">All</button>` +
        letters.map(l => `<button type="button" class="${activeLetter===l?'active':''}" data-l="${l}">${l}</button>`).join('');
      azBar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { activeLetter = b.dataset.l || null; renderAz(); renderList(); }));
    }
    function renderList(){
      const sorted = [...GLOSSARY].sort((a,b)=>a.term.localeCompare(b.term));
      grid.innerHTML = sorted.filter(g => (!activeLetter || g.term[0].toUpperCase()===activeLetter) && (!searchTerm || g.term.toLowerCase().includes(searchTerm) || g.def.toLowerCase().includes(searchTerm)))
        .map(g => `<div class="gloss-item"><div class="term">${esc(g.term)}</div><div>${esc(g.def)}</div><div class="analogy">Analogy: ${esc(g.analogy)}</div><div class="related">Related: ${g.related.map(esc).join(', ')}</div></div>`).join('') || '<p class="small">No matching terms.</p>';
    }
    wrap.querySelector('.gl-search').addEventListener('input', (e) => { searchTerm = e.target.value.toLowerCase(); renderList(); });
    renderAz(); renderList();
    return wrap;
  }

  /* ---------- COMPARISONS ---------- */
  function renderComparisons(){
    const wrap = el('div');
    wrap.innerHTML = `<div class="level-header"><div class="level-kicker">Reference</div><h1 class="level-title">Concept Comparisons</h1><p class="level-summary">The pairs beginners mix up most, side by side.</p></div>`;
    COMPARISONS.forEach(c => {
      const grid = el('div','compare-grid');
      grid.innerHTML = `<div class="compare-col"><h5>${esc(c.a.title)}</h5><p style="margin:0">${esc(c.a.text)}</p></div><div class="compare-col"><h5>${esc(c.b.title)}</h5><p style="margin:0">${esc(c.b.text)}</p></div>`;
      wrap.appendChild(grid);
    });
    return wrap;
  }

  /* ---------- SCENARIOS ---------- */
  function renderScenarios(){
    const wrap = el('div');
    wrap.innerHTML = `<div class="level-header"><div class="level-kicker">Reference</div><h1 class="level-title">Real-World Scenarios</h1><p class="level-summary">Ten situations every developer eventually hits, and exactly what to do.</p></div>`;
    SCENARIOS.forEach(s => {
      const card = el('div','card');
      card.innerHTML = `<div class="card-head"><span class="dot" style="background:var(--accent)"></span>${esc(s.problem)}</div>
        <p><b>What's happening:</b> ${esc(s.happening)}</p>
        <p><b>What to do:</b> ${esc(s.do)}</p>
        <div class="cmd-block"><div class="cmd-line">${esc(s.cmd)}</div><div class="cmd-explain">${esc(s.why)}</div></div>
        <p style="margin-bottom:0"><b>Best practice:</b> ${esc(s.best)}</p>`;
      wrap.appendChild(card);
    });
    return wrap;
  }

  /* ---------- PRACTICE LAB ---------- */
  function renderPracticeLab(){
    const wrap = el('div');
    wrap.innerHTML = `<div class="level-header"><div class="level-kicker">Hands-on</div><h1 class="level-title">Practice Lab</h1><p class="level-summary">Three sandboxes: the full state simulator, the branch visualizer, and a simulated terminal that parses real Git syntax.</p></div>
      <h3>1. Working Directory → Staging → Repository</h3>
      <div class="zones-holder"></div>
      <hr class="sep">
      <h3>2. Branch visualizer</h3>
      <div class="branch-holder"></div>
      <hr class="sep">
      <h3>3. Simulated Git Terminal</h3>
      <p class="small">This does not touch your real computer or any real Git installation — it's a safe, self-contained simulation of the mental model.</p>
      <div class="term-holder"></div>`;
    requestAnimationFrame(() => {
      Widgets.mount('zonesWidget', wrap.querySelector('.zones-holder'));
      Widgets.mount('branchViz', wrap.querySelector('.branch-holder'));
      Widgets.mount('terminal', wrap.querySelector('.term-holder'));
    });
    return wrap;
  }

  /* ---------- FINAL KNOWLEDGE CHECK ---------- */
  function renderFinalCheck(){
    const wrap = el('div');
    wrap.innerHTML = `<div class="level-header"><div class="level-kicker">Assessment</div><h1 class="level-title">Final Knowledge Check</h1><p class="level-summary">${FINAL_QUIZ.length} questions covering the whole book. Answer them all to see your score and weak areas.</p></div>
      <div class="fq-list"></div>
      <div class="action-row"><button class="btn primary" data-act="submit" type="button">See my score</button></div>
      <div class="fq-result" hidden></div>`;
    const list = wrap.querySelector('.fq-list');
    const answers = new Array(FINAL_QUIZ.length).fill(null);
    FINAL_QUIZ.forEach((q, qi) => {
      const box = el('div','quiz-box');
      box.innerHTML = `<div class="quiz-q">${qi+1}. ${esc(q.q)}</div><div class="quiz-options"></div>`;
      const opts = box.querySelector('.quiz-options');
      q.options.forEach((opt, oi) => {
        const b = el('button','quiz-opt', esc(opt)); b.type='button';
        b.addEventListener('click', () => {
          answers[qi] = oi;
          Array.from(opts.children).forEach(c=>c.classList.remove('correct'));
          b.classList.add('correct');
        });
        opts.appendChild(b);
      });
      list.appendChild(box);
    });
    wrap.querySelector('[data-act="submit"]').addEventListener('click', () => {
      let score = 0; const weakTopics = {};
      FINAL_QUIZ.forEach((q, qi) => {
        const correct = answers[qi] === q.correct;
        if(correct) score++; else weakTopics[q.topic] = (weakTopics[q.topic]||0)+1;
      });
      const weakLevelIds = Object.keys(weakTopics).sort((a,b)=>weakTopics[b]-weakTopics[a]);
      State.setFinalScore(score, FINAL_QUIZ.length, weakLevelIds);
      const result = wrap.querySelector('.fq-result');
      result.hidden = false;
      const pct = Math.round(score/FINAL_QUIZ.length*100);
      const verdict = pct>=90?'Excellent. You understand the fundamentals.':pct>=70?'Solid. A little review will lock this in.':'Good start — revisit a few levels and try again.';
      result.innerHTML = `<div class="card" style="text-align:center">
          <svg class="score-ring" viewBox="0 0 140 140"><circle cx="70" cy="70" r="60" fill="none" stroke="var(--bg-elev-3)" stroke-width="12"/>
          <circle cx="70" cy="70" r="60" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${2*Math.PI*60}" stroke-dashoffset="${2*Math.PI*60*(1-score/FINAL_QUIZ.length)}" transform="rotate(-90 70 70)"/>
          <text x="70" y="78" class="score-num">${score}/${FINAL_QUIZ.length}</text></svg>
          <p style="font-size:15px">${esc(verdict)}</p>
          ${weakLevelIds.length ? `<p class="small">Needs review:</p><div class="action-row" style="justify-content:center">${weakLevelIds.map(id => { const lvl = LEVELS.find(l=>l.id===id); return lvl ? `<button class="btn sm" data-go="${lvl.id}" type="button">${esc(lvl.title)}</button>` : ''; }).join('')}</div>` : `<p class="small">No weak areas detected — great work!</p>`}
        </div>`;
      result.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.go)));
      result.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
    return wrap;
  }

  /* ---------- NEXT STEPS ---------- */
  function renderNextSteps(){
    const wrap = el('div');
    wrap.innerHTML = `<div class="level-header"><div class="level-kicker">Keep going</div><h1 class="level-title">What To Learn Next</h1><p class="level-summary">You don't need to learn all of this immediately — but here's the honest roadmap of where developers usually go after Git.</p></div>
      <div class="diagram-frame"><div class="flow">
        <div class="step hl">Git</div><div class="step">GitHub</div><div class="step">Linux basics</div><div class="step">HTTP / APIs</div><div class="step">Databases</div>
        <div class="step">Testing</div><div class="step">Docker</div><div class="step">CI/CD</div><div class="step">Cloud</div><div class="step">Infrastructure</div><div class="step">Kubernetes</div><div class="step">System Design</div>
      </div></div>
      <p>Pick whichever one shows up most in the job or project you actually want next — there's no single correct order.</p>`;
    return wrap;
  }

  /* ---------- ROUTING ---------- */
  const RESOURCE_RENDERERS = {
    cheatsheet: renderCheatsheet, glossary: renderGlossary, comparisons: renderComparisons,
    scenarios: renderScenarios, 'practice-lab': renderPracticeLab, 'final-check': renderFinalCheck,
    'next-steps': renderNextSteps,
  };

  function render(){
    const route = currentRoute();
    mainEl.innerHTML = '';
    mainEl.scrollTop = 0;
    window.scrollTo(0,0);
    let content;
    if(route === 'home'){ content = renderHome(); }
    else if(LEVELS.find(l=>l.id===route)){ content = Render.renderLevel(LEVELS.find(l=>l.id===route), navigate); }
    else if(RESOURCE_RENDERERS[route]){ content = RESOURCE_RENDERERS[route](); }
    else { content = renderHome(); }
    mainEl.appendChild(content);
    buildNav();
    closeMobileSidebar();
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('nav:refresh', buildNav);
  document.addEventListener('progress:changed', updateProgressUI);

  /* ---------- Mobile sidebar ---------- */
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  function openMobileSidebar(){ sidebar.classList.add('open'); backdrop.classList.add('show'); }
  function closeMobileSidebar(){ sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
  document.getElementById('mobile-menu-btn').addEventListener('click', openMobileSidebar);
  backdrop.addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebar-brand-btn').addEventListener('click', () => navigate('home'));

  /* ---------- Theme + Reset ---------- */
  document.getElementById('theme-toggle').addEventListener('click', Theme.toggle);
  document.getElementById('reset-progress').addEventListener('click', () => {
    if(confirm('Reset all progress? This cannot be undone.')){ State.reset(); render(); }
  });

  /* ---------- Search ---------- */
  const searchIndex = [];
  LEVELS.forEach(l => searchIndex.push({ title:`Level ${l.num} — ${l.title}`, cat:'Level', go:l.id }));
  CHEATSHEET.forEach(c => searchIndex.push({ title:c.cmd, cat:'Command', go:'cheatsheet' }));
  GLOSSARY.forEach(g => searchIndex.push({ title:g.term, cat:'Glossary', go:'glossary' }));
  RESOURCE_PAGES.forEach(p => searchIndex.push({ title:p.label, cat:'Page', go:p.id }));

  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  function openSearch(){ searchOverlay.hidden = false; searchInput.value=''; renderSearchResults(''); searchInput.focus(); }
  function closeSearch(){ searchOverlay.hidden = true; }
  function renderSearchResults(q){
    const query = q.toLowerCase().trim();
    const results = query ? searchIndex.filter(r => r.title.toLowerCase().includes(query)).slice(0,20) : searchIndex.slice(0,8);
    searchResults.innerHTML = results.map(r => `<button class="search-result" type="button" data-go="${esc(r.go)}"><div class="r-title">${esc(r.title)}</div><div class="r-cat">${esc(r.cat)}</div></button>`).join('') || '<div style="padding:16px;color:var(--text-faint);font-size:13px">No results.</div>';
    searchResults.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { navigate(b.dataset.go); closeSearch(); }));
  }
  document.getElementById('open-search').addEventListener('click', openSearch);
  const mobileSearchBtn = document.getElementById('open-search-mobile');
  if(mobileSearchBtn) mobileSearchBtn.addEventListener('click', openSearch);
  searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
  searchOverlay.addEventListener('click', (e) => { if(e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', (e) => {
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openSearch(); }
    else if(e.key === 'Escape'){ closeSearch(); }
  });

  /* ---------- Boot ---------- */
  render();
})();
