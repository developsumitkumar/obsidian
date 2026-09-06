/* ===========================================================
   Curriculum data — Git & GitHub: The Visual Developer Workflow
   Pure data. Rendered by render.js. Widgets mounted by widgets.js.
   =========================================================== */

const LEVELS = [
// ============================================================ LEVEL 0
{
  id:'level-0', num:0, title:'Before Git', kicker:'Why version control exists',
  summary:'Before you learn a single Git command, you need to feel the problem Git solves. This level has no commands — just the pain of working without one.',
  lessons:[
    { title:'The "final-final-v2" problem', blocks:[
      {t:'p', text:'Imagine you are writing code for a school project. Every time you make a big change, you are scared of breaking something that used to work — so you save a new copy of the whole folder.'},
      {t:'svg', caption:'Life without version control', html:`
        <div class="flow">
          <div class="step">project-v1</div><div class="arrow">↓</div>
          <div class="step">project-v2</div><div class="arrow">↓</div>
          <div class="step">project-final</div><div class="arrow">↓</div>
          <div class="step">project-final-2</div><div class="arrow">↓</div>
          <div class="step">project-final-new</div><div class="arrow">↓</div>
          <div class="step hl">project-final-really-final</div>
        </div>`},
      {t:'p', text:'This feels safe, but it is actually chaos. Which folder is the real one? What exactly changed between project-final and project-final-2? Nobody remembers. If two people work on the project, this gets even worse — copies get overwritten by email or shared drives.'},
      {t:'mistake', text:'"I\'ll just keep folder copies to be safe." — This works for a day. It completely falls apart once a project has more than a few changes, or more than one person.'},
      {t:'p', text:'A version control system fixes this by tracking every meaningful change inside one project folder, instead of duplicating the whole folder over and over.'},
      {t:'svg', caption:'The same project, tracked by Git instead of copied', html:`
        <div class="flow">
          <div class="step hl">Project</div><div class="arrow">↓</div>
          <div class="step">Commit 1 — "Initial setup"</div><div class="arrow">↓</div>
          <div class="step">Commit 2 — "Add login form"</div><div class="arrow">↓</div>
          <div class="step">Commit 3 — "Fix validation bug"</div><div class="arrow">↓</div>
          <div class="step">Commit 4 — "Add tests"</div>
        </div>`},
      {t:'remember', items:['One project folder, one history — no duplicate folders.', 'Every meaningful change is recorded as a step you can return to.', 'This recorded history is called version control.']},
    ]},
    { title:'Version Control, Git, and GitHub are three different things', blocks:[
      {t:'p', text:'These three words get used interchangeably by beginners, but they mean different things and mixing them up causes real confusion later.'},
      {t:'compare', items:[
        {title:'Version Control', text:'A general idea: keep a history of changes to files so you can review, compare, and undo them. It\'s a concept, not a tool.', use:'The "what" and "why" behind tracking changes.'},
        {title:'Git', text:'A specific, free program that implements version control. It runs on your computer and manages the history of a project folder.', use:'The tool you actually run: git init, git commit, git log…'},
      ]},
      {t:'p', text:'And then there is GitHub, which is a completely different kind of thing.'},
      {t:'svg', caption:'Git vs GitHub — not the same thing', html:`
        <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div class="compare-col"><h5>Git</h5><p>A program installed on <b>your computer</b>. It tracks history locally. Works completely offline.</p><p class="use">Think: the notebook itself.</p></div>
          <div class="compare-col"><h5>GitHub</h5><p>A <b>website</b> that hosts copies of Git repositories online, so people can share and collaborate on them.</p><p class="use">Think: a shared cloud drive built specifically for Git notebooks, plus tools like Pull Requests, Issues, and CI/CD.</p></div>
        </div>`},
      {t:'p', text:'You could use Git for years without ever touching GitHub — many developers do, using private servers instead. GitHub is simply the most popular place to host Git repositories and collaborate around them.'},
      {t:'mistake', text:'"GitHub is Git." — False. Git is the tool. GitHub is one company\'s website for hosting projects that use Git. GitLab and Bitbucket are competitors that also host Git repositories.'},
      {t:'remember', items:['Version control = the concept', 'Git = the tool that implements it, on your machine', 'GitHub = a website that hosts Git projects online + adds collaboration features']},
      {t:'practice', text:'Say out loud (or write down) one sentence explaining the difference between Git and GitHub in your own words, without looking back at this page.'},
    ]},
  ],
  learned:['The problem duplicate folders create', 'What "version control" means', 'That Git and GitHub are different things'],
  next:'Level 1 — install Git conceptually and learn the three-zone mental model that everything else builds on.'
},

// ============================================================ LEVEL 1
{
  id:'level-1', num:1, title:'Git Fundamentals', kicker:'The three-zone mental model',
  summary:'This is the single most important level in the whole book. Once you can see the working directory, staging area, and repository as three separate places a file can be, every future Git command becomes predictable.',
  lessons:[
    { title:'What is Git, really?', blocks:[
      {t:'p', text:'Git is a program that watches a project folder and lets you save labeled snapshots of it over time, called commits. It runs entirely on your computer — no internet required.'},
      {t:'analogy', text:'Git is like a very disciplined save system in a video game. Instead of one "Save" slot that overwrites itself, you get unlimited save points, each with a note describing what happened, and you can jump back to any of them.'},
      {t:'command', cmd:'git --version', explain:'Checks whether Git is installed and which version you have. This is usually the first command you run on a new machine, purely to confirm Git exists.'},
      {t:'command', cmd:'git config --global user.name "Your Name"', explain:'Tells Git who you are, so every commit you make is labeled with your name. This is a one-time setup per computer.'},
      {t:'command', cmd:'git config --global user.email "you@example.com"', explain:'Same idea, but for your email address. GitHub also uses this to match your commits to your GitHub account.'},
      {t:'mistake', text:'Skipping git config and wondering why every commit says "unknown author". Git needs to be told who you are before it will label commits properly.'},
      {t:'practice', text:'If you have Git installed, open a terminal and run git --version. If you don\'t, that\'s fine — everything in this book can be learned visually first, and installed later.'},
    ]},
    { title:'The three zones: Working Directory, Staging Area, Repository', blocks:[
      {t:'p', text:'Every file in a Git project can sit in one of three places. Understanding these three places is 80% of understanding Git.'},
      {t:'analogy', text:'Think of moving furniture into a house. The Working Directory is the room where you are actively arranging furniture. The Staging Area is the doorway where you\'ve picked which pieces are ready to bring in. The Repository is the permanent room where furniture is placed and recorded — done.'},
      {t:'svg', caption:'The three zones of Git', html:`
        <svg viewBox="0 0 720 190" width="100%" style="max-width:680px;display:block;margin:0 auto;">
          <g font-size="12">
            <rect x="10" y="30" width="200" height="110" rx="10" fill="var(--bg-elev-1)" stroke="var(--amber)"/>
            <text x="110" y="20" text-anchor="middle" fill="var(--amber)" font-weight="700">WORKING DIRECTORY</text>
            <text x="110" y="90" text-anchor="middle" dim="1">Files you</text>
            <text x="110" y="106" text-anchor="middle">are editing now</text>

            <rect x="260" y="30" width="200" height="110" rx="10" fill="var(--bg-elev-1)" stroke="var(--accent)"/>
            <text x="360" y="20" text-anchor="middle" fill="var(--accent)" font-weight="700">STAGING AREA</text>
            <text x="360" y="90" text-anchor="middle">Files marked</text>
            <text x="360" y="106" text-anchor="middle">"include next commit"</text>

            <rect x="510" y="30" width="200" height="110" rx="10" fill="var(--bg-elev-1)" stroke="var(--green)"/>
            <text x="610" y="20" text-anchor="middle" fill="var(--green)" font-weight="700">REPOSITORY (.git)</text>
            <text x="610" y="90" text-anchor="middle">Permanent history</text>
            <text x="610" y="106" text-anchor="middle">of commits</text>

            <text x="235" y="90" text-anchor="middle" fill="var(--text-faint)" font-family="var(--mono)" font-size="11">git add →</text>
            <text x="485" y="90" text-anchor="middle" fill="var(--text-faint)" font-family="var(--mono)" font-size="11">git commit →</text>
          </g>
        </svg>`},
      {t:'p', text:'A change always flows left to right: you edit a file (working directory), you choose it with git add (staging area), then you save it permanently with git commit (repository). Nothing skips a step.'},
      {t:'widget', name:'zonesWidget'},
      {t:'command', cmd:'git init', explain:'Turns an ordinary folder into a Git repository by creating a hidden .git folder inside it. That hidden folder is where all history will live from now on.'},
      {t:'svg', caption:'What changes on disk after git init', html:`
        <div class="flow">
          <div class="step">my-project/</div>
          <div class="arrow">git init ↓</div>
          <div class="step hl">my-project/.git/  ← history storage created here</div>
        </div>`},
      {t:'mistake', text:'Thinking git add uploads your file somewhere. It does not — it only marks the file as "ready to be committed" inside your own computer. Nothing leaves your machine yet.'},
      {t:'bestpractice', text:'Run git status often. It tells you exactly which zone every file is currently in, which removes almost all the guesswork while you\'re learning.'},
      {t:'practice', text:'Use the interactive diagram above: click "Modify File", then "git add", then "git commit". Watch the file move through all three zones. Then click "Modify Again" and notice a fresh, independent change appears.'},
      {t:'quiz', questions:[
        { q:'You just ran git add on a file. Has that file been sent to GitHub?', options:['Yes, it is now on GitHub','No — it is only in the local staging area','No — it was deleted','Yes, but only the file name'], correct:1,
          explain:'git add never contacts the internet. It only moves a change from the Working Directory into the local Staging Area, inside your own .git folder.' },
        { q:'What creates the hidden .git folder that stores your project\'s history?', options:['git commit','git status','git init','git add'], correct:2,
          explain:'git init is a one-time command per project that creates the .git folder — the actual database of history for that project.' },
      ]},
    ]},
  ],
  learned:['What Git is and why it runs locally', 'The three zones: Working Directory → Staging Area → Repository', 'git init, git config, git --version'],
  next:'Level 2 — take your local repository online with GitHub, remotes, and origin.'
},

// ============================================================ LEVEL 2
{
  id:'level-2', num:2, title:'GitHub & Repositories', kicker:'Taking your project online',
  summary:'Your Git repository so far only exists on your computer. This level connects it to GitHub, so it can be backed up, shared, and worked on by other people.',
  lessons:[
    { title:'Local vs remote repositories', blocks:[
      {t:'p', text:'A repository (or "repo") is just a project folder whose history Git is tracking. So far you\'ve only seen local repositories — ones that live on your machine. GitHub lets you host a remote repository: the same history, stored on a server, reachable over the internet.'},
      {t:'svg', caption:'Pushing local history up to GitHub', html:`
        <div class="flow">
          <div class="step hl">LOCAL COMPUTER — Project</div>
          <div class="arrow">git push ↓</div>
          <div class="step">GITHUB — Remote Repository</div>
        </div>`},
      {t:'svg', caption:'Pulling remote history back down', html:`
        <div class="flow">
          <div class="step">GITHUB — Remote Repository</div>
          <div class="arrow">git pull ↓</div>
          <div class="step hl">LOCAL COMPUTER — Project</div>
        </div>`},
      {t:'p', text:'A "remote" is simply a saved address that points to a repository somewhere else — usually on GitHub. By convention, the main remote is named origin.'},
      {t:'command', cmd:'git remote -v', explain:'Lists the remotes your local repository knows about, and the URLs they point to. Freshly cloned projects usually already have one remote called origin.'},
      {t:'command', cmd:'git remote add origin https://github.com/you/project.git', explain:'Connects your local repository to a GitHub repository, naming that connection "origin". After this, git push and git pull know where to go.'},
      {t:'mistake', text:'"origin" is a magic keyword.' + ' It isn\'t — it\'s just the conventional name. You could name a remote anything, but almost every tutorial and tool assumes origin, so it\'s best to stick with it.'},
    ]},
    { title:'clone vs fork, fetch vs pull, push', blocks:[
      {t:'compare', items:[
        {title:'git clone', text:'Downloads a full copy of a remote repository — including its entire history — onto your computer, and automatically sets it as "origin".', use:'Starting fresh on a project that already exists on GitHub.'},
        {title:'Fork', text:'A GitHub-only concept: creates your own copy of someone else\'s repository under your account on GitHub, before you even clone anything.', use:'Contributing to a project you don\'t have write access to.'},
      ]},
      {t:'command', cmd:'git clone https://github.com/someone/project.git', explain:'Copies the whole repository — files and history — into a new folder on your machine, ready to work in immediately.'},
      {t:'compare', items:[
        {title:'git fetch', text:'Downloads new information from the remote (new commits, branches) but does NOT change your working files. It just updates Git\'s knowledge of what\'s on GitHub.', use:'Checking what changed remotely before deciding what to do.'},
        {title:'git pull', text:'Does a git fetch, and then immediately merges those new changes into your current branch. Your files update right away.', use:'You want to be up to date, right now, with minimal steps.'},
      ]},
      {t:'svg', caption:'fetch vs pull', html:`
        <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div class="compare-col"><h5>git fetch</h5><p>GitHub → your Git\'s memory of GitHub<br><span class="small">Your files: unchanged</span></p></div>
          <div class="compare-col"><h5>git pull</h5><p>GitHub → your Git\'s memory <b>+ your files</b><br><span class="small">fetch, then merge, automatically</span></p></div>
        </div>`},
      {t:'command', cmd:'git push', explain:'Uploads your local commits to the remote repository (GitHub), so others — and GitHub itself — can see them.'},
      {t:'bestpractice', text:'When you\'re not sure what changed remotely, git fetch first and inspect, rather than git pull blindly. It\'s a safe, read-only look before you touch your files.'},
      {t:'widget', name:'cloneEditPushWidget'},
      {t:'quiz', questions:[
        { q:'Which command updates Git\'s knowledge of the remote WITHOUT changing your working files?', options:['git pull','git push','git fetch','git clone'], correct:2,
          explain:'git fetch only downloads information. Your files stay exactly as they were until you decide to merge that information in (which is what git pull does automatically).' },
      ]},
    ]},
  ],
  learned:['Local vs remote repositories', 'origin, git remote, git clone', 'The difference between fetch, pull, and push'],
  next:'Level 3 — branches: working on multiple versions of a project at once without breaking anything.'
},

// ============================================================ LEVEL 3
{
  id:'level-3', num:3, title:'Branches', kicker:'The most important idea in Git',
  summary:'Branches let you build something new without touching the version everyone depends on. This level includes the big interactive branch visualizer — spend real time here.',
  lessons:[
    { title:'Why branches exist', blocks:[
      {t:'analogy', text:'main is the main road everyone drives on. A feature branch is a side road you build off of it, to test something, without putting traffic on the main road at risk. When your side road works well, you connect it back to the main road (merge).'},
      {t:'p', text:'Without branches, everyone would have to edit the exact same version of the code at the exact same time — one mistake and it breaks for everyone. Branches let each person, or each feature, live in its own isolated timeline until it\'s ready.'},
      {t:'mistake', text:'"A branch is a copy of the whole project." It is not a duplicate folder — it\'s a lightweight, movable pointer to a specific commit. Creating a branch is nearly instant and doesn\'t duplicate your files on disk.'},
      {t:'command', cmd:'git branch', explain:'Lists all branches in your local repository, and marks which one you\'re currently on with an asterisk.'},
      {t:'command', cmd:'git branch feature/login', explain:'Creates a new branch named feature/login, pointing at your current commit. You are NOT switched to it yet — you\'re still on your original branch.'},
      {t:'command', cmd:'git switch feature/login', explain:'Switches your working directory to the feature/login branch. Modern Git recommends git switch for this — it\'s clearer and safer than the older, overloaded git checkout.'},
      {t:'command', cmd:'git switch -c feature/login', explain:'A shortcut that creates the branch AND switches to it in one step — the version you\'ll use most often day to day.'},
      {t:'p', text:'You will see older tutorials use git checkout feature/login instead. That still works, but git checkout has historically done too many different jobs (switching branches, restoring files, and more), which made it a common source of mistakes. Modern Git split it into two clearer commands:'},
      {t:'compare', items:[
        {title:'git switch', text:'Switches between branches. That\'s its only job.', use:'"I want to move to a different branch."'},
        {title:'git restore', text:'Restores files to a previous state, discarding local changes to them.', use:'"I want to undo my edits to this one file."'},
      ]},
    ]},
    { title:'The branch visualizer', blocks:[
      {t:'p', text:'This is the big one. Use the visualizer below to create branches, commit to them, switch between them, and merge them back — and watch the graph update in real time.'},
      {t:'widget', name:'branchViz'},
      {t:'command', cmd:'git merge feature/login', explain:'Run while on main, this brings the commits from feature/login into main. If main hasn\'t changed since the branch was created, this is a simple "fast-forward". If it has, Git creates a merge commit joining both histories.'},
      {t:'command', cmd:'git branch -d feature/login', explain:'Deletes the feature/login branch once you no longer need it (usually right after merging). The commits themselves are safe — they now live on main too.'},
      {t:'bestpractice', text:'Delete branches after merging them. A repository with hundreds of old, merged branches becomes confusing to navigate — GitHub even offers a button to auto-delete branches after merge.'},
      {t:'p', text:'Scenario: You need to build a login feature while another developer works on payment, at the same time, without stepping on each other.'},
      {t:'practice', text:'In the visualizer above: create a branch called feature/login, add a commit to it, then create a second branch called feature/payment from main and add a commit there too. Notice both branches can exist and grow independently.'},
      {t:'quiz', questions:[
        { q:'Two developers need to build unrelated features at the same time without breaking main. What should they do?', options:['Both edit main directly, carefully','Each creates their own branch off main','One of them waits until the other finishes','Delete main and start over'], correct:1,
          explain:'Separate branches let each person work in isolation. Neither one can accidentally break what the other is doing, and main stays stable the whole time.' },
        { q:'What does creating a branch actually do under the hood?', options:['Duplicates every file into a new folder','Creates a lightweight pointer to a commit','Uploads a copy to GitHub automatically','Deletes the previous branch'], correct:1,
          explain:'A branch is just a movable label pointing at a commit — which is why creating one is nearly instant, even on huge projects.' },
      ]},
    ]},
  ],
  learned:['Why branches exist (main vs side roads)', 'git branch, git switch, git merge, git branch -d', 'That checkout has been split into switch + restore in modern Git'],
  next:'Level 4 — the exact difference between add, commit, push, pull, and fetch, as one connected pipeline.'
},

// ============================================================ LEVEL 4
{
  id:'level-4', num:4, title:'Commit / Push / Pull', kicker:'The daily pipeline',
  summary:'You\'ve seen these commands separately. Now see them as one continuous pipeline, and use the interactive command buttons to feel exactly what changes — and what doesn\'t — at each step.',
  lessons:[
    { title:'From a changed file to GitHub', blocks:[
      {t:'svg', caption:'The full local → remote pipeline', html:`
        <div class="flow">
          <div class="step">FILE CHANGED</div><div class="arrow">git status ↓</div>
          <div class="step">git add ↓</div>
          <div class="step hl">STAGING AREA</div><div class="arrow">git commit ↓</div>
          <div class="step">LOCAL HISTORY</div><div class="arrow">git push ↓</div>
          <div class="step">GITHUB</div>
        </div>`},
      {t:'command', cmd:'git status', explain:'Shows the current state: which files are modified, which are staged, and which branch you\'re on. This is your map — run it constantly.'},
      {t:'command', cmd:'git add login.js', explain:'Moves login.js from "changed" into the staging area. Only staged changes get included in the next commit.'},
      {t:'command', cmd:'git commit -m "Add login validation"', explain:'Saves everything currently staged as a new, permanent point in your local history, labeled with that message.'},
      {t:'command', cmd:'git push', explain:'Uploads any local commits that GitHub doesn\'t have yet, to the remote repository.'},
      {t:'widget', name:'pipelineWidget'},
      {t:'mistake', text:'Believing git commit sends your code to GitHub. It doesn\'t — a commit is 100% local until you explicitly run git push.'},
    ]},
    { title:'Bringing changes back down', blocks:[
      {t:'p', text:'The reverse direction matters just as much, especially once other people are pushing to the same repository.'},
      {t:'compare', items:[
        {title:'git fetch', text:'GitHub → Git\'s local memory of GitHub. Look, don\'t touch.', use:'"What has changed remotely, before I decide anything?"'},
        {title:'git pull', text:'Fetch, then automatically merge those changes into your current branch. Your files update.', use:'"Bring me fully up to date, right now."'},
      ]},
      {t:'command', cmd:'git fetch', explain:'Updates your local knowledge of the remote branches without touching your working files.'},
      {t:'command', cmd:'git pull', explain:'Fetches and immediately merges. If you have local uncommitted changes that conflict, Git will stop and ask you to resolve that first.'},
      {t:'bestpractice', text:'Pull (or at least fetch) before you start working each day, and again right before you push. It keeps your branch close to what everyone else sees.'},
      {t:'quiz', questions:[
        { q:'Put these in the correct order: git commit, git add, git push, edit a file.', options:['edit file → git add → git commit → git push','git add → edit file → git push → git commit','git push → git commit → git add → edit file','git commit → git add → edit file → git push'], correct:0,
          explain:'You always change a file first, stage it (git add), save a snapshot locally (git commit), then optionally share it (git push).' },
      ]},
    ]},
  ],
  learned:['status → add → commit → push as one pipeline', 'fetch vs pull, precisely', 'What changes locally vs remotely at each step'],
  next:'Level 5 — Pull Requests: how teams review code before it joins main.'
},

// ============================================================ LEVEL 5
{
  id:'level-5', num:5, title:'Pull Requests', kicker:'Where code gets reviewed',
  summary:'A Pull Request (PR) is GitHub\'s way of proposing "please merge my branch into yours" — and giving other people a chance to review it first. This is how real teams keep main safe.',
  lessons:[
    { title:'What a Pull Request actually is', blocks:[
      {t:'p', text:'A Pull Request is not a Git concept — it\'s a GitHub (and GitLab/Bitbucket) feature built on top of Git. It represents a request to merge one branch into another, with a space attached for discussion, comments, and approval before it happens.'},
      {t:'compare', items:[
        {title:'A commit', text:'One saved snapshot of changes. Silent, no discussion attached.', use:'The unit of history.'},
        {title:'A Pull Request', text:'A proposal containing one or more commits from a branch, opened for review before merging.', use:'The unit of collaboration and review.'},
      ]},
      {t:'svg', caption:'The Pull Request workflow', html:`
        <div class="flow">
          <div class="step">Developer creates branch → commits → pushes</div><div class="arrow">↓</div>
          <div class="step hl">Open Pull Request</div><div class="arrow">↓</div>
          <div class="step">Reviewer reviews</div><div class="arrow">↓</div>
          <div class="step">Changes requested → developer updates → pushes again</div><div class="arrow">↓ (or, if approved)</div>
          <div class="step">Approved → Merge → main</div>
        </div>`},
      {t:'p', text:'PRs exist because merging straight into main with no review is risky. A second set of eyes catches bugs, design issues, and typos before they reach everyone else.'},
      {t:'mistake', text:'"A branch and a Pull Request are the same thing." A branch is just where the commits live. The Pull Request is the conversation and review process wrapped around merging that branch.'},
    ]},
    { title:'The simulated PR screen', blocks:[
      {t:'p', text:'Below is a simplified simulation of what a GitHub Pull Request page looks like: a diff of the changes, review comments, and buttons to approve, request changes, or merge.'},
      {t:'widget', name:'prSim'},
      {t:'bestpractice', text:'Keep PRs small. A PR that changes 30 files is exhausting to review carefully, so real bugs slip through. A focused PR that does one thing gets reviewed properly — and merged faster.'},
      {t:'quiz', questions:[
        { q:'A reviewer clicks "Request changes" on your Pull Request. What should you do?', options:['Close the PR and give up','Push new commits addressing the feedback — the PR updates automatically','Open a brand new PR','Merge anyway'], correct:1,
          explain:'Pushing more commits to the same branch automatically updates the same open PR — no need to open a new one. The reviewer then re-reviews the new changes.' },
      ]},
    ]},
  ],
  learned:['What a Pull Request is, and why it\'s not just a branch', 'The PR review lifecycle', 'Approve vs request changes vs merge'],
  next:'Level 6 — what actually happens during a merge, and how to resolve a conflict when two people change the same lines.'
},

// ============================================================ LEVEL 6
{
  id:'level-6', num:6, title:'Merge & Conflicts', kicker:'When two changes collide',
  summary:'Merging is usually invisible and automatic. Sometimes it isn\'t — this level shows exactly what a conflict looks like and how to resolve one, step by step.',
  lessons:[
    { title:'Fast-forward merge vs merge commit', blocks:[
      {t:'compare', items:[
        {title:'Fast-forward merge', text:'main hasn\'t moved since your branch started. Git just slides main\'s pointer forward to your latest commit — no new commit needed.', use:'Simple, linear history. Most small features.'},
        {title:'Merge commit', text:'main moved forward too while you worked. Git creates a new commit that joins both histories together.', use:'Preserves the fact that two lines of work happened in parallel.'},
      ]},
      {t:'p', text:'Both are completely normal outcomes of git merge — you don\'t choose between them manually, Git decides based on whether the histories diverged.'},
    ]},
    { title:'Why conflicts happen, and how to resolve one', blocks:[
      {t:'p', text:'A merge conflict happens when two branches changed the exact same lines of the exact same file in different ways, and Git can\'t automatically decide which version is correct.'},
      {t:'svg', caption:'Two branches, one disagreement', html:`
        <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div class="compare-col"><h5>main</h5><p class="mono" style="font-family:var(--mono)">buttonColor = "blue"</p></div>
          <div class="compare-col"><h5>feature/button</h5><p class="mono" style="font-family:var(--mono)">buttonColor = "green"</p></div>
        </div>`},
      {t:'p', text:'When you try to merge feature/button into main, Git can\'t know which color you actually want, so it stops and marks the file with conflict markers:'},
      {t:'widget', name:'conflictSim'},
      {t:'p', text:'Resolution steps: open the conflicted file → understand both changes → decide the final code → remove the <<<<<<<, =======, >>>>>>> markers → save → git add the file → git commit to finish the merge.'},
      {t:'command', cmd:'git add login.js', explain:'After you\'ve manually fixed the file and removed the conflict markers, this tells Git "this file\'s conflict is resolved".'},
      {t:'command', cmd:'git commit', explain:'Finishes the merge by creating the merge commit. Git usually pre-fills a sensible commit message for you here.'},
      {t:'mistake', text:'Panicking and deleting one side entirely without reading it. Conflicts are not errors — they\'re Git asking a question. Read both versions before choosing.'},
      {t:'bestpractice', text:'Pull main into your branch often while you work. Small, frequent merges create small, easy conflicts. Waiting weeks creates huge, painful ones.'},
      {t:'quiz', questions:[
        { q:'Why does a merge conflict happen?', options:['Git is broken','Two branches changed the same lines differently, and Git can\'t choose for you','You forgot to git push','The internet disconnected'], correct:1,
          explain:'Git can merge non-overlapping changes automatically. It only asks for your help when the same lines were changed in two different ways.' },
      ]},
    ]},
  ],
  learned:['Fast-forward merge vs merge commit', 'What causes a conflict', 'The manual resolution steps, in order'],
  next:'Level 7 — how a whole team uses branches and PRs together without stepping on each other.'
},

// ============================================================ LEVEL 7
{
  id:'level-7', num:7, title:'Team Workflow', kicker:'Many developers, one repository',
  summary:'Individually, each command is simple. This level shows how a team of developers uses them together, day to day, without chaos.',
  lessons:[
    { title:'Everyone branches off main', blocks:[
      {t:'svg', caption:'Three developers, three branches, one main', html:`
        <div class="flow">
          <div class="step hl">main</div>
          <div class="arrow">├──</div>
          <div class="step">feature/login (Dev A)</div>
          <div class="arrow">├──</div>
          <div class="step">feature/payment (Dev B)</div>
          <div class="arrow">└──</div>
          <div class="step">bugfix/cart (Dev C)</div>
        </div>`},
      {t:'p', text:'Each person works in isolation on their own branch. When ready, they open a PR, it gets reviewed, automated checks run, and only then does it merge into main.'},
      {t:'svg', caption:'Every branch goes through the same gate', html:`
        <div class="flow">
          <div class="step">Pull Request</div><div class="arrow">↓</div>
          <div class="step">Review</div><div class="arrow">↓</div>
          <div class="step">CI checks</div><div class="arrow">↓</div>
          <div class="step hl">Merge into main</div>
        </div>`},
      {t:'p', text:'Protected branches are a GitHub setting that literally blocks anyone — even the repository owner — from pushing directly to main. Every change must go through a reviewed, checked Pull Request instead.'},
    ]},
    { title:'The habits that make teamwork actually work', blocks:[
      {t:'p', text:'Naming: use a consistent prefix like feature/, bugfix/, or hotfix/, followed by a short description — feature/login-page, bugfix/cart-total.'},
      {t:'p', text:'Commit messages: describe what changed and why, in the imperative mood — "Add login validation", not "changes" or "stuff".'},
      {t:'p', text:'Keeping branches updated: regularly merge or rebase main into your branch so it doesn\'t drift too far and cause a painful conflict later.'},
      {t:'bestpractice', text:'Small PRs, clear descriptions, and responding to review comments promptly are the three habits that make a team\'s Git workflow feel smooth instead of stressful.'},
      {t:'mistake', text:'Pushing directly to main "just this once" to save time. This is exactly what protected branches and PR review exist to prevent — one untested change can break the whole team\'s work.'},
      {t:'widget', name:'teamSim'},
      {t:'quiz', questions:[
        { q:'What is a "protected branch" for?', options:['To hide the branch from other developers','To prevent direct pushes, forcing changes through review + checks','To make the branch read-only forever','To automatically delete old commits'], correct:1,
          explain:'A protected branch (usually main) requires every change to go through a Pull Request with review and checks — nobody can push straight to it, which keeps it stable.' },
      ]},
    ]},
  ],
  learned:['How multiple developers branch off the same main', 'Protected branches', 'Naming and commit-message habits that scale to teams'],
  next:'Level 8 — environments: why code doesn\'t go straight from your laptop to real users.'
},

// ============================================================ LEVEL 8
{
  id:'level-8', num:8, title:'Environments', kicker:'Development, Staging, Production',
  summary:'Merging code into main is not the same as showing it to real users. This level explains the safety net of environments that sits between "it works on my machine" and "it works for everyone".',
  lessons:[
    { title:'Why we don\'t deploy straight to real users', blocks:[
      {t:'analogy', text:'A restaurant kitchen doesn\'t serve a brand-new dish straight to customers. It\'s tested in a test kitchen first, then prepared properly in the real kitchen, and only then served. Software works the same way: Development → Staging → Production.'},
      {t:'svg', caption:'The environment ladder', html:`
        <div class="flow">
          <div class="step">Developer Laptop</div><div class="arrow">↓</div>
          <div class="step">Development</div><div class="arrow">↓</div>
          <div class="step">Staging</div><div class="arrow">↓</div>
          <div class="step hl">Production</div>
        </div>`},
      {t:'compare', items:[
        {title:'Development', text:'Where developers actively build and experiment. Frequently broken — that\'s expected.', use:'Day-to-day coding.'},
        {title:'Staging', text:'A near-identical copy of production, used to test that everything really works before real users see it.', use:'Final check before release.'},
      ]},
      {t:'compare', items:[
        {title:'Production', text:'The real, live application that actual users depend on. Changes here must be stable.', use:'What the world sees.'},
      ]},
    ]},
    { title:'Same code, different configuration', blocks:[
      {t:'p', text:'Usually the code is nearly identical across environments — what changes is configuration: which database it talks to, which API address it uses, which secrets it has access to.'},
      {t:'svg', caption:'Same app, different API address per environment', html:`
        <div class="flow">
          <div class="step">Development API — api-dev.example.com</div>
          <div class="step">Staging API — api-stage.example.com</div>
          <div class="step hl">Production API — api.example.com</div>
        </div>`},
      {t:'p', text:'These per-environment values are called environment variables. Sensitive ones — passwords, tokens, API keys — are called secrets, and are kept out of the code entirely, injected at runtime by a secret manager.'},
      {t:'mistake', text:'"Production is just another folder on the server." It\'s not — production usually has its own database, its own secrets, tighter access control, and real consequences if something breaks.'},
      {t:'bestpractice', text:'Never hard-code a production URL, password, or key directly into your source code. Use environment variables so the same code behaves correctly wherever it runs.'},
      {t:'quiz', questions:[
        { q:'What usually differs the most between staging and production?', options:['The programming language','Configuration — like API URLs, databases, and secrets','The company that owns the code','Nothing — they must be code-identical'], correct:1,
          explain:'The code is typically the same or nearly the same. What changes is configuration: which database, which API endpoints, which secrets are active.' },
      ]},
    ]},
  ],
  learned:['Development, Staging, Production and why they\'re separate', 'Environment variables and secrets', 'Why "it works on my machine" isn\'t enough'],
  next:'Level 9 — CI/CD: the automated pipeline that checks and moves code between environments.'
},

// ============================================================ LEVEL 9
{
  id:'level-9', num:9, title:'CI/CD & Pipelines', kicker:'Automating the boring, critical checks',
  summary:'CI/CD sounds intimidating but it\'s just automation: a checklist of steps that run automatically every time code changes, so humans don\'t have to remember to do them manually.',
  lessons:[
    { title:'CI vs CD, in plain English', blocks:[
      {t:'compare', items:[
        {title:'Continuous Integration (CI)', text:'Every time someone pushes code, it\'s automatically built and tested — catching problems within minutes instead of weeks.', use:'"Does this change actually work, and does it break anything else?"'},
        {title:'Continuous Delivery / Deployment (CD)', text:'Automatically prepares (Delivery) or directly ships (Deployment) code to an environment once it passes CI.', use:'"Now that it\'s verified, get it in front of users."'},
      ]},
      {t:'p', text:'A pipeline is the full sequence of automated steps. A workflow is GitHub Actions\' name for a pipeline definition. A job is a group of steps that run together; a step is one individual action, like "run tests". A runner is the actual machine that executes the job. An artifact is a file produced by the pipeline (like a built app) that gets passed to later steps.'},
    ]},
    { title:'The interactive pipeline', blocks:[
      {t:'p', text:'Below is a realistic pipeline, using GitHub Actions as the example. Click each stage to see the exact command it runs and what happens if it fails.'},
      {t:'widget', name:'cicdSim'},
      {t:'p', text:'A pipeline is not magic — it\'s simply a sequence of automated tasks, run in order, that stop as soon as one of them fails.'},
      {t:'svg', caption:'A failed test blocks everything after it', html:`
        <div class="flow">
          <div class="step" style="border-color:var(--green);color:var(--green)">BUILD — ✓ passed</div>
          <div class="step" style="border-color:var(--red);color:var(--red)">TEST — ✗ failed</div>
          <div class="step" style="opacity:.5">DEPLOY — ⏸ blocked</div>
        </div>`},
      {t:'mistake', text:'"If CI passes, the code must be perfect." CI only checks what it was configured to check. It catches the bugs its tests were written for — nothing more.'},
      {t:'bestpractice', text:'Keep pipelines fast. A CI run that takes 45 minutes gets ignored or worked around. Fast feedback (under a few minutes) keeps developers actually paying attention to it.'},
      {t:'quiz', questions:[
        { q:'The TEST stage fails. What should typically happen to the DEPLOY stage?', options:['It runs anyway','It is blocked / skipped','It deploys a random older version','It emails the whole company'], correct:1,
          explain:'Pipelines are sequential gates — a failure at one stage should block later stages, especially deployment, so broken code never reaches real users.' },
        { q:'What is a "runner" in CI/CD?', options:['A type of test','The machine that actually executes the pipeline\'s steps','A GitHub employee','A kind of Git branch'], correct:1,
          explain:'A runner is the compute environment (often a temporary virtual machine) that GitHub Actions spins up to actually execute your workflow\'s steps.' },
      ]},
    ]},
  ],
  learned:['CI vs CD, precisely', 'Pipeline, workflow, job, step, runner, artifact', 'Why a failed stage should block later stages'],
  next:'Level 10 — deployment: how a passed pipeline actually turns into a live application, and how to undo it if something goes wrong.'
},

// ============================================================ LEVEL 10
{
  id:'level-10', num:10, title:'Deployment', kicker:'From source code to a live server',
  summary:'This level connects the dots: how source code becomes a running application users can actually reach, and what happens when a deployment goes wrong.',
  lessons:[
    { title:'Build, artifact, deploy', blocks:[
      {t:'svg', caption:'From source to a running app', html:`
        <div class="flow">
          <div class="step">Source Code</div><div class="arrow">↓ build</div>
          <div class="step">Artifact (a packaged, ready-to-run bundle)</div><div class="arrow">↓ deploy</div>
          <div class="step">Server / Cloud Hosting</div><div class="arrow">↓</div>
          <div class="step hl">Live Application</div>
        </div>`},
      {t:'p', text:'A build transforms your raw source code into something a computer can actually run — compiling, bundling, minifying. An artifact is the result: a packaged file (or set of files) that\'s ready to deploy. Deployment is the act of placing that artifact onto a server so it starts running and becomes reachable.'},
      {t:'p', text:'A release is a specific, labeled version of your artifact that got deployed — useful for tracking exactly what\'s live at any moment, and for rolling back if needed.'},
    ]},
    { title:'Rollback: the undo button for production', blocks:[
      {t:'svg', caption:'Rolling back a bad deployment', html:`
        <div class="flow">
          <div class="step">Version 10 → Production</div>
          <div class="arrow">↓ problem detected</div>
          <div class="step hl">Version 9 → Production</div>
        </div>`},
      {t:'p', text:'A rollback replaces a broken live version with the last known-good one, usually within minutes. This is why keeping clean, labeled release history matters — you need something safe to roll back to.'},
      {t:'bestpractice', text:'Always know how to roll back before you deploy forward. A fast, reliable rollback plan turns a production incident from a crisis into a five-minute fix.'},
      {t:'mistake', text:'"Deploying is basically the same as merging a PR." Merging changes your source code\'s history. Deploying is the separate act of getting that code actually running somewhere users can reach — they often happen automatically together, but they are not the same event.'},
      {t:'quiz', questions:[
        { q:'Production is broken after a deployment. What\'s usually the fastest fix?', options:['Rewrite the feature from scratch','Roll back to the previous known-good version','Wait for the next scheduled deploy','Turn off the server permanently'], correct:1,
          explain:'A rollback restores the last stable version almost immediately, buying time to properly fix and re-deploy the actual bug without users suffering in the meantime.' },
      ]},
    ]},
  ],
  learned:['Build → artifact → deploy, as a chain', 'What a release is', 'Why rollback matters, and how it works'],
  next:'Level 11 — the practical habits that separate messy repositories from professional ones.'
},

// ============================================================ LEVEL 11
{
  id:'level-11', num:11, title:'Git Best Practices', kicker:'Habits that scale',
  summary:'A highly practical, no-fluff checklist covering commits, branches, PRs, repository hygiene, and — critically — security.',
  lessons:[
    { title:'Commits, branches, and PRs', blocks:[
      {t:'compare', items:[
        {title:'Bad commit message', text:'"changes" / "fixed stuff" — tells future-you nothing about what happened or why.', use:'Never.'},
        {title:'Good commit message', text:'"Add login validation" / "Fix null response handling in API client" — describes the change clearly.', use:'Every commit.'},
      ]},
      {t:'p', text:'Keep commits small and focused on one logical change. A 2,000-line commit titled "misc" is nearly impossible to review or safely revert.'},
      {t:'p', text:'Branch naming — pick a simple, consistent convention: main, feature/*, bugfix/*, hotfix/*. Example names: feature/login-page, feature/payment-api, bugfix/order-total, hotfix/auth-timeout.'},
      {t:'p', text:'For most teams, this simple convention is enough. Avoid adopting an elaborate branching model (like full Git Flow with dozens of long-lived branch types) unless your project genuinely needs that complexity — it usually just adds overhead.'},
      {t:'p', text:'Pull Request habits: keep PRs small, write a clear title, explain why (not just what) in the description, add screenshots for visual changes, link the related issue, and respond to review comments instead of ignoring them.'},
    ]},
    { title:'Repository hygiene and security', blocks:[
      {t:'p', text:'A healthy repository usually includes: a README explaining what the project is and how to run it, a .gitignore listing files Git should never track, a CONTRIBUTING.md if others will submit changes, and a LICENSE if the project is public.'},
      {t:'widget', name:'gitignoreWidget'},
      {t:'mistake', text:'CRITICAL SECURITY RULE — Never commit passwords, API keys, access tokens, or production secrets. Example of what NOT to put in a tracked file: API_KEY=123456789. Use environment variables and a secret manager instead — they stay out of your Git history entirely.'},
      {t:'svg', caption:'Where secrets should actually live', html:`
        <div class="flow">
          <div class="step">Environment Variables</div><div class="arrow">↓</div>
          <div class="step">Secret Manager</div><div class="arrow">↓</div>
          <div class="step hl">Application (at runtime)</div>
        </div>`},
      {t:'p', text:'Important: if a secret is accidentally committed, simply deleting it from the latest version of the file is NOT enough. Git keeps full history — that secret still exists in an old commit and can be found there. Recovering from a leaked secret means rotating (changing) the actual credential, and separately, scrubbing it from history if required.'},
      {t:'bestpractice', text:'Treat any committed secret as compromised the moment it\'s pushed, even briefly. Rotate it immediately rather than assuming a quick fix or a force-push fully erased it everywhere.'},
      {t:'quiz', questions:[
        { q:'You accidentally committed and pushed an API key, then deleted it in your next commit. Is the key still safe?', options:['Yes, deleting it fixed everything','No — it still exists in the earlier commit\'s history and should be rotated','Yes, as long as you didn\'t push again','No, but only for 24 hours'], correct:1,
          explain:'Git keeps full history by default. The key is still retrievable from the old commit. The only safe response is to rotate (invalidate and replace) the actual credential.' },
      ]},
    ]},
  ],
  learned:['Writing meaningful commits and small PRs', 'Simple branch naming that scales', 'Why leaked secrets need rotation, not just deletion'],
  next:'Level 12 — put every concept together in one realistic, end-to-end developer workflow.'
},

// ============================================================ LEVEL 12
{
  id:'level-12', num:12, title:'Real-World Developer Workflow', kicker:'Everything, end to end',
  summary:'One continuous, interactive walkthrough connecting every concept from this book into a single realistic task, followed by the final capstone challenge.',
  lessons:[
    { title:'The complete journey', blocks:[
      {t:'svg', caption:'From an assigned issue to production', html:`
        <div class="flow">
          <div class="step">Issue assigned</div><div class="arrow">↓</div>
          <div class="step">Pull latest main</div><div class="arrow">↓</div>
          <div class="step">Create branch feature/login</div><div class="arrow">↓</div>
          <div class="step">Write code</div><div class="arrow">↓</div>
          <div class="step">Run local tests</div><div class="arrow">↓</div>
          <div class="step">git status → git add → git commit → git push</div><div class="arrow">↓</div>
          <div class="step">Open Pull Request</div><div class="arrow">↓</div>
          <div class="step">CI pipeline runs</div><div class="arrow">↓</div>
          <div class="step">Code review — changes requested</div><div class="arrow">↓</div>
          <div class="step">Push update → CI runs again</div><div class="arrow">↓</div>
          <div class="step">Approved → Merge</div><div class="arrow">↓</div>
          <div class="step">Deploy to Staging → Smoke tests</div><div class="arrow">↓</div>
          <div class="step hl">Deploy to Production</div>
        </div>`},
      {t:'p', text:'Every arrow in that diagram is something you\'ve now learned individually. This is simply all of it, in the order a professional developer actually experiences it, dozens of times a week.'},
    ]},
    { title:'Capstone: FAi Login Service', blocks:[
      {t:'p', text:'Time to prove it. You\'re assigned a real-feeling task: add email validation to the login API of a fictional project, "FAi Login Service". You\'ll make the decisions at each step — choosing wrong will explain exactly why, without penalty.'},
      {t:'widget', name:'capstone'},
    ]},
  ],
  learned:['The complete Laptop → Production journey, as one picture', 'How every level connects to the next', 'Hands-on practice making the real workflow decisions yourself'],
  next:'Try the Final Knowledge Check, browse the Command Cheat Sheet, or explore the Practice Lab.'
},
];

