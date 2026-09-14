/* ===========================================================
   Render engine — turns data.js block structures into DOM
   =========================================================== */

const Render = (() => {

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  /* ---------- individual block renderers ---------- */

  function blockP(b){ return el('p', null, escapeHtml(b.text)); }

  function blockAnalogy(b){
    const c = el('div','card analogy');
    c.innerHTML = `<div class="card-head"><span class="dot"></span>Analogy</div><p class="mt-0" style="margin-bottom:0">${escapeHtml(b.text)}</p>`;
    return c;
  }

  function blockExample(b){
    const c = el('div','card example');
    c.innerHTML = `<div class="card-head"><span class="dot"></span>Example</div><p class="mt-0" style="margin-bottom:0">${escapeHtml(b.text)}</p>`;
    return c;
  }

  function blockMistake(b){
    const c = el('div','card mistake');
    c.innerHTML = `<div class="card-head"><span class="dot"></span>Common Mistake</div><p class="mt-0" style="margin-bottom:0">${escapeHtml(b.text)}</p>`;
    return c;
  }

  function blockPractice(b){
    const c = el('div','card practice');
    c.innerHTML = `<div class="card-head"><span class="dot"></span>Practice</div><p class="mt-0" style="margin-bottom:0">${escapeHtml(b.text)}</p>`;
    return c;
  }

  function blockBestPractice(b){
    const c = el('div','card bestpractice');
    c.innerHTML = `<div class="card-head"><span class="dot"></span>Best Practice</div><p class="mt-0" style="margin-bottom:0">${escapeHtml(b.text)}</p>`;
    return c;
  }

  function blockRemember(b){
    const c = el('div','card remember');
    const items = b.items.map(i => `<li>${escapeHtml(i)}</li>`).join('');
    c.innerHTML = `<div class="card-head"><span class="dot"></span>Remember</div><ul style="margin:0;padding-left:18px;color:var(--text)">${items}</ul>`;
    return c;
  }

  function blockCommand(b){
    const c = el('div','cmd-block');
    c.innerHTML = `
      <div class="cmd-line"><span>${escapeHtml(b.cmd)}</span><button class="cmd-copy" type="button">Copy</button></div>
      <div class="cmd-explain">${escapeHtml(b.explain)}</div>`;
    c.querySelector('.cmd-copy').addEventListener('click', (ev) => {
      navigator.clipboard && navigator.clipboard.writeText(b.cmd).catch(()=>{});
      const btn = ev.currentTarget; const orig = btn.textContent;
      btn.textContent = 'Copied'; setTimeout(()=> btn.textContent = orig, 1200);
    });
    return c;
  }

  function blockSvg(b){
    const frame = el('div','diagram-frame');
    frame.innerHTML = b.html + (b.caption ? `<div class="diagram-caption">${escapeHtml(b.caption)}</div>` : '');
    return frame;
  }

  function blockCompare(b){
    const grid = el('div','compare-grid');
    b.items.forEach(item => {
      const col = el('div','compare-col');
      col.innerHTML = `<h5>${escapeHtml(item.title)}</h5><p>${escapeHtml(item.text)}</p>${item.use ? `<p class="use">When to use: ${escapeHtml(item.use)}</p>` : ''}`;
      grid.appendChild(col);
    });
    return grid;
  }

  function blockWidget(b, ctx){
    const holder = el('div','widget-holder');
    holder.dataset.widget = b.name;
    // Mount asynchronously after insertion (widgets.js reads DOM)
    requestAnimationFrame(() => {
      if(typeof Widgets !== 'undefined' && Widgets.mount){ Widgets.mount(b.name, holder, ctx); }
    });
    return holder;
  }

  function blockQuiz(b, ctx){
    const wrap = el('div');
    b.questions.forEach((q, qi) => {
      const key = ctx.quizKey + ':' + qi;
      const box = el('div','quiz-box');
      const already = State.isQuizDone(key);
      box.innerHTML = `<div class="quiz-q">${escapeHtml(q.q)}</div><div class="quiz-options"></div><div class="quiz-feedback" hidden></div>`;
      const optsWrap = box.querySelector('.quiz-options');
      const feedback = box.querySelector('.quiz-feedback');
      q.options.forEach((opt, oi) => {
        const optBtn = el('button','quiz-opt', escapeHtml(opt));
        optBtn.type = 'button';
        optBtn.addEventListener('click', () => {
          const isCorrect = oi === q.correct;
          Array.from(optsWrap.children).forEach((child, ci) => {
            child.disabled = true;
            if(ci === q.correct) child.classList.add('correct');
            else if(ci === oi && !isCorrect) child.classList.add('wrong');
          });
          feedback.hidden = false;
          feedback.className = 'quiz-feedback ' + (isCorrect ? 'good' : 'bad');
          feedback.textContent = (isCorrect ? 'Correct. ' : 'Not quite. ') + q.explain;
          State.markQuizDone(key, isCorrect);
        });
        optsWrap.appendChild(optBtn);
      });
      wrap.appendChild(box);
    });
    return wrap;
  }

  const BLOCK_RENDERERS = {
    p: blockP, analogy: blockAnalogy, example: blockExample, mistake: blockMistake,
    practice: blockPractice, bestpractice: blockBestPractice, remember: blockRemember,
    command: blockCommand, svg: blockSvg, compare: blockCompare, widget: blockWidget, quiz: blockQuiz,
  };

  function renderBlock(b, ctx){
    const fn = BLOCK_RENDERERS[b.t];
    if(!fn) return el('div');
    return fn(b, ctx);
  }

  /* ---------- lesson & level assembly ---------- */

  function renderLesson(lesson, idx, level){
    const wrap = el('section','lesson');
    wrap.id = level.id + '-lesson-' + idx;
    const title = el('h3','lesson-title');
    title.innerHTML = `<span class="lesson-index">${String(idx+1).padStart(2,'0')}</span> ${escapeHtml(lesson.title)}`;
    wrap.appendChild(title);

    const ctx = { quizKey: level.id + ':lesson:' + idx + ':quiz' };
    lesson.blocks.forEach(b => wrap.appendChild(renderBlock(b, ctx)));

    const lessonKey = level.id + ':lesson:' + idx;
    const doneRow = el('div','action-row');
    const doneBtn = el('button','btn ' + (State.isLessonDone(lessonKey) ? 'primary' : ''));
    doneBtn.type = 'button';
    doneBtn.textContent = State.isLessonDone(lessonKey) ? '✓ Marked complete' : 'Mark this lesson complete';
    doneBtn.addEventListener('click', () => {
      State.markLessonDone(lessonKey);
      doneBtn.textContent = '✓ Marked complete';
      doneBtn.classList.add('primary');
      document.dispatchEvent(new CustomEvent('nav:refresh'));
    });
    doneRow.appendChild(doneBtn);
    wrap.appendChild(doneRow);

    return wrap;
  }

  function renderLearnedNext(level){
    const box = el('div','learned-box');
    const learnedCol = el('div','learned-col done');
    learnedCol.innerHTML = `<h5>You learned</h5><ul>${level.learned.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
    const nextCol = el('div','learned-col next');
    nextCol.innerHTML = `<h5>What to learn next</h5><ul><li>${escapeHtml(level.next)}</li></ul>`;
    box.appendChild(learnedCol); box.appendChild(nextCol);
    return box;
  }

  function renderLevel(level, navigateFn){
    const container = el('div');

    const crumb = el('div','breadcrumb');
    crumb.innerHTML = `<b>Level ${level.num}</b> · ${escapeHtml(level.title)}`;
    container.appendChild(crumb);

    const header = el('div','level-header');
    header.innerHTML = `
      <div class="level-kicker">${escapeHtml(level.kicker)}</div>
      <h1 class="level-title">Level ${level.num} — ${escapeHtml(level.title)}</h1>
      <p class="level-summary">${escapeHtml(level.summary)}</p>`;
    container.appendChild(header);

    level.lessons.forEach((lesson, idx) => container.appendChild(renderLesson(lesson, idx, level)));

    container.appendChild(renderLearnedNext(level));

    // prev/next nav
    const idx = LEVELS.findIndex(l => l.id === level.id);
    const prev = LEVELS[idx-1];
    const next = LEVELS[idx+1];
    const navRow = el('div','level-nav');
    if(prev){
      const b = el('button','btn'); b.type='button'; b.innerHTML = `← Level ${prev.num}: ${escapeHtml(prev.title)}`;
      b.addEventListener('click', () => navigateFn(prev.id));
      navRow.appendChild(b);
    } else { navRow.appendChild(el('span')); }
    if(next){
      const b = el('button','btn primary'); b.type='button'; b.innerHTML = `Level ${next.num}: ${escapeHtml(next.title)} →`;
      b.addEventListener('click', () => navigateFn(next.id));
      navRow.appendChild(b);
    } else {
      const b = el('button','btn primary'); b.type='button'; b.textContent = 'Go to Final Knowledge Check →';
      b.addEventListener('click', () => navigateFn('final-check'));
      navRow.appendChild(b);
    }
    container.appendChild(navRow);

    return container;
  }

  return { renderLevel, renderBlock, el, escapeHtml };
})();
