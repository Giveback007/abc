import { snackBar } from '@giveback007/util-lib/dist/browser';
const objEntries = (obj) => Object.keys(obj).map((key) => [key, obj[key]]);
const getElm = (str) => document.querySelector(str);

const forwardKeys = {
	E: '7',
	T: '𝘓',
	// A: 'Ր', // changed
	// O: 'Ḷ',
	I: 'Λ',
	// N: 'Γ', // changed
	// S: 'Ɔ', // changed
	// R: 'Ƨ', // changed
	// H: 'Ϫ', // changed
	L: 'Ѧ',
	// F: 'Π',
	G: 'Ͷ',
	Y: 'Δ',
}

const state = {
	text: localStorage.getItem('text') || '',
	forwardKeys,
	reverseKeys: objEntries(forwardKeys).reduce((obj, [key, val]) => {
		obj[val] = key;
		return obj;
	}, { }),
	translate: true,
	menuOpen: false,
	activelyCopy: false,
}

// do differently
const textBox = getElm('#text-area');
textBox.value = state.text;
// do differently

const clearText = () => {
	toggleMenu(false);
	
	const bool = confirm('Clear Text?');
	if (bool) {
		snackBar('Cleared');
		textBox.focus();
		abc('');
	}
};
const copyText = () => {
	snackBar('Copied');
	navigator.clipboard.writeText(state.text);
}
const pasteText = () => {
	snackBar('Paste');
	navigator.clipboard.readText().then((text) => abc(text));
}

const toggleTranslate = (doTranslate = !state.translate) => {
	state.translate = doTranslate;
	snackBar(doTranslate ? 'Convert text' : 'Regular text');
	
	textBox.setAttribute('spellcheck', !doTranslate);
	getElm('#translate').classList[doTranslate ? 'add' : 'remove']('active');
	abc();
}

const toggleActiveCopy = (bool = !state.activelyCopy) => {
	// snackBar('works')
	state.activelyCopy = bool;
	const activeCopy = getElm('#active-copy');
	
	snackBar(bool ? 'Copy on write on' : 'Copy on write off')
	activeCopy.classList[bool ? 'add' : 'remove']('active');
	//... ...
}

const toggleMenu = (bool = !state.menuOpen) => {
	state.menuOpen = bool;
	// if (!bool) textBox.focus();
	
	const menu = getElm('#menu');
	const block = getElm('#on-menu-block');
	
	const key = bool ? 'remove' : 'add';
	
	menu.classList[key]('hide');
	block.classList[key]('hide');
}

const abc = (text = textBox.value) => {
	const start = textBox.selectionStart;
	const end = textBox.selectionEnd;
	
	const keys = state[state.translate ? 'forwardKeys' : 'reverseKeys'];
    const regxArr = objEntries(keys)
        .map(([oldVal, newVal]) => [new RegExp(oldVal, 'g'), newVal]);

    let newText = text.toUpperCase();
    regxArr.forEach((([regx, newVal]) => newText = newText.replace(regx, newVal)));

    localStorage.setItem('text', newText);
    textBox.value = state.text = newText;
    navigator.clipboard.writeText(newText);
    
    textBox.setSelectionRange(start, end);
}

snackBar("Write your text");
setTimeout(() => textBox.focus(), 100);

textBox.addEventListener('input', () => setTimeout(abc, 0));
getElm('#clear')		.addEventListener('click', clearText);
getElm('#paste')		.addEventListener('click', pasteText);
getElm('#copy')			.addEventListener('click', copyText);
getElm('#translate')	.addEventListener('click', toggleTranslate);
getElm('#menu-toggle')	.addEventListener('click', toggleMenu);
getElm('#on-menu-block').addEventListener('click', toggleMenu);
// getElm('#active-copy').addEventListener('click', ()=> toggleActiveCopy());