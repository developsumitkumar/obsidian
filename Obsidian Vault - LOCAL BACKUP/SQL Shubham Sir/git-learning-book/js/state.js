/* ===========================================================
   Progress tracking — localStorage backed, no login required
   =========================================================== */

const STORAGE_KEY = 'gitbook.progress.v1';
const THEME_KEY = 'gitbook.theme.v1';

const State = (() => {
  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return { lessonsDone:{}, quizzesDone:{}, exercisesDone:{}, finalScore:null };
      const parsed = JSON.parse(raw);
      return Object.assign({ lessonsDone:{}, quizzesDone:{}, exercisesDone:{}, finalScore:null }, parsed);
    }catch(e){ return { lessonsDone:{}, quizzesDone:{}, exercisesDone:{}, finalScore:null }; }
  }

  let data = load();

  function save(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }catch(e){ /* ignore quota errors */ }
    document.dispatchEvent(new CustomEvent('progress:changed'));
  }

  return {
    markLessonDone(key){ data.lessonsDone[key] = true; save(); },
    isLessonDone(key){ return !!data.lessonsDone[key]; },
    markQuizDone(key, correct){ data.quizzesDone[key] = { correct: !!correct }; save(); },
    isQuizDone(key){ return !!data.quizzesDone[key]; },
    markExerciseDone(key){ data.exercisesDone[key] = true; save(); },
    isExerciseDone(key){ return !!data.exercisesDone[key]; },
    setFinalScore(score, total, weak){ data.finalScore = { score, total, weak, at: Date.now() }; save(); },
    getFinalScore(){ return data.finalScore; },
    reset(){ data = { lessonsDone:{}, quizzesDone:{}, exercisesDone:{}, finalScore:null }; save(); },
    percentForLevel(level){
      const totalLessons = level.lessons.length;
      let done = 0;
      level.lessons.forEach((lesson, i) => { if(this.isLessonDone(level.id + ':lesson:' + i)) done++; });
      return totalLessons ? Math.round((done/totalLessons)*100) : 0;
    },
    overallPercent(levels){
      let total = 0, done = 0;
      levels.forEach(level => {
        level.lessons.forEach((lesson, i) => {
          total++;
          if(this.isLessonDone(level.id + ':lesson:' + i)) done++;
        });
      });
      return total ? Math.round((done/total)*100) : 0;
    },
    raw(){ return data; }
  };
})();

const Theme = (() => {
  function get(){
    try{ return localStorage.getItem(THEME_KEY) || 'auto'; }catch(e){ return 'auto'; }
  }
  function apply(mode){
    const root = document.documentElement;
    if(mode === 'dark'){ root.setAttribute('data-theme','dark'); }
    else if(mode === 'light'){ root.setAttribute('data-theme','light'); }
    else { root.removeAttribute('data-theme'); }
  }
  function set(mode){
    try{ localStorage.setItem(THEME_KEY, mode); }catch(e){}
    apply(mode);
  }
  function toggle(){
    const current = get();
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveDark = current === 'dark' || (current === 'auto' && prefersDark);
    set(effectiveDark ? 'light' : 'dark');
  }
  apply(get());
  return { get, set, toggle, apply };
})();