// ============================================================ GLOSSARY
const GLOSSARY = [
  {term:'Artifact', def:'A packaged, ready-to-run file (or set of files) produced by a build step in a pipeline.', analogy:'A sealed box of furniture, packed and ready to ship.', related:['Build','Deploy','Pipeline']},
  {term:'Branch', def:'A lightweight, movable pointer to a commit, allowing isolated work that doesn\'t affect other branches until merged.', analogy:'A side road off the main road.', related:['Merge','main','Commit']},
  {term:'Build', def:'The process of transforming source code into a runnable form — compiling, bundling, etc.', analogy:'Cooking raw ingredients into a finished dish.', related:['Artifact','CI']},
  {term:'CD (Continuous Delivery/Deployment)', def:'Automatically preparing (Delivery) or directly shipping (Deployment) verified code to an environment.', analogy:'The delivery truck that ships the tested dish to the restaurant floor.', related:['CI','Pipeline','Deploy']},
  {term:'CI (Continuous Integration)', def:'Automatically building and testing code every time it changes, to catch problems immediately.', analogy:'A quality inspector checking every batch the moment it\'s made.', related:['CD','Pipeline','Test']},
  {term:'Clone', def:'Downloading a full copy of a remote repository, including its history, onto your computer.', analogy:'Photocopying an entire notebook, not just the last page.', related:['Repository','Remote','origin']},
  {term:'Code Review', def:'The process of a teammate examining your proposed change before it\'s merged.', analogy:'A second pair of eyes proofreading before publishing.', related:['Pull Request','Merge']},
  {term:'Commit', def:'A saved, permanent snapshot of staged changes in your local repository\'s history, with a message describing it.', analogy:'A labeled save point in a video game.', related:['Staging Area','git log']},
  {term:'Conflict', def:'What happens when two branches change the same lines of the same file differently, and Git can\'t auto-merge them.', analogy:'Two editors changing the same sentence in different ways.', related:['Merge']},
  {term:'Deploy', def:'Placing a built artifact onto a server so it starts running and becomes reachable.', analogy:'Actually opening the restaurant doors with the new dish on the menu.', related:['Environment','Rollback']},
  {term:'Environment', def:'A distinct place code can run — Development, Staging, Production — often with different configuration.', analogy:'Test kitchen vs the real restaurant kitchen.', related:['Staging','Production','Secret']},
  {term:'Fetch', def:'Downloading new information from a remote repository without changing your working files.', analogy:'Reading the news without acting on it yet.', related:['Pull','Remote']},
  {term:'Fork', def:'Creating your own copy of someone else\'s GitHub repository, under your own account.', analogy:'Taking a copy of someone\'s recipe book to experiment with your own version.', related:['Clone','Pull Request']},
  {term:'Git', def:'A free program that tracks the history of a project folder on your computer.', analogy:'A very disciplined save system.', related:['Repository','Commit']},
  {term:'GitHub', def:'A website that hosts Git repositories online and adds collaboration tools like Pull Requests.', analogy:'A shared cloud home for Git notebooks.', related:['Git','Repository','Pull Request']},
  {term:'Merge', def:'Combining the history of one branch into another.', analogy:'A side road rejoining the main road.', related:['Branch','Conflict','Rebase']},
  {term:'origin', def:'The conventional name given to a repository\'s primary remote.', analogy:'The default mailing address you send updates to.', related:['Remote','Push']},
  {term:'Pipeline', def:'A defined, ordered sequence of automated steps (build, test, deploy) that runs on code changes.', analogy:'A factory assembly line.', related:['Workflow','Job','Step','Runner']},
  {term:'Production', def:'The live environment real users actually use.', analogy:'The restaurant floor, serving real customers.', related:['Staging','Environment','Rollback']},
  {term:'Pull', def:'Downloading remote changes and immediately merging them into your current branch.', analogy:'Reading the news and updating your plans based on it, right away.', related:['Fetch','Push']},
  {term:'Pull Request', def:'A GitHub feature proposing to merge one branch into another, with review and discussion attached.', analogy:'Submitting a draft for editorial review before publishing.', related:['Code Review','Merge']},
  {term:'Push', def:'Uploading local commits to a remote repository.', analogy:'Mailing your latest notebook pages to a shared archive.', related:['origin','Pull']},
  {term:'Rebase', def:'Rewriting a branch\'s history to sit on top of another branch\'s latest commits, producing a cleaner, linear history.', analogy:'Re-laying a side road so it starts from the newest point of the main road, instead of an old one.', related:['Merge']},
  {term:'Remote', def:'A saved address pointing to a Git repository hosted elsewhere, usually on GitHub.', analogy:'A saved mailing address.', related:['origin','GitHub']},
  {term:'Repository', def:'A project folder whose history is tracked by Git.', analogy:'A project notebook that remembers every important version of your work.', related:['Git', 'Commit']},
  {term:'Reset', def:'Moves your current branch pointer to a different commit, optionally discarding history after that point.', analogy:'Tearing out recent pages of the notebook.', related:['Revert']},
  {term:'Revert', def:'Creates a NEW commit that undoes the changes of a previous commit, without erasing history.', analogy:'Writing a correction note on a new page, rather than tearing an old page out.', related:['Reset']},
  {term:'Rollback', def:'Replacing a broken live deployment with the last known-good version.', analogy:'Sending back a bad dish and re-serving yesterday\'s reliable one.', related:['Deploy','Release']},
  {term:'Runner', def:'The machine that actually executes a CI/CD pipeline\'s jobs.', analogy:'The factory worker running the assembly line steps.', related:['Pipeline','Job']},
  {term:'Secret', def:'A sensitive value (password, API key, token) that should never be committed to source code.', analogy:'A key kept in a safe, not written on the front door.', related:['Environment Variable']},
  {term:'Environment Variable', def:'A named configuration value provided to an application at runtime, outside its source code.', analogy:'A sticky note with today\'s settings, handed to the app when it starts.', related:['Secret','Environment']},
  {term:'Staging', def:'A near-identical copy of production used to verify changes before real users see them.', analogy:'The test kitchen, right before the real dinner service.', related:['Production','Environment']},
  {term:'Staging Area', def:'Where changes wait after git add, marked to be included in the next commit.', analogy:'The doorway where you\'ve set aside items ready to bring into the house.', related:['git add','Commit']},
  {term:'Workflow', def:'GitHub Actions\' name for a defined pipeline (a YAML file describing jobs and steps).', analogy:'The written recipe the factory line follows.', related:['Pipeline','Job']},
];

