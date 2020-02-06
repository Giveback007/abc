import { StateManager, arrGen, wait, objKeyVals, dictionary } from '../src/index';
const { log } = console;

const getElm = (str: string) => document.querySelector(str);

const disableElm = (elm: Element, condition: boolean) => {
    if (condition)
        elm.setAttribute('disabled', 'true');
    else
        prev.removeAttribute('disabled');
}

const store = new StateManager({
    perPage: 50,
    charBaseNum: 0,
    text: '',
}, { id: 'main-app-state' });

const textBox = getElm('#text-area') as HTMLInputElement;
(window as any)['textBox'] = textBox;
const table = getElm('#table');
const prev = getElm('#prev');
const next = getElm('#next');

next.addEventListener('click', () => {
    const { charBaseNum, perPage } = store.getState();
    store.setState({ charBaseNum: charBaseNum + perPage })
});

prev.addEventListener('click', () => {
    const { charBaseNum, perPage } = store.getState();
    const n = charBaseNum - perPage;
    store.setState({ charBaseNum: n < 0 ? 0 : n })
});

store.subscribe((charBaseNum) => {
    disableElm(prev, !charBaseNum);

    table.innerHTML = '';
    arrGen(store.getState().perPage).forEach((x, i) => {
        const n = charBaseNum + i + 1;

        table.innerHTML +=
            `<div class="item">
                <span class="number">${n}</span>
                <div class="character">
                    <span>${String.fromCharCode(n)}</span>
                </div>
            </div>`
    });
}, 'charBaseNum');

store.subscribe((text) => {
    if (text === textBox.value) return;
    const { selectionStart, selectionEnd } = textBox;

    textBox.value = text;
    textBox.setSelectionRange(selectionStart, selectionEnd);
}, 'text')

const convertText = (text: string, keys: dictionary<string>) => {
    const regxArr: [RegExp, string][] = objKeyVals(keys)
        .map(({ key: oldVal, val: newVal}) => [new RegExp(oldVal, 'g'), newVal]);

    let newText = text;
    regxArr.forEach((([regx, newVal]) => newText = newText.replace(regx, newVal)));

    return newText;
}

textBox.addEventListener('keydown', async (e) => {
    await wait(0); // allow view to update first
    const inpElm = e.target;

    if (!(
        inpElm instanceof HTMLInputElement
        ||
        inpElm instanceof HTMLTextAreaElement
    )) return;


    const cursorStart = inpElm.selectionStart;
    const cursorEnd = inpElm.selectionEnd;

    const keys = {
        E: '7',
        T: '𝘓',
        A: 'Ր', // changed
        O: 'Ḷ',
        I: 'Λ',
        // N: 'Γ', // changed
        // S: 'Ɔ', // changed
        // R: 'Ƨ', // changed
        // H: 'Ϫ', // changed
        L: 'Ѧ',
        F: 'Π',
        G: 'Ͷ',
        Y: 'Δ',
    };

    let newText = convertText(inpElm.value.toUpperCase(), keys);
    store.setState({ text: newText })
})
