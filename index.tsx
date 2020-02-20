import React = require('react');
import ReactDOM = require('react-dom');
import {
  StateManager,
  stateLinker,
  dictionary
} from '@giveback007/util-lib';

/**
  {
    [id]: dictionary<string>;
    ['name-' + id]: string;
    ['date-' + id]: number;
    ['text-' + id]: string;
  }
*/
// type NoteDict = dictionary<string | number> & {
//   ids: dictionary<string>;
// }

type Note = {
  id: string;
  name: string;
  date: number;
  text: string;
};

// class NoteManager extends StateManager<NoteDict> {

//   addNote(note: Note) {
//     const s = this.getState();
//     const { id } = note;
//     if (s.ids[id])
//       throw 'a note with this id already exists'

//     const ids = { ...s.ids, [id]: id };
//     this.setState({
//       ids: ids as any,
//       ['name-' + id]: note.name,
//       ['date-' + id]: note.date,
//       ['text-' + id]: note.text,
//     })
//   }

//   getNote(id: string) {
//     const s = this.getState();
//     if (!s.ids[id])
//       throw 'note does not exist'

//     return {
//       id: id,
//       name: s['name-id'],
//       date: ,
//       text:,
//     }
//   }
// }

type State = {
  // text: string;
  // doTranslate: boolean;
  // menuOpen: boolean;
  // notes: dictionary<Note>;
  // selectedNote: null | string;
}

// -- STATE/STORE -- //
const initState: State = {
  // text: '',
  // doTranslate: true,
  // menuOpen: false,
  // notes: { },
  // selectedNote: null,
}

const store = new StateManager(initState, {
  id: 'notes',
  // ignoreKeys: [
  //   // 'menuOpen',
  //   // 'doTranslate',
  //   // 'selectedNote'
  // ]
});
const linker = stateLinker(store);

type S = {};
type P = {};

class App extends React.Component<P & State, S> {
  render() {
    return (
      <React.Fragment>
        <div id="menu" className="hide">
          <button>Clear Text</button>
          <br></br>
          <h4>Notes:</h4>
        </div>

        <div
          id="on-menu-block"
          className='hide'
        ></div>

        <div id="buttons">
          <button id="menu-toggle">≡</button>
          <button id="paste">Paste</button>
          <button id="copy">Copy</button>
          <button
            id="translate"
            className='active'
          >Translate</button>
        </div>

        <textarea
          id="text-area"
          spellCheck="false"
        ></textarea>

      </React.Fragment>
    )
  }
}

export const AppComponent = linker(s => s, App);

ReactDOM.render(
  <AppComponent />,
  document.getElementById('app')
);