// ============================================================ CHEAT SHEET
const CHEATSHEET = [
  {cmd:'git --version', what:'Shows your installed Git version.', when:'Confirming Git is installed.', example:'git --version', changes:'Nothing.', mistake:'Confusing this with checking your project\'s version.', risk:'low', related:['git config']},
  {cmd:'git config', what:'Sets configuration like your name and email for commits.', when:'One-time setup per computer.', example:'git config --global user.name "Ada"', changes:'Global or local Git settings.', mistake:'Forgetting --global and having to repeat it per repository.', risk:'low', related:['git init']},
  {cmd:'git init', what:'Turns a folder into a Git repository by creating a .git folder.', when:'Starting a brand-new project.', example:'git init', changes:'Creates .git/ in the current folder.', mistake:'Running it inside an already-tracked folder unintentionally.', risk:'low', related:['git clone']},
  {cmd:'git clone', what:'Downloads a full remote repository, with history, to your computer.', when:'Starting work on an existing project.', example:'git clone https://github.com/you/app.git', changes:'Creates a new local folder with full history.', mistake:'Cloning into a folder that already has unrelated files.', risk:'low', related:['git remote']},
  {cmd:'git status', what:'Shows the state of your working directory and staging area.', when:'Constantly — your main map.', example:'git status', changes:'Nothing — read-only.', mistake:'Not running it often enough.', risk:'low', related:['git diff']},
  {cmd:'git add', what:'Moves changes from the working directory into the staging area.', when:'Before committing.', example:'git add login.js', changes:'Staging area only.', mistake:'Thinking it uploads the file to GitHub — it does not.', risk:'low', related:['git commit','git restore']},
  {cmd:'git commit', what:'Saves staged changes as a permanent snapshot in local history.', when:'After staging a logical, complete change.', example:'git commit -m "Add login validation"', changes:'Local repository history.', mistake:'Committing without a clear, descriptive message.', risk:'low', related:['git push']},
  {cmd:'git log', what:'Shows the commit history of the current branch.', when:'Reviewing what happened, and when.', example:'git log --oneline', changes:'Nothing — read-only.', mistake:'Expecting it to show uncommitted changes.', risk:'low', related:['git show']},
  {cmd:'git diff', what:'Shows the exact line-by-line differences in unstaged changes.', when:'Before staging, to review exactly what you changed.', example:'git diff login.js', changes:'Nothing — read-only.', mistake:'Forgetting git diff --staged shows staged changes instead.', risk:'low', related:['git status']},
  {cmd:'git branch', what:'Lists, creates, or deletes branches.', when:'Managing parallel lines of work.', example:'git branch feature/login', changes:'Adds/removes a branch pointer.', mistake:'Forgetting this alone does not switch you to the new branch.', risk:'low', related:['git switch']},
  {cmd:'git switch', what:'Switches your working directory to a different branch. Modern replacement for one job of git checkout.', when:'Moving between branches.', example:'git switch -c feature/login', changes:'Working directory + current branch pointer.', mistake:'Switching with uncommitted changes that conflict — commit or stash first.', risk:'med', related:['git branch','git restore']},
  {cmd:'git checkout', what:'Older, multi-purpose command that can switch branches or restore files. Still works, but ambiguous.', when:'Older tutorials; modern Git prefers switch/restore.', example:'git checkout feature/login', changes:'Depends on usage — branch or files.', mistake:'Using it and being unsure whether it will touch files or branches.', risk:'med', related:['git switch','git restore']},
  {cmd:'git merge', what:'Combines another branch\'s history into your current branch.', when:'Bringing a finished feature branch into main.', example:'git merge feature/login', changes:'Current branch history, possibly a new merge commit.', mistake:'Merging into the wrong branch by forgetting to check out the target first.', risk:'med', related:['git branch -d']},
  {cmd:'git rebase', what:'Rewrites a branch\'s commits to sit on top of another branch\'s latest history.', when:'Wanting a clean, linear history — with care.', example:'git rebase main', changes:'Rewrites commit history on the current branch.', mistake:'Rebasing commits that have already been pushed and shared with others.', risk:'high', related:['git merge']},
  {cmd:'git remote', what:'Manages saved connections (remotes) to other repositories.', when:'Connecting a local repo to GitHub.', example:'git remote add origin <url>', changes:'Local repository configuration only.', mistake:'Assuming "origin" is a special reserved word rather than just a convention.', risk:'low', related:['git push','git pull']},
  {cmd:'git fetch', what:'Downloads remote history without merging it into your files.', when:'Checking what changed remotely, safely.', example:'git fetch origin', changes:'Local knowledge of the remote only.', mistake:'Expecting your files to update — they don\'t, until you merge/pull.', risk:'low', related:['git pull']},
  {cmd:'git pull', what:'Fetches and immediately merges remote changes into your current branch.', when:'Getting fully up to date quickly.', example:'git pull', changes:'Working files + local history.', mistake:'Pulling with uncommitted conflicting changes and getting stuck mid-merge.', risk:'med', related:['git fetch','git push']},
  {cmd:'git push', what:'Uploads local commits to a remote repository.', when:'Sharing your committed work.', example:'git push origin feature/login', changes:'The remote repository (GitHub).', mistake:'Force-pushing over history other people are already using.', risk:'med', related:['git pull']},
  {cmd:'git restore', what:'Restores files to a previous state, discarding local changes to them. Modern replacement for the other job of git checkout.', when:'Undoing edits to a specific file.', example:'git restore login.js', changes:'Working directory (or staging area with --staged).', mistake:'Not realizing unstaged local edits are permanently lost after this.', risk:'high', related:['git switch']},
  {cmd:'git reset', what:'Moves the current branch pointer to a different commit, optionally discarding history/staging after it.', when:'Undoing local commits that haven\'t been shared yet.', example:'git reset --soft HEAD~1', changes:'Branch pointer, staging area, and optionally working files.', mistake:'Using --hard and permanently losing uncommitted work.', risk:'high', related:['git revert']},
  {cmd:'git revert', what:'Creates a new commit that undoes a previous commit, without erasing history.', when:'Undoing a commit that\'s already been pushed/shared.', example:'git revert abc1234', changes:'Adds a new commit; history stays intact.', mistake:'Reaching for reset instead, on commits others already have.', risk:'low', related:['git reset']},
  {cmd:'git stash', what:'Temporarily shelves uncommitted changes so you can switch context cleanly.', when:'Needing to switch branches without committing half-done work.', example:'git stash', changes:'Working directory is cleaned; changes saved in a stash list.', mistake:'Forgetting you have stashed changes and losing track of them.', risk:'low', related:['git stash pop']},
  {cmd:'git tag', what:'Labels a specific commit, usually to mark a release.', when:'Marking version milestones like v1.0.0.', example:'git tag v1.0.0', changes:'Adds a named pointer to a commit.', mistake:'Confusing tags with branches — tags don\'t move forward.', risk:'low', related:['git show']},
  {cmd:'git show', what:'Displays details about a specific commit, including its diff.', when:'Inspecting exactly what one commit changed.', example:'git show abc1234', changes:'Nothing — read-only.', mistake:'Confusing it with git log, which lists many commits rather than detailing one.', risk:'low', related:['git log']},
  {cmd:'git rm', what:'Removes a file from both the working directory and Git tracking.', when:'Deleting a tracked file properly.', example:'git rm old-file.js', changes:'Working directory + staging area.', mistake:'Using the OS delete key alone, which leaves Git confused about the file\'s status.', risk:'med', related:['git mv']},
  {cmd:'git mv', what:'Renames or moves a tracked file, updating Git\'s tracking in one step.', when:'Renaming files that are already tracked.', example:'git mv old.js new.js', changes:'Working directory + staging area.', mistake:'Renaming via the file system directly, which Git sees as a delete + a new untracked file.', risk:'low', related:['git rm']},
];

