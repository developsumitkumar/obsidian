/* ===========================================================
   Interactive widgets — Git Playground, Branch Visualizer,
   Terminal, PR Simulator, Conflict Simulator, CI/CD Simulator,
   Team Simulator, .gitignore Widget, Capstone
   =========================================================== */

const Widgets = (() => {
  function el(tag, cls, html){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  let uid = 0;
  function nextId(prefix){ return prefix + (++uid); }

  /* =========================================================
     1. Three-zone widget (Level 1)
  ========================================================= */
  function mountZones(container){
    let status = 'clean'; // clean -> modified -> staged -> committed
    let commitCount = 0;
    const FILE = 'app.js';

    const wrap = el('div');
    wrap.innerHTML = `
      <div class="git-states">
        <div class="state-col"><h4>Working Directory</h4><div class="wd"></div></div>
        <div class="state-col"><h4>Staging Area</h4><div class="sa"></div></div>
        <div class="state-col"><h4>Repository <span class="small">${''}</span></h4><div class="rp"></div></div>
      </div>
      <div class="action-row">
        <button class="btn" data-act="modify" type="button">Modify File</button>
        <button class="btn" data-act="add" type="button">git add</button>
        <button class="btn primary" data-act="commit" type="button">git commit</button>
      </div>
      <div class="explain-panel" hidden></div>`;
    container.appendChild(wrap);

    const wd = wrap.querySelector('.wd'), sa = wrap.querySelector('.sa'), rp = wrap.querySelector('.rp');
    const panel = wrap.querySelector('.explain-panel');
    const btnModify = wrap.querySelector('[data-act="modify"]');
    const btnAdd = wrap.querySelector('[data-act="add"]');
    const btnCommit = wrap.querySelector('[data-act="commit"]');

    function explain(text, cls){ panel.hidden=false; panel.className='explain-panel ' + (cls||''); panel.textContent = text; }

    function render(){
      wd.innerHTML = status === 'modified' ? `<div class="file-chip modified">● ${FILE} (modified)</div>` : `<div class="state-empty">Clean — nothing changed</div>`;
      sa.innerHTML = status === 'staged' ? `<div class="file-chip staged">◆ ${FILE} (staged)</div>` : `<div class="state-empty">Empty</div>`;
      rp.innerHTML = commitCount > 0 ? `<div class="file-chip committed">✓ Commit #${commitCount} saved</div>` : `<div class="state-empty">No commits yet</div>`;
      btnAdd.disabled = status !== 'modified';
      btnCommit.disabled = status !== 'staged';
      btnModify.textContent = commitCount > 0 && status==='clean' ? 'Modify Again' : 'Modify File';
    }

    btnModify.addEventListener('click', () => {
      status = 'modified';
      explain(`${FILE} changed in your Working Directory. Nothing is staged or saved yet — this exists only as an edit on disk.`);
      render();
    });
    btnAdd.addEventListener('click', () => {
      status = 'staged';
      explain(`git add moved ${FILE} into the Staging Area. It is now marked "include in the next commit" — still 100% local.`);
      render();
    });
    btnCommit.addEventListener('click', () => {
      commitCount++; status = 'clean';
      explain(`git commit saved a permanent snapshot in your local Repository history (Commit #${commitCount}). Still nothing has left your computer — that only happens with git push.`, 'good');
      render();
    });

    render();
  }

  /* =========================================================
     2. Clone → Edit → Commit → Push widget (Level 2)
  ========================================================= */
  function mountCloneEditPush(container){
    const steps = ['clone','edit','commit','push'];
    let stepIdx = -1; // -1 = not cloned yet
    let localCommits = 0, remoteCommits = 0;

    const wrap = el('div');
    wrap.innerHTML = `
      <div class="two-col">
        <div class="state-col" style="min-height:120px"><h4>Local Computer</h4><div class="local-box"></div></div>
        <div class="state-col" style="min-height:120px"><h4>GitHub (Remote)</h4><div class="remote-box"></div></div>
      </div>
      <div class="action-row">
        <button class="btn" data-s="clone" type="button">Clone</button>
        <button class="btn" data-s="edit" type="button">Edit</button>
        <button class="btn" data-s="commit" type="button">Commit</button>
        <button class="btn primary" data-s="push" type="button">Push</button>
      </div>
      <div class="explain-panel" hidden></div>`;
    container.appendChild(wrap);
    const localBox = wrap.querySelector('.local-box'), remoteBox = wrap.querySelector('.remote-box');
    const panel = wrap.querySelector('.explain-panel');
    function explain(t,c){ panel.hidden=false; panel.className='explain-panel '+(c||''); panel.textContent=t; }

    function render(){
      remoteBox.innerHTML = `<div class="file-chip committed">project.git — ${remoteCommits} commit(s)</div>`;
      if(stepIdx < 0){ localBox.innerHTML = `<div class="state-empty">Not cloned yet</div>`; }
      else {
        let html = `<div class="file-chip committed">project/ — ${localCommits} local commit(s)</div>`;
        if(stepIdx >= 1) html += `<div class="file-chip modified">index.html (edited)</div>`;
        localBox.innerHTML = html;
      }
      steps.forEach((s,i) => { wrap.querySelector(`[data-s="${s}"]`).disabled = i !== stepIdx+1; });
    }

    wrap.querySelector('[data-s="clone"]').addEventListener('click', () => {
      stepIdx = 0; remoteCommits = 1; localCommits = 1;
      explain('git clone copied the full remote repository — files and history — onto your computer.'); render();
    });
    wrap.querySelector('[data-s="edit"]').addEventListener('click', () => {
      stepIdx = 1;
      explain('You edited index.html locally. This only exists in your Working Directory so far.'); render();
    });
    wrap.querySelector('[data-s="commit"]').addEventListener('click', () => {
      stepIdx = 2; localCommits++;
      explain('git add + git commit saved your edit as a new local commit. GitHub does not know about it yet — notice the remote count hasn\'t changed.'); render();
    });
    wrap.querySelector('[data-s="push"]').addEventListener('click', () => {
      stepIdx = 3; remoteCommits = localCommits; stepIdx = -1;
      explain('git push uploaded your new local commit to GitHub. Local and remote are back in sync.', 'good');
      // reset step cycle so learner can redo edit->commit->push
      stepIdx = 0; render();
    });
    render();
  }

  /* =========================================================
     3. Branch Visualizer (Level 3) — the flagship widget
  ========================================================= */
  function mountBranchViz(container){
    const COLORS = ['#6ea8ff','#4bd08b','#ffb454','#b98bf0','#ff8fa3','#5fd4d4'];
    let branches = { main: { commits:[{id:'c1',msg:'Initial commit'}], color:'#e7e9ee', from:null, fromIndex:0, merged:false } };
    let order = ['main'];
    let current = 'main';
    let commitCounter = 1;
    let colorIdx = 0;

    const wrap = el('div');
    wrap.innerHTML = `
      <div class="branch-graph-wrap"><svg class="bgraph" width="100%" height="260" viewBox="0 0 900 260" preserveAspectRatio="xMinYMid meet"></svg></div>
      <div class="branch-legend"></div>
      <div class="action-row">
        <span class="badge">Current branch: <b class="cur-branch">main</b></span>
      </div>
      <div class="action-row">
        <input class="branch-name-input mono" placeholder="new branch name e.g. feature/login" style="flex:1;min-width:200px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elev-2);color:var(--text);font-family:var(--mono);font-size:12.5px;">
        <button class="btn" data-act="create" type="button">Create branch</button>
      </div>
      <div class="action-row">
        <select class="switch-select" style="padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elev-2);color:var(--text);font-size:12.5px;"></select>
        <button class="btn" data-act="switch" type="button">git switch</button>
        <button class="btn" data-act="commit" type="button">Make commit</button>
      </div>
      <div class="action-row">
        <select class="merge-select" style="padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elev-2);color:var(--text);font-size:12.5px;"></select>
        <button class="btn primary" data-act="merge" type="button">git merge into current</button>
        <button class="btn danger" data-act="delete" type="button">git branch -d</button>
      </div>
      <div class="explain-panel" hidden></div>`;
    container.appendChild(wrap);

    const svg = wrap.querySelector('.bgraph');
    const legend = wrap.querySelector('.branch-legend');
    const curLabel = wrap.querySelector('.cur-branch');
    const switchSel = wrap.querySelector('.switch-select');
    const mergeSel = wrap.querySelector('.merge-select');
    const nameInput = wrap.querySelector('.branch-name-input');
    const panel = wrap.querySelector('.explain-panel');
    function explain(t,c){ panel.hidden=false; panel.className='explain-panel '+(c||''); panel.textContent=t; }

    function svgns(tag){ return document.createElementNS('http://www.w3.org/2000/svg', tag); }

    function render(){
      // rebuild svg
      svg.innerHTML = '';
      const rowH = 56, xStep = 62, xStart = 60;
      const rows = {}; order.forEach((name,i) => rows[name] = i);
      svg.setAttribute('height', Math.max(140, order.length * rowH + 40));
      svg.setAttribute('viewBox', `0 0 900 ${Math.max(140, order.length * rowH + 40)}`);

      // draw branch-from connector lines first (behind)
      order.forEach(name => {
        const b = branches[name];
        if(b.from){
          const parentRow = rows[b.from];
          const childRow = rows[name];
          const x = xStart + b.fromIndex * xStep;
          const y1 = 30 + parentRow*rowH, y2 = 30 + childRow*rowH;
          const line = svgns('path');
          line.setAttribute('d', `M ${x} ${y1} C ${x+30} ${y1}, ${x+30} ${y2}, ${x+40} ${y2}`);
          line.setAttribute('stroke', b.color); line.setAttribute('stroke-width','2'); line.setAttribute('fill','none'); line.setAttribute('opacity','0.6');
          svg.appendChild(line);
        }
        if(b.merged && b.mergedInto){
          const targetRow = rows[b.mergedInto];
          const childRow = rows[name];
          const x1 = xStart + (b.commits.length-1)*xStep + (b.fromIndex*0);
          const lastX = xStart + b.fromIndex*xStep + (b.commits.length)*xStep;
          const targetX = xStart + b.mergedAtIndex*xStep;
          const y1 = 30+childRow*rowH, y2 = 30+targetRow*rowH;
          const line = svgns('path');
          line.setAttribute('d', `M ${lastX-xStep} ${y1} C ${lastX} ${y1}, ${lastX} ${y2}, ${targetX} ${y2}`);
          line.setAttribute('stroke', b.color); line.setAttribute('stroke-width','2'); line.setAttribute('stroke-dasharray','4 3'); line.setAttribute('fill','none');
          svg.appendChild(line);
        }
      });

      // draw branch lines + commits
      order.forEach(name => {
        const b = branches[name];
        const row = rows[name];
        const y = 30 + row*rowH;
        const startX = xStart + b.fromIndex*xStep;
        const label = svgns('text');
        label.setAttribute('x','8'); label.setAttribute('y', y+4); label.setAttribute('font-size','11'); label.setAttribute('font-family','var(--mono)');
        label.setAttribute('fill', name===current ? 'var(--text)' : 'var(--text-faint)');
        label.textContent = name + (name===current ? ' ●' : '');
        svg.appendChild(label);

        // line across this branch's own commits
        if(b.commits.length > 1){
          const lineEl = svgns('line');
          lineEl.setAttribute('x1', startX); lineEl.setAttribute('y1', y);
          lineEl.setAttribute('x2', startX + (b.commits.length-1)*xStep); lineEl.setAttribute('y2', y);
          lineEl.setAttribute('stroke', b.color); lineEl.setAttribute('stroke-width','2.5');
          svg.appendChild(lineEl);
        }
        b.commits.forEach((c, ci) => {
          const cx = startX + ci*xStep;
          const circle = svgns('circle');
          circle.setAttribute('cx', cx); circle.setAttribute('cy', y); circle.setAttribute('r','7');
          circle.setAttribute('fill', b.color); circle.setAttribute('stroke','var(--bg)'); circle.setAttribute('stroke-width','2');
          svg.appendChild(circle);
          const t = svgns('title'); t.textContent = c.msg; circle.appendChild(t);
        });
      });

      // legend
      legend.innerHTML = order.map(name => `<span><span class="legend-dot" style="background:${branches[name].color}"></span>${esc(name)}${branches[name].merged?' (merged)':''}</span>`).join('');
      curLabel.textContent = current;

      // selects
      switchSel.innerHTML = order.filter(n => n!==current).map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('') || '<option disabled>No other branch</option>';
      mergeSel.innerHTML = order.filter(n => n!==current && !branches[n].merged).map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('') || '<option disabled>Nothing to merge</option>';
    }

    wrap.querySelector('[data-act="create"]').addEventListener('click', () => {
      let name = nameInput.value.trim();
      if(!name){ explain('Type a branch name first, e.g. feature/login.', 'warn'); return; }
      if(branches[name]){ explain('That branch name already exists.', 'warn'); return; }
      const parent = branches[current];
      const color = COLORS[colorIdx++ % COLORS.length];
      branches[name] = { commits:[], color, from: current, fromIndex: parent.commits.length-1, merged:false };
      order.push(name);
      nameInput.value = '';
      explain(`git branch ${name} created a new lightweight pointer starting from ${current}'s latest commit. You're still on ${current} — switch to start committing on it.`, 'good');
      render();
    });

    wrap.querySelector('[data-act="switch"]').addEventListener('click', () => {
      const val = switchSel.value;
      if(!val) return;
      current = val;
      explain(`git switch ${val} moved your working directory to the ${val} branch.`);
      render();
    });

    wrap.querySelector('[data-act="commit"]').addEventListener('click', () => {
      commitCounter++;
      branches[current].commits.push({ id:'c'+commitCounter, msg:'Commit #' + commitCounter });
      explain(`New commit added to ${current}. Other branches are completely unaffected.`);
      render();
    });

    wrap.querySelector('[data-act="merge"]').addEventListener('click', () => {
      const val = mergeSel.value;
      if(!val){ explain('Choose a branch to merge first.', 'warn'); return; }
      const b = branches[val];
      const targetRow = order.indexOf(current);
      b.merged = true; b.mergedInto = current; b.mergedAtIndex = branches[current].commits.length-1;
      commitCounter++;
      branches[current].commits.push({ id:'m'+commitCounter, msg:'Merge ' + val + ' into ' + current });
      explain(`git merge ${val} brought its commits into ${current}. A merge commit was added to ${current} to join both histories. ${val} still exists — delete it once you're done.`, 'good');
      render();
    });

    wrap.querySelector('[data-act="delete"]').addEventListener('click', () => {
      const val = mergeSel.value || Object.keys(branches).find(n => branches[n].merged && n!==current);
      const target = order.find(n => branches[n].merged && n !== current);
      if(!target){ explain('Merge a branch first — it\'s best practice to delete branches only after merging.', 'warn'); return; }
      order = order.filter(n => n !== target);
      delete branches[target];
      explain(`git branch -d ${target} removed the branch pointer. Its commits are safe — they live on in the branch it was merged into.`, 'good');
      render();
    });

    render();
  }

  /* =========================================================
     4. Pipeline widget: status/add/commit/push/fetch/pull (Level 4)
  ========================================================= */
  function mountPipeline(container){
    let fileState = 'modified'; // modified -> staged -> committed(local ahead)
    let localAhead = 0, remoteHasExtra = false;
    const wrap = el('div');
    wrap.innerHTML = `
      <div class="git-states">
        <div class="state-col"><h4>Working Dir</h4><div class="c1"></div></div>
        <div class="state-col"><h4>Staging</h4><div class="c2"></div></div>
        <div class="state-col"><h4>Local History</h4><div class="c3"></div></div>
      </div>
      <div class="action-row">
        <button class="btn" data-c="status" type="button">git status</button>
        <button class="btn" data-c="add" type="button">git add</button>
        <button class="btn" data-c="commit" type="button">git commit</button>
        <button class="btn primary" data-c="push" type="button">git push</button>
      </div>
      <div class="action-row">
        <button class="btn" data-c="fetch" type="button">git fetch</button>
        <button class="btn" data-c="pull" type="button">git pull</button>
        <span class="badge">GitHub: <span class="gh-state">in sync</span></span>
      </div>
      <div class="explain-panel" hidden></div>`;
    container.appendChild(wrap);
    const c1=wrap.querySelector('.c1'), c2=wrap.querySelector('.c2'), c3=wrap.querySelector('.c3');
    const panel = wrap.querySelector('.explain-panel');
    const ghState = wrap.querySelector('.gh-state');
    function explain(t,c){ panel.hidden=false; panel.className='explain-panel '+(c||''); panel.textContent=t; }

    function render(){
      c1.innerHTML = fileState==='modified' ? `<div class="file-chip modified">app.js (modified)</div>` : `<div class="state-empty">Clean</div>`;
      c2.innerHTML = fileState==='staged' ? `<div class="file-chip staged">app.js (staged)</div>` : `<div class="state-empty">Empty</div>`;
      c3.innerHTML = fileState==='committed' ? `<div class="file-chip committed">${localAhead} commit(s) ahead of GitHub</div>` : `<div class="state-empty">Nothing new locally</div>`;
      ghState.textContent = remoteHasExtra ? 'has new commits you don\'t have' : (localAhead>0 ? 'behind your local history' : 'in sync');
    }

    wrap.querySelector('[data-c="status"]').addEventListener('click', () => explain('git status is read-only — it just reports the state you see above. It changed nothing.'));
    wrap.querySelector('[data-c="add"]').addEventListener('click', () => {
      if(fileState!=='modified'){ explain('Nothing modified to add right now.', 'warn'); return; }
      fileState='staged'; explain('Moved into the Staging Area. Still entirely local.'); render();
    });
    wrap.querySelector('[data-c="commit"]').addEventListener('click', () => {
      if(fileState!=='staged'){ explain('Stage something with git add first.', 'warn'); return; }
      fileState='committed'; localAhead++; explain('Saved to local history. GitHub still does not have this commit yet.'); render();
    });
    wrap.querySelector('[data-c="push"]').addEventListener('click', () => {
      if(localAhead===0){ explain('Nothing local to push yet.', 'warn'); return; }
      localAhead=0; fileState='clean'; explain('git push uploaded your local commits to GitHub. Local and remote are now in sync.', 'good'); render();
    });
    wrap.querySelector('[data-c="fetch"]').addEventListener('click', () => {
      remoteHasExtra = true;
      explain('git fetch downloaded information about GitHub\'s branches. Notice: your files on disk did NOT change.'); render();
    });
    wrap.querySelector('[data-c="pull"]').addEventListener('click', () => {
      remoteHasExtra = false;
      explain('git pull fetched AND merged those remote changes into your files immediately.', 'good'); render();
    });
    render();
  }

  /* =========================================================
     5. Pull Request Simulator (Level 5)
  ========================================================= */
  function mountPRSim(container){
    let status = 'open'; // open -> changes -> open(updated) -> approved -> merged
    let approved = false;
    const comments = [];
    const wrap = el('div');
    wrap.innerHTML = `
      <div class="pr-shell">
        <div class="pr-header">
          <div class="title">Add email validation to login API <span class="status-pill open pill">Open</span></div>
          <div class="meta">dev-ada wants to merge <b>feature/login</b> into <b>main</b> · 1 commit</div>
        </div>
        <div class="pr-tabs">
          <button class="pr-tab active" data-tab="diff" type="button">Files changed</button>
          <button class="pr-tab" data-tab="review" type="button">Conversation</button>
        </div>
        <div class="pr-body">
          <div class="pane-diff">
            <div class="diff-line ctx">  function validateLogin(email, password) {</div>
            <div class="diff-line del">-   return password.length > 0;</div>
            <div class="diff-line add">+   const validEmail = /\\S+@\\S+\\.\\S+/.test(email);</div>
            <div class="diff-line add">+   return validEmail && password.length > 0;</div>
            <div class="diff-line ctx">  }</div>
          </div>
          <div class="pane-review" hidden></div>
          <div class="action-row" style="margin-top:16px">
            <button class="btn" data-act="request" type="button">Request changes</button>
            <button class="btn" data-act="approve" type="button">Approve</button>
            <button class="btn" data-act="push" type="button" hidden>Push update</button>
            <button class="btn primary" data-act="merge" type="button" disabled>Merge Pull Request</button>
          </div>
        </div>
      </div>
      <div class="explain-panel" hidden></div>`;
    container.appendChild(wrap);
    const pill = wrap.querySelector('.pill');
    const reviewPane = wrap.querySelector('.pane-review');
    const diffPane = wrap.querySelector('.pane-diff');
    const panel = wrap.querySelector('.explain-panel');
    const btnApprove = wrap.querySelector('[data-act="approve"]');
    const btnRequest = wrap.querySelector('[data-act="request"]');
    const btnPush = wrap.querySelector('[data-act="push"]');
    const btnMerge = wrap.querySelector('[data-act="merge"]');
    function explain(t,c){ panel.hidden=false; panel.className='explain-panel '+(c||''); panel.textContent=t; }

    wrap.querySelectorAll('.pr-tab').forEach(tab => tab.addEventListener('click', () => {
      wrap.querySelectorAll('.pr-tab').forEach(x=>x.classList.remove('active'));
      tab.classList.add('active');
      const isDiff = tab.dataset.tab === 'diff';
      diffPane.hidden = !isDiff; reviewPane.hidden = isDiff;
    }));

    function renderComments(){
      reviewPane.innerHTML = comments.map(c => `<div class="review-comment"><div class="who">${esc(c.who)}</div>${esc(c.text)}</div>`).join('') || '<p class="small">No comments yet.</p>';
    }

    function setPill(cls,text){ pill.className = 'status-pill pill ' + cls; pill.textContent = text; }

    btnRequest.addEventListener('click', () => {
      status='changes'; setPill('changes','Changes requested');
      comments.push({who:'reviewer-sam', text:'Please also trim whitespace from the email before validating. Otherwise looks good!'});
      renderComments(); btnPush.hidden=false; btnApprove.disabled=true; btnRequest.disabled=true;
      explain('The reviewer requested changes. The PR stays open — you push new commits to the SAME branch to update it.', 'warn');
    });
    btnApprove.addEventListener('click', () => {
      approved = true; status='approved'; setPill('open','Approved');
      comments.push({who:'reviewer-sam', text:'Looks good — approved! ✅'});
      renderComments(); btnMerge.disabled=false; btnApprove.disabled=true; btnRequest.disabled=true;
      explain('Approved. The Merge button is now unlocked.', 'good');
    });
    btnPush.addEventListener('click', () => {
      comments.push({who:'dev-ada', text:'Pushed a fix — trimming whitespace before validating now.'});
      renderComments(); btnPush.hidden=true; btnApprove.disabled=false; btnRequest.disabled=false;
      explain('New commits were pushed to the same branch. The same open PR updated automatically — no new PR needed. The reviewer can approve now.');
    });
    btnMerge.addEventListener('click', () => {
      if(!approved){ explain('This PR needs an approval before it can merge.', 'warn'); return; }
      status='merged'; setPill('merged','Merged'); btnMerge.disabled=true;
      explain('Merged into main! The feature branch\'s commits are now part of main\'s history.', 'good');
    });
    renderComments();
  }

  /* =========================================================
     6. Merge Conflict Simulator (Level 6)
  ========================================================= */
  function mountConflictSim(container){
    let resolved = null; // null | 'main' | 'feature' | 'both'
    let staged = false, committed = false;
    const wrap = el('div');
    wrap.innerHTML = `
      <div class="conflict-file"></div>
      <div class="conflict-choice">
        <button class="btn" data-c="main" type="button">Keep main's version (blue)</button>
        <button class="btn" data-c="feature" type="button">Keep feature's version (green)</button>
        <button class="btn" data-c="both" type="button">Keep both</button>
      </div>
      <div class="action-row">
        <button class="btn" data-act="add" type="button" disabled>git add login.js</button>
        <button class="btn primary" data-act="commit" type="button" disabled>git commit</button>
      </div>
      <div class="explain-panel" hidden></div>`;
    container.appendChild(wrap);
    const fileBox = wrap.querySelector('.conflict-file');
    const panel = wrap.querySelector('.explain-panel');
    const addBtn = wrap.querySelector('[data-act="add"]');
    const commitBtn = wrap.querySelector('[data-act="commit"]');
    function explain(t,c){ panel.hidden=false; panel.className='explain-panel '+(c||''); panel.textContent=t; }

    function renderFile(){
      if(!resolved){
        fileBox.innerHTML =
`function getButtonColor() {
<span class="marker">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (main)</span>
<span class="ours">  return "blue";</span>
<span class="marker">=======</span>
<span class="theirs">  return "green";</span>
<span class="marker">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/button</span>
}`;
      } else {
        const line = resolved==='main' ? '  return "blue";' : resolved==='feature' ? '  return "green";' : '  return isPromo ? "green" : "blue";';
        fileBox.innerHTML = `function getButtonColor() {\n${line}\n}`;
      }
    }
    wrap.querySelectorAll('.conflict-choice .btn').forEach(b => b.addEventListener('click', () => {
      resolved = b.dataset.c;
      renderFile();
      addBtn.disabled = false;
      explain('Conflict markers removed and the final code decided. Now stage and commit to finish the merge.');
    }));
    addBtn.addEventListener('click', () => {
      staged = true; commitBtn.disabled = false; addBtn.disabled = true;
      explain('git add tells Git this file\'s conflict is resolved.');
    });
    commitBtn.addEventListener('click', () => {
      committed = true; commitBtn.disabled = true;
      explain('git commit finishes the merge, creating a merge commit that joins both branches\' histories.', 'good');
    });
    renderFile();
  }

  /* =========================================================
     7. Team Workflow Simulator (Level 7)
  ========================================================= */
  function mountTeamSim(container){
    const STAGES = ['Coding','PR opened','CI running','CI passed','Review approved','Merged to main'];
    const devs = [
      { name:'Dev A — feature/login', stage:0 },
      { name:'Dev B — feature/payment', stage:0 },
      { name:'Dev C — bugfix/cart', stage:0 },
    ];
    const wrap = el('div');
    wrap.innerHTML = `<div class="team-rows"></div><div class="explain-panel" hidden></div>`;
    container.appendChild(wrap);
    const rows = wrap.querySelector('.team-rows');
    const panel = wrap.querySelector('.explain-panel');
    function explain(t){ panel.hidden=false; panel.className='explain-panel'; panel.textContent=t; }

    function render(){
      rows.innerHTML = '';
      devs.forEach((d, i) => {
        const row = el('div','card');
        row.style.marginBottom = '10px';
        row.innerHTML = `<div class="card-head"><span class="dot" style="background:var(--accent)"></span>${esc(d.name)}</div>
          <div class="small" style="margin-bottom:10px">Stage: <b style="color:var(--text)">${esc(STAGES[d.stage])}</b></div>
          <div class="action-row" style="margin:0"><button class="btn sm" data-i="${i}" type="button" ${d.stage>=STAGES.length-1?'disabled':''}>Advance →</button></div>`;
        rows.appendChild(row);
      });
      rows.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.i;
        devs[i].stage = Math.min(devs[i].stage+1, STAGES.length-1);
        explain(`${devs[i].name} moved to "${STAGES[devs[i].stage]}". Each branch goes through the exact same gate — review and CI — before touching main.`);
        render();
      }));
    }
    render();
  }

  /* =========================================================
     8. .gitignore widget (Level 11)
  ========================================================= */
  function mountGitignore(container){
    const files = ['index.js','package.json','node_modules/','.env','dist/','app.log','README.md'];
    const wrap = el('div');
    wrap.innerHTML = `
      <div class="two-col">
        <div>
          <div class="small" style="margin-bottom:6px">.gitignore contents (editable)</div>
          <textarea class="gi-input mono" style="width:100%;min-height:110px;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-elev-2);color:var(--text);font-family:var(--mono);font-size:12.5px;">node_modules/
.env
dist/
*.log</textarea>
        </div>
        <div>
          <div class="small" style="margin-bottom:6px">Project files</div>
          <div class="gi-files"></div>
        </div>
      </div>`;
    container.appendChild(wrap);
    const input = wrap.querySelector('.gi-input');
    const filesBox = wrap.querySelector('.gi-files');

    function matches(pattern, file){
      pattern = pattern.trim();
      if(!pattern) return false;
      if(pattern.endsWith('/')) return file.endsWith('/') && file === pattern;
      if(pattern.startsWith('*.')){ const ext = pattern.slice(1); return file.endsWith(ext); }
      return file === pattern;
    }
    function render(){
      const patterns = input.value.split('\n').map(l=>l.trim()).filter(Boolean);
      filesBox.innerHTML = files.map(f => {
        const ignored = patterns.some(p => matches(p,f));
        return `<div class="file-chip ${ignored?'':'committed'}" style="${ignored?'opacity:.6;border-style:dashed;':''}">${ignored?'⊘':'✓'} ${esc(f)} ${ignored?'<span class="small">(ignored)</span>':'<span class="small">(tracked)</span>'}</div>`;
      }).join('');
    }
    input.addEventListener('input', render);
    render();
  }

  /* =========================================================
     9. CI/CD Pipeline Simulator (Level 9)
  ========================================================= */
  function mountCicd(container){
    const stages = [
      { name:'Checkout', icon:'📥', cmd:'actions/checkout@v4', why:'Downloads your repository\'s code onto the runner so later steps have something to work with.' },
      { name:'Install', icon:'📦', cmd:'npm install', why:'Downloads the project\'s dependencies so the code can actually run.' },
      { name:'Lint', icon:'🔍', cmd:'npm run lint', why:'Checks code style and catches obvious mistakes before anything runs.' },
      { name:'Unit Tests', icon:'🧪', cmd:'npm test', why:'Runs automated tests. If any test fails, the pipeline stops here — broken code should not go further.', canFail:true },
      { name:'Build', icon:'🏗️', cmd:'npm run build', why:'Compiles/bundles the source code into a deployable artifact.' },
      { name:'Security', icon:'🛡️', cmd:'npm audit', why:'Scans dependencies for known vulnerabilities.' },
      { name:'Deploy Staging', icon:'🚀', cmd:'deploy --env staging', why:'Publishes the build to the staging environment for final verification.' },
      { name:'Smoke Tests', icon:'🔥', cmd:'curl staging health-check', why:'Quickly verifies the staging deployment actually starts and responds.' },
      { name:'Deploy Prod', icon:'🌍', cmd:'deploy --env production', why:'Publishes the verified build to production, where real users will see it.' },
    ];
    let statuses = stages.map(()=> 'pending');
    let failAt = -1; // index to simulate failure, -1 = none
    let running = false;

    const wrap = el('div');
    wrap.innerHTML = `
      <div class="pipeline"></div>
      <div class="pipe-detail small">Click a stage to see details, or run the whole pipeline.</div>
      <div class="action-row">
        <button class="btn primary" data-act="run" type="button">▶ Run pipeline</button>
        <button class="btn" data-act="reset" type="button">Reset</button>
        <label class="small" style="display:flex;align-items:center;gap:6px;"><input type="checkbox" class="fail-toggle"> Simulate a failing test</label>
      </div>`;
    container.appendChild(wrap);
    const pipeline = wrap.querySelector('.pipeline');
    const detail = wrap.querySelector('.pipe-detail');
    const failToggle = wrap.querySelector('.fail-toggle');

    function renderStages(){
      pipeline.innerHTML = stages.map((s,i) => `<div class="pipe-stage ${statuses[i]}" data-i="${i}"><span class="icon">${s.icon}</span>${esc(s.name)}</div>`).join('');
      pipeline.querySelectorAll('.pipe-stage').forEach(elx => elx.addEventListener('click', () => showDetail(+elx.dataset.i)));
    }
    function showDetail(i){
      const s = stages[i];
      detail.innerHTML = `<b>${esc(s.name)}</b><div class="cmd-block" style="margin:8px 0"><div class="cmd-line">${esc(s.cmd)}</div></div><p style="margin:0">${esc(s.why)}</p>${s.canFail?'<p class="small" style="margin-top:6px">If this fails, every stage after it is blocked.</p>':''}`;
    }
    function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

    async function run(){
      if(running) return;
      running = true;
      statuses = stages.map(()=> 'pending');
      renderStages();
      const failIndex = failToggle.checked ? 3 : -1;
      for(let i=0;i<stages.length;i++){
        statuses[i]='running'; renderStages(); showDetail(i);
        await sleep(420);
        if(i === failIndex){
          statuses[i]='fail'; renderStages();
          for(let j=i+1;j<stages.length;j++) statuses[j]='blocked';
          renderStages();
          detail.innerHTML = `<b style="color:var(--red)">${esc(stages[i].name)} failed.</b><p style="margin-top:6px">Every later stage is blocked — a pipeline stops as soon as a required step fails, so broken code never reaches staging or production.</p>`;
          running = false; return;
        }
        statuses[i]='pass'; renderStages();
      }
      detail.innerHTML = `<b style="color:var(--green)">Pipeline passed end to end.</b><p style="margin-top:6px">The change is now verified and live in production.</p>`;
      running = false;
    }
    wrap.querySelector('[data-act="run"]').addEventListener('click', run);
    wrap.querySelector('[data-act="reset"]').addEventListener('click', () => { statuses = stages.map(()=>'pending'); renderStages(); detail.textContent='Click a stage to see details, or run the whole pipeline.'; });
    renderStages();
  }

  /* =========================================================
     10. Capstone (Level 12)
  ========================================================= */
  function mountCapstone(container){
    const steps = [
      { info:'Task assigned: "Add email validation to the login API." You start on main.' },
      { q:'What should you do first?', options:['Start editing files immediately on main','Pull the latest main, then create a new branch','Delete main and start fresh','Open a Pull Request with no code yet'], correct:1,
        explain:'Always start from an up-to-date main, then branch off it — this keeps your work isolated and current.' },
      { info:'You run: git pull origin main, then git switch -c feature/login-email-validation.' },
      { q:'You\'ve written the code and tested it locally. It works. What next?', options:['git commit directly, skip staging','git status, then git add, then git commit with a clear message','Push straight to main','Delete the branch'], correct:1,
        explain:'Check what changed with git status, stage it with git add, and commit with a message describing the change — the standard local pipeline.' },
      { info:'Committed: "Add email validation to login API". Now: git push -u origin feature/login-email-validation.' },
      { q:'What should you do on GitHub now?', options:['Nothing, you\'re done','Open a Pull Request into main','Delete the repository','Merge directly without review'], correct:1,
        explain:'A Pull Request proposes your branch for review and lets CI run automated checks before anything touches main.' },
      { info:'CI runs automatically: checkout → install → tests. A reviewer looks at your diff.' },
      { q:'The reviewer requests a small change. What do you do?', options:['Close the PR and give up','Make the fix, commit, and push again to the same branch','Open a brand-new PR','Argue and merge anyway'], correct:1,
        explain:'Pushing more commits to the same branch updates the same PR automatically — no need for a new one.' },
      { info:'You push the fix. CI runs again and passes. The reviewer approves.' },
      { q:'What happens next?', options:['Merge the Pull Request into main','Delete main','Push directly bypassing review','Nothing, wait a week'], correct:0,
        explain:'With an approval and passing CI, merging into main is the correct next step.' },
      { info:'Merged! The pipeline automatically deploys to Staging and runs smoke tests.' },
      { q:'Smoke tests pass on staging. What now?', options:['Deploy straight to Production','Wait indefinitely','Roll back for no reason','Delete the feature'], correct:0,
        explain:'Once staging verification passes, the change is ready to deploy to Production — the final environment.' },
      { info:'🎉 Deployed to Production. Real users now have working email validation on login — and you just walked the entire real-world developer workflow, end to end.' },
    ];
    let i = 0;
    const wrap = el('div');
    wrap.innerHTML = `<div class="card" style="border-color:var(--accent)"><div class="card-head"><span class="dot" style="background:var(--accent)"></span>FAi Login Service — Capstone</div><div class="cap-body"></div></div>`;
    container.appendChild(wrap);
    const body = wrap.querySelector('.cap-body');

    function render(){
      const step = steps[i];
      if(!step){ body.innerHTML = ''; return; }
      if(step.info){
        body.innerHTML = `<p style="margin-bottom:14px">${esc(step.info)}</p><div class="action-row"><button class="btn primary" data-act="next" type="button">${i===steps.length-1?'Restart':'Continue →'}</button></div>`;
        body.querySelector('[data-act="next"]').addEventListener('click', () => { i = (i===steps.length-1) ? 0 : i+1; render(); });
      } else {
        body.innerHTML = `<p class="quiz-q" style="margin-bottom:12px">${esc(step.q)}</p><div class="quiz-options"></div><div class="quiz-feedback" hidden></div>`;
        const optsWrap = body.querySelector('.quiz-options');
        const fb = body.querySelector('.quiz-feedback');
        step.options.forEach((opt,oi) => {
          const b = el('button','quiz-opt', esc(opt)); b.type='button';
          b.addEventListener('click', () => {
            const ok = oi === step.correct;
            fb.hidden = false; fb.className = 'quiz-feedback ' + (ok?'good':'bad');
            fb.textContent = (ok ? 'Correct. ' : 'Not quite — think about it again. ') + step.explain;
            if(ok){
              Array.from(optsWrap.children).forEach(c=>c.disabled=true);
              b.classList.add('correct');
              const cont = el('div','action-row'); cont.style.marginTop='10px';
              const nb = el('button','btn primary','Continue →'); nb.type='button';
              nb.addEventListener('click', () => { i++; render(); });
              cont.appendChild(nb); body.appendChild(cont);
            } else {
              b.classList.add('wrong');
            }
          });
          optsWrap.appendChild(b);
        });
      }
    }
    render();
  }

  /* =========================================================
     11. Simulated Git Terminal (Practice Lab)
  ========================================================= */
  function mountTerminal(container){
    const repo = {
      branch: 'main',
      branches: ['main'],
      files: { 'index.html':'clean', 'app.js':'clean', 'styles.css':'clean' },
      staged: new Set(),
      commits: [],
    };
    const wrap = el('div');
    wrap.innerHTML = `
      <div class="action-row">
        <button class="btn sm" data-edit="index.html" type="button">Edit index.html</button>
        <button class="btn sm" data-edit="app.js" type="button">Edit app.js</button>
        <button class="btn sm" data-edit="styles.css" type="button">Edit styles.css</button>
      </div>
      <div class="terminal">
        <div class="terminal-bar"><span class="tdot" style="background:#ff5f57"></span><span class="tdot" style="background:#febc2e"></span><span class="tdot" style="background:#28c840"></span><span class="label">Simulated Git Terminal — not your real machine</span></div>
        <div class="terminal-body"></div>
        <div class="terminal-input-row"><span class="prompt">$</span><input type="text" spellcheck="false" autocomplete="off" placeholder="try: git status"></div>
      </div>
      <div class="terminal-hint">Supports: git status, git add &lt;file|.&gt;, git commit -m "msg", git log, git branch [name], git switch [-c] &lt;name&gt;, git merge &lt;name&gt;, git diff, git push, git pull, git fetch, git restore &lt;file&gt;</div>`;
    container.appendChild(wrap);
    const body = wrap.querySelector('.terminal-body');
    const input = wrap.querySelector('input');

    function print(text, cls){ const l = el('div','line ' + (cls||'out'), esc(text)); body.appendChild(l); body.scrollTop = body.scrollHeight; }
    function printPrompt(cmd){ const l = el('div','line'); l.innerHTML = `<span class="prompt">${esc(repo.branch)} $</span> ${esc(cmd)}`; body.appendChild(l); body.scrollTop = body.scrollHeight; }

    function modifiedList(){ return Object.keys(repo.files).filter(f => repo.files[f]==='modified'); }
    function stagedList(){ return Array.from(repo.staged); }

    function run(raw){
      printPrompt(raw);
      const cmd = raw.trim();
      if(!cmd){ return; }
      const parts = cmd.split(/\s+/);
      if(parts[0] !== 'git'){ print(`command not found: ${parts[0]} (this simulator only understands git commands)`, 'err'); return; }
      const sub = parts[1];
      if(sub === 'status'){
        print(`On branch ${repo.branch}`);
        if(stagedList().length){ print('Changes to be committed:'); stagedList().forEach(f => print('  modified: '+f)); }
        if(modifiedList().length){ print('Changes not staged for commit:'); modifiedList().forEach(f => print('  modified: '+f)); }
        if(!stagedList().length && !modifiedList().length) print('nothing to commit, working tree clean');
      } else if(sub === 'add'){
        const target = parts[2];
        if(!target){ print('nothing specified, nothing added.', 'err'); return; }
        const targets = target === '.' ? modifiedList() : [target];
        targets.forEach(f => { if(repo.files[f]==='modified'){ repo.staged.add(f); repo.files[f]='staged'; } });
        print(`Changes staged for commit: ${targets.join(', ')}`);
      } else if(sub === 'commit'){
        if(!stagedList().length){ print('nothing added to commit (use "git add")', 'err'); return; }
        const mIdx = parts.indexOf('-m');
        const msg = mIdx>=0 ? raw.split('-m')[1].trim().replace(/^["']|["']$/g,'') : 'No message';
        const hash = Math.random().toString(16).slice(2,9);
        repo.commits.unshift({hash, msg, branch:repo.branch});
        const files = stagedList();
        files.forEach(f => { repo.files[f]='clean'; repo.staged.delete(f); });
        print(`[${repo.branch} ${hash}] ${msg}`);
        print(`${files.length} file(s) changed`);
      } else if(sub === 'log'){
        const c = repo.commits.filter(c=>true);
        if(!c.length){ print('fatal: your current branch does not have any commits yet', 'err'); return; }
        c.forEach(commit => print(`${commit.hash}  ${commit.msg}`));
      } else if(sub === 'branch'){
        const name = parts[2];
        if(!name){ repo.branches.forEach(b => print((b===repo.branch?'* ':'  ')+b)); return; }
        if(repo.branches.includes(name)){ print(`fatal: a branch named '${name}' already exists`, 'err'); return; }
        repo.branches.push(name); print(`Branch '${name}' created.`);
      } else if(sub === 'switch'){
        let name = parts[2]; let create=false;
        if(name === '-c'){ create=true; name = parts[3]; }
        if(!name){ print('fatal: missing branch name', 'err'); return; }
        if(create){ if(repo.branches.includes(name)){ print(`fatal: a branch named '${name}' already exists`, 'err'); return; } repo.branches.push(name); }
        if(!repo.branches.includes(name)){ print(`error: pathspec '${name}' did not match any branch known to git`, 'err'); return; }
        repo.branch = name; print(`Switched to ${create?'a new branch':'branch'} '${name}'`);
      } else if(sub === 'merge'){
        const name = parts[2];
        if(!name || !repo.branches.includes(name)){ print('merge: branch not found', 'err'); return; }
        print(`Merge made by the 'ort' strategy. ${name} -> ${repo.branch}`, 'out');
      } else if(sub === 'diff'){
        if(!modifiedList().length){ print('(no unstaged changes)'); return; }
        modifiedList().forEach(f => { print(`--- a/${f}`); print(`+++ b/${f}`); print('@@ changed lines @@'); });
      } else if(sub === 'push'){
        print(repo.commits.length ? `Enumerating objects... done.\nTo github.com/you/project.git\n   ${repo.branch} -> ${repo.branch}` : 'Everything up-to-date');
      } else if(sub === 'pull'){
        print('Already up to date.');
      } else if(sub === 'fetch'){
        print('Fetching origin...\n(no new information — this is a simulated remote)');
      } else if(sub === 'remote'){
        print('origin');
      } else if(sub === 'restore'){
        const f = parts[2];
        if(!f || !(f in repo.files)){ print('error: pathspec did not match any file(s)', 'err'); return; }
        repo.files[f] = 'clean'; repo.staged.delete(f);
        print(`Restored ${f} to last committed state.`);
      } else {
        print(`git: '${sub}' is not supported in this simulator.`, 'err');
      }
    }

    wrap.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
      const f = b.dataset.edit;
      repo.files[f] = 'modified';
      print(`(you edited ${f} in your editor — it is now modified in the working directory)`, 'out');
    }));

    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        const v = input.value; input.value='';
        run(v);
      }
    });
    print('Simulated Git Terminal ready. Try: git status', 'out');
  }

  /* =========================================================
     Mount dispatcher
  ========================================================= */
  const MOUNTERS = {
    zonesWidget: mountZones,
    cloneEditPushWidget: mountCloneEditPush,
    branchViz: mountBranchViz,
    pipelineWidget: mountPipeline,
    prSim: mountPRSim,
    conflictSim: mountConflictSim,
    teamSim: mountTeamSim,
    gitignoreWidget: mountGitignore,
    cicdSim: mountCicd,
    capstone: mountCapstone,
    terminal: mountTerminal,
  };

  function mount(name, container, ctx){
    if(container.dataset.mounted) return;
    container.dataset.mounted = '1';
    const fn = MOUNTERS[name];
    if(fn) fn(container, ctx);
    else container.innerHTML = `<div class="small">Widget "${esc(name)}" not found.</div>`;
  }

  return { mount };
})();
