(function() {
const root = document.documentElement;
const fretboard = document.querySelector('.fretboard');
const numberOfFretsSelector = document.querySelector('#number-of-frets');

const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const instrumentTuningPresets = {
    'Guitar': [4, 9, 2, 7, 11, 4],
};

let numberOfFrets = 12;//numero de trastes isso na verdade dá 10 casas ainda não sei pq
let selectedInstrument = 'Guitar';
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length//não sei pq mas quando eu mexi aqui explodiu td

let notesPress = []// adicionar notas precionadas aqui


const app = {
    init() {
     this.setupFretboard();//inicia as escalas
     //this.setupNoteNameSection(); //esse cara são as notas lá de baixo nem sei pq isso existe até agr apaguei
     handlers.setupEventListeners();
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        root.style.setProperty('--number-of-strings', numberOfStrings);
        // Add strings to fretboard
        for (let i = 0; i < numberOfStrings; i++) {//cria n cordas
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);
         
            // cria n fret(trastes) 
            for (let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);
                
                let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]));
                noteFret.setAttribute('data-note', noteName);//aqui q ta a magica esse fret ai é a casa
                noteFret.setAttribute('data-stringfret', generateStringFret(i, fret));//adiciona padrão corda-traste
                
                // cria traste uma bolinha 3 5 7 9 ...
                if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add('single-fretmark');
                }
                //cria duas bolinhas 12 24 deixar aqui só se for usar 12 casas tirar os desnecessarios dps
                if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                    let doubleFretMark = tools.createElement('div');
                    doubleFretMark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretMark);
                }

            }
        }
        allNotes = document.querySelectorAll('.note-fret');//não sei oq isso faz mas faz coisas certamente 
        //cara creio q isso tem algo haver com o modo q deixava as letras marcadas talvez seja util descobrir como isso funciona
    },
    generateNoteNames(noteIndex) {//gera o nome das notas quando passa o mouse em cima 
        noteIndex = noteIndex % 12;
        return notesSharp[noteIndex];
    }
}

const handlers = {
    showNoteDot(event) {//desenha as notas sobre as cordas
        if (event.target.classList.contains('note-fret')) {
            event.target.style.setProperty('--noteDotOpacity', 1);
        }
    },
    hideNoteDot(event) { //deleta as notas apos o mouse sair
        event.target.style.setProperty('--noteDotOpacity', 0);        
    },
    setAccidentals(event) {//sinto q este cara é inutil mas deixa ele por enquanto
        if (event.target.classList.contains('acc-select')) {
            accidentals = event.target.value;
            app.setupFretboard();
            app.setupNoteNameSection();
        } else {
            return;
        }
    },
    clickNoteDot(event) {
        if (event.target.classList.contains('note-fret')) {
            alert(event.target.dataset.stringfret)
        }
    },

    setupEventListeners() {
        fretboard.addEventListener('mouseover', this.showNoteDot);
        fretboard.addEventListener('click', this.clickNoteDot);
        fretboard.addEventListener('mouseout', this.hideNoteDot);
        numberOfFretsSelector.addEventListener('change', this.setNumberOfFrets);        
    }
}

//funçoes de manipulação talvez seja educado colocar em outro arquivo
function numberString(n) {
    const strings = [6, 5, 4, 3, 2, 1];
    return strings[n];
}
function generateStringFret(string, fret){
    return ' ' + numberString(string) + '-' + fret;
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}


app.init();
})();
