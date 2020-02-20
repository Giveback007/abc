import {
    StateManager, snackBar, equal, objKeyVals,
    wait, dictionary, uiid, objVals, arrGen,
    objKeys,
  } from '@giveback007/util-lib';

function old() {
    // -- UTILS -- //
    const elm = (str) =>
      document.querySelector(str);
    
    (window as any).x = elm('#notes');
    
    const stateDidChange =
      (state: State, prev: State) =>
        (key: keyof State) =>
          !equal(state[key], prev[key]);
    
    const wZ = (n: number) => ('0' + n).slice(-2);
    
    const dt = new Date();
    const dd = dt.getDate();
    const mm = dt.getMonth() + 1;
    const yy = dt.getFullYear();
    const today = `${wZ(dd)}-${wZ(mm)}-${yy}`;
    
    const translateRegx: [RegExp, string][] = [];
    const reverseRegx: [RegExp, string][] = [];
    
    objKeyVals({
      E: '7',
      T: '𝘓',
      A: 'Ր', // changed
      O: 'Ḷ',
      I: 'Λ',
      N: 'Γ', // changed
      S: 'Ɔ', // changed
      R: 'Ƨ', // changed
      // H: 'Ϫ', // changed
      L: 'Ѧ',
      F: 'Π',
      G: 'Ͷ',
      Y: 'Δ',
    }).forEach(
      ({ key: oldVal, val: newVal }, i) => {
      translateRegx[i] =
        [new RegExp(oldVal, 'g'), newVal];
      reverseRegx[i] =
        [new RegExp(newVal, 'g'), oldVal];
      }
    );
    
    const translate = (
        text: string,
        doTranslate: boolean
    ) => {
      let newText = text;
      (doTranslate ? translateRegx : reverseRegx)
        .forEach(
          (([regx, newVal]) => newText =
            newText.replace(regx, newVal))
        );
    
      return newText;
    }
    
    
    
    // -- STATE/STORE -- //
    const initState: State = {
        text: '',
        doTranslate: true,
      menuOpen: false,
      notes: { },
      selectedNote: null,
    }
    
    const store = new StateManager(initState, {
      id: 'notes',
      ignoreKeys: [
        // 'menuOpen',
        'doTranslate',
        'selectedNote'
      ]
    });
    
    
    // -- INITIALIZER -- //
    (() => {   
      const notes = { ...store.getState().notes };
      let todaysNote = objVals(notes)
        .find((note) => note.name === today);
    
      if (!todaysNote) {
        const id = uiid();
        todaysNote = notes[id] = {
          id, name: today,
          date: Date.now(),
          text: ''
        };
      }
    
      // if (false)
      if (objKeys(notes).length < 2) 
        arrGen(5).forEach((x, i) => {
          const id = uiid();
    
          const name =
            wZ(dd + i + 1) + `-${wZ(mm)}-${yy}`;
    
          const date =
            new Date(yy, mm - 1, dd + i + 1)
              .getTime();
        
          notes[id] = {
            id, name, text: '', date
          }
        });
    
      console.log(notes);
      
    
      store.setState({
        notes,
        selectedNote: todaysNote.id
      });
    })();
    
    
    // -- RENDER -- //
    store.subscribe(renderOnStateChange);
    async function renderOnStateChange(
      s: State,
      prev: State,
    ) {  
      await wait(0);
      const f = stateDidChange(s, prev);
      
      // s.menuOpen
      if (f('menuOpen')) {
        const key = s.menuOpen ? 'remove' : 'add';
    
        elm('#menu').classList[key]('hide');
        elm('#on-menu-block')
          .classList[key]('hide');
      }
    
      // s.notes // s.selectedNote
      if (f('notes') || f('selectedNote')) {
        const notes = elm('#notes');
        notes.innerHTML = '';
    
        const arr = objVals(s.notes)
          .sort((a, b) => b.date - a.date);
    
        arr.forEach(({ name, id }) => {
          const btn = 
            document.createElement('button');
    
          btn.innerText = name;
          btn.setAttribute('id', id);
          btn.setAttribute('name', name);
          if (id === s.selectedNote)
            btn.setAttribute('class', 'active')
    
          notes.appendChild(btn);
        });
    
        if (f('selectedNote')) {
          store.setState({
            text: s.notes[s.selectedNote].text
          });
        }
      }
    
      // s.text
      if (!f('text') || !f('doTranslate')) {
        const textArea = elm('#text-area');
    
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        
        const text =
          translate(s.text, s.doTranslate);
    
        textArea.value = text;
        textArea.setSelectionRange(start, end);
    
        const notes = { ...s.notes };
        notes[s.selectedNote] = {
          ...notes[s.selectedNote], text
        };
    
        store.setState({ notes });
    
        // s.doTranslate
        if (f('doTranslate')) {
          const doIt = s.doTranslate;
          snackBar(
            doIt ? 'Convert text' : 'Regular text'
          );
    
          textArea.setAttribute(
            'spellcheck', !doIt
          );
    
          elm('#translate').classList[
            doIt ? 'add' : 'remove'
          ]('active');
        }
      }
    }
    
    
    // -- ACTIONS -- //
    const clearText = () => {
      if (!confirm('Clear Text?')) return;
    
      snackBar('Cleared');
      elm('#text-area').focus();
      store.setState({ text: '', menuOpen: false });
    }
    
    const copyText = () => {
        snackBar('Copied');
      navigator.clipboard
        .writeText(store.getState().text);
    }
    
    const pasteText = () => {
        snackBar('Paste');
      navigator.clipboard.readText()
        .then((text) => store.setState({ text }));
    }
    
    // -- ELEMENTS & LISTENERS -- //
    const textArea = elm('#text-area');
    
    [
      ['#clear', clearText],
      ['#paste', pasteText],
      ['#copy', copyText],
      ['#translate', () => store.setState({
        doTranslate: !store.getState().doTranslate
      })],
      ['#menu-toggle', ()=> store.setState({
        menuOpen: !store.getState().menuOpen
      })],
      ['#on-menu-block', ()=> store.setState({
        menuOpen: false
      })],
      ['#notes', (e) => {
        const { id } = e.toElement;
        store.setState({ selectedNote: id });
      }]
    ].forEach(([id, f]) =>
      elm(id).addEventListener('click', f)
    );
    
    textArea.addEventListener('input', () =>
      store.setState({
        text: textArea.value.toUpperCase()
      })
    );
    
    snackBar("Write your text");
    setTimeout(() => textArea.focus(), 100);
    }