// ============================================================ REAL WORLD SCENARIOS
const SCENARIOS = [
  {problem:'I accidentally changed the wrong file.', happening:'A file in your working directory has unwanted edits that haven\'t been staged or committed yet.', do:'Discard the changes to just that file, restoring it to its last committed version.', cmd:'git restore wrong-file.js', why:'restore only touches the working directory copy of that one file — everything else is untouched.', best:'Always check git status before restoring, so you don\'t accidentally discard the wrong file.'},
  {problem:'I committed something but haven\'t pushed it.', happening:'The commit only exists in your local history — nobody else can see it yet.', do:'You can safely undo or edit it since it hasn\'t been shared.', cmd:'git reset --soft HEAD~1', why:'This undoes the last local commit but keeps your changes staged, ready to redo properly. Safe because nothing has been pushed.', best:'Prefer reset for local-only mistakes; switch to revert once something is pushed.'},
  {problem:'I pushed code and CI failed.', happening:'Your pipeline ran your tests/build automatically and one step failed.', do:'Open the pipeline logs, find the failing step, fix the issue locally, then commit and push again.', cmd:'git add . && git commit -m "Fix failing test" && git push', why:'CI re-runs automatically on every new push to the same branch/PR.', best:'Run tests locally before pushing, so CI failures become rare, not routine.'},
  {problem:'My branch is behind main.', happening:'main has moved forward with other people\'s merged work since you created your branch.', do:'Bring those new commits into your branch before continuing.', cmd:'git pull origin main', why:'Keeps your branch close to main, reducing the size of any eventual conflict.', best:'Do this often, not just right before opening a PR.'},
  {problem:'I have a merge conflict.', happening:'Two branches changed the same lines differently, and Git needs your decision.', do:'Open the conflicted file, read both versions between the markers, choose the correct final code, remove the markers, then stage and commit.', cmd:'git add resolved-file.js && git commit', why:'This tells Git exactly which lines to keep and finalizes the merge.', best:'Resolve conflicts calmly, line by line — never delete a whole side without reading it.'},
  {problem:'I accidentally committed an API key.', happening:'A secret is now stored in your Git history, even if you later delete it from the file.', do:'Immediately rotate (invalidate and replace) the real credential — this matters more than cleaning history.', cmd:'(rotate the key in your provider\'s dashboard, then remove it from the file)', why:'Deleting the line in a new commit does not remove it from earlier commits in history.', best:'Use a .gitignore and environment variables so secrets are never in a trackable file to begin with.'},
  {problem:'I need to undo a commit.', happening:'A commit turned out to be wrong, and it may already be shared with others.', do:'If unshared, reset. If already pushed/shared, revert instead.', cmd:'git revert abc1234', why:'revert adds a new "undo" commit without rewriting history that others may already have — much safer for shared work.', best:'Default to revert once code has left your machine.'},
  {problem:'I need to temporarily save my work.', happening:'You need to switch branches or pull updates, but you\'re not ready to commit your current changes.', do:'Shelve your uncommitted changes temporarily, then bring them back later.', cmd:'git stash', why:'Cleans your working directory without losing anything, so you can switch context freely.', best:'Use git stash pop to bring the changes back, and don\'t let stashes pile up unnoticed.'},
  {problem:'Another developer changed the same file.', happening:'Both of you edited overlapping parts of a file on different branches.', do:'Pull their changes, resolve any conflict, and communicate with them if the intent is unclear.', cmd:'git pull', why:'Merging (possibly with a conflict) is how Git reconciles two people\'s work on the same file.', best:'Small, frequent commits and pulls reduce how often this becomes a real conflict.'},
  {problem:'My production deployment failed.', happening:'The latest deployed version is broken for real users.', do:'Roll back immediately to the last known-good release, then investigate the root cause separately.', cmd:'(trigger your platform\'s rollback / redeploy the previous release)', why:'Restoring stability for users comes first; a calm root-cause fix can happen right after.', best:'Always know your rollback process before you need it under pressure.'},
];

