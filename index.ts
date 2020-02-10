import {
  StateManager, snackBar, equal, objKeyVals,
  wait, dictionary
} from '@giveback007/util-lib';

// -- UTILS -- //
const elm = (str) => document.querySelector(str);

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
}).forEach(({ key: oldVal, val: newVal }, i) => {
  translateRegx[i] =
    [new RegExp(oldVal, 'g'), newVal];
  reverseRegx[i] =
    [new RegExp(newVal, 'g'), oldVal];
});

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
const initState = {
	text: '',
	doTranslate: true,
  menuOpen: false,
  notes: { } as dictionary<string>,
}

const store = new StateManager(initState, {
  id: 'notes',
  ignoreKeys: ['menuOpen', 'doTranslate']
});

type State = typeof initState;

// -- INITIALIZER -- //
(() => {
  const dt = new Date();

  const today = 
    `${dt.getDate()}-`  +
    `${dt.getMonth()}-` +
    `${dt.getFullYear()}`;

  (store.getState().notes)
})()



// -- RENDER -- //
store.subscribe(renderOnStateChange)

async function renderOnStateChange(
  s: State,
  prev: State,
) {
  await wait(0);
  
  // s.menuOpen
  if (!equal(s.menuOpen, prev.menuOpen)) {
    const key = s.menuOpen ? 'remove' : 'add';

    elm('#menu').classList[key]('hide');
    elm('#on-menu-block').classList[key]('hide');
  }

  // s.text
  if (
    !equal(s.text, prev.text)
    ||
    !equal(s.doTranslate, prev.doTranslate)
  ) {
    const textArea = elm('#text-area');

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;

    textArea.value =
      translate(s.text, s.doTranslate);
    textArea.setSelectionRange(start, end);

    // s.doTranslate
    if (
      !equal(s.doTranslate, prev.doTranslate)
    ) {
      const doIt = s.doTranslate;
      snackBar(
        doIt ? 'Convert text' : 'Regular text'
      );
      textArea.setAttribute('spellcheck', !doIt);

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