// ============================================================ FINAL QUIZ (20 questions, tagged by topic for weak-area review)
const FINAL_QUIZ = [
  {topic:'level-0', q:'What is the core problem Git solves?', options:['Slow internet','Tracking changes without duplicating whole project folders','Making code run faster','Choosing a programming language'], correct:1},
  {topic:'level-0', q:'Which statement is true?', options:['Git and GitHub are the same thing','Git is a tool; GitHub is a website that hosts Git repositories','GitHub replaced Git in 2020','You need GitHub to use Git'], correct:1},
  {topic:'level-1', q:'What does git add do?', options:['Uploads a file to GitHub','Moves a change into the staging area','Deletes a file','Creates a new branch'], correct:1},
  {topic:'level-1', q:'What does git commit do?', options:['Saves staged changes as a permanent local snapshot','Sends code to GitHub','Deletes the staging area permanently','Creates a remote repository'], correct:0},
  {topic:'level-1', q:'What creates the hidden .git folder?', options:['git status','git init','git commit','git clone'], correct:1},
  {topic:'level-2', q:'What does git clone do?', options:['Creates an empty repository','Downloads a full remote repository including history','Deletes a remote repository','Only downloads the latest file'], correct:1},
  {topic:'level-2', q:'What is the key difference between fetch and pull?', options:['They are identical','fetch downloads info only; pull downloads and merges into your files','pull is read-only; fetch changes files','fetch only works on GitHub'], correct:1},
  {topic:'level-2', q:'By convention, what is a repository\'s main remote usually named?', options:['main','master','origin','root'], correct:2},
  {topic:'level-3', q:'What is a Git branch, technically?', options:['A full duplicate of the project folder','A lightweight pointer to a commit','A separate GitHub account','A type of commit message'], correct:1},
  {topic:'level-3', q:'Which command does modern Git recommend for switching branches?', options:['git checkout','git switch','git branch','git merge'], correct:1},
  {topic:'level-4', q:'Correct order of the daily pipeline:', options:['commit → add → push → edit','edit → add → commit → push','push → edit → add → commit','add → edit → push → commit'], correct:1},
  {topic:'level-5', q:'What is a Pull Request, relative to a branch?', options:['A different name for the same thing','A proposal to merge a branch, with review attached','A type of commit','A GitHub-only branch type'], correct:1},
  {topic:'level-5', q:'A reviewer requests changes on your PR. What should you do?', options:['Close it and start over','Push new commits to the same branch — the PR updates itself','Delete the branch','Ignore the feedback and merge anyway'], correct:1},
  {topic:'level-6', q:'Why does a merge conflict happen?', options:['A network error','Two branches changed the same lines differently','You forgot to git push','Git ran out of memory'], correct:1},
  {topic:'level-6', q:'What is a fast-forward merge?', options:['A merge that skips testing','main hasn\'t moved, so its pointer just slides forward to your latest commit','A merge that deletes history','A merge that always creates a conflict'], correct:1},
  {topic:'level-7', q:'What does a "protected branch" prevent?', options:['Anyone from reading the branch','Direct pushes, requiring PRs with review/checks instead','Branches from being created','Commits from having messages'], correct:1},
  {topic:'level-8', q:'What usually differs most between staging and production?', options:['The programming language used','Configuration, like API endpoints and secrets','The company that owns them','Nothing at all'], correct:1},
  {topic:'level-9', q:'What does CI (Continuous Integration) mainly do?', options:['Deploys code straight to users','Automatically builds and tests code on every change','Writes commit messages for you','Deletes old branches'], correct:1},
  {topic:'level-9', q:'If the TEST stage of a pipeline fails, what should typically happen next?', options:['DEPLOY runs anyway','DEPLOY is blocked','The pipeline restarts from BUILD infinitely','Nothing — failures are ignored'], correct:1},
  {topic:'level-10', q:'What is a rollback?', options:['Undoing a commit locally','Replacing a broken live deployment with the last known-good version','Deleting a branch','Renaming a repository'], correct:1},
  {topic:'level-11', q:'If you accidentally commit and push a secret, then delete it in the next commit, is it safe?', options:['Yes, deletion fixes it','No — it still exists in history; rotate the credential', 'Yes, if you wait 24 hours','No, but only if the repo is public'], correct:1},
  {topic:'level-11', q:'Which commit message is best practice?', options:['"changes"', '"Fix null response handling in API client"', '"stuff"', '"asdf"'], correct:1},
];

// ============================================================ QUICK COMPARISONS (used on comparisons page)
const COMPARISONS = [
  {a:{title:'Git', text:'A tool on your computer that tracks history.'}, b:{title:'GitHub', text:'A website that hosts Git repositories online.'}},
  {a:{title:'Repository', text:'A whole tracked project and its history.'}, b:{title:'Branch', text:'One isolated line of work within a repository.'}},
  {a:{title:'Commit', text:'A saved local snapshot.'}, b:{title:'Push', text:'Uploading commits to a remote.'}},
  {a:{title:'Push', text:'Local → remote.'}, b:{title:'Pull', text:'Remote → local, merged in immediately.'}},
  {a:{title:'Fetch', text:'Downloads remote info only.'}, b:{title:'Pull', text:'Downloads AND merges into your files.'}},
  {a:{title:'Merge', text:'Combines histories, preserving both paths.'}, b:{title:'Rebase', text:'Rewrites history onto a new base, for a linear history.'}},
  {a:{title:'Reset', text:'Moves your branch pointer, can discard history.'}, b:{title:'Revert', text:'Adds a new commit that undoes an old one, safely.'}},
  {a:{title:'Development', text:'Where you build; expected to be unstable.'}, b:{title:'Production', text:'The live app; must be stable.'}},
  {a:{title:'CI', text:'Automatically build & test on every change.'}, b:{title:'CD', text:'Automatically deliver/deploy verified code.'}},
  {a:{title:'Clone', text:'Download an existing repository you have access to.'}, b:{title:'Fork', text:'Create your own GitHub copy of someone else\'s repository.'}},
  {a:{title:'Local', text:'Exists only on your computer.'}, b:{title:'Remote', text:'Hosted elsewhere, e.g. GitHub.'}},
  {a:{title:'Build', text:'Turning source code into a runnable artifact.'}, b:{title:'Deploy', text:'Placing that artifact where users can reach it.'}},
  {a:{title:'Pull Request', text:'A proposal to merge, open for review.'}, b:{title:'Merge', text:'The actual act of combining the branches.'}},
];
