const root = document.documentElement;
const fretboard = document.querySelector('.fretboard');
const numberOfFretsSelector = document.querySelector('#number-of-frets');

const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// const instrumentTuningPresets = {
//     'Guitar': [4, 9, 2, 7, 11, 4],
// };

// Alterei para ser fixo com a guitarra, já que imagino que não trabalharemos com os outros instrumentos
const TuningPresets = [4, 9, 2, 7, 11, 4];
let numberOfFrets = 6;
let numberOfStrings = 6

// let selectedInstrument = 'Guitar';
// let numberOfStrings = instrumentTuningPresets[selectedInstrument].length//não sei pq mas quando eu mexi aqui explodiu td

let notesPress = []// adicionar notas precionadas aqui

window.notesPress = notesPress;

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

                let noteName = this.generateNoteNames((fret + TuningPresets[i]));
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
    },
    teste() {
        alert('teste')
    }
}

const handlers = {
    showNoteDot(event) {//desenha as notas sobre as cordas
        if (event.target.classList.contains('note-fret')) {
            event.target.style.setProperty('--noteDotOpacity', 1);
        }
    },
    hideNoteDot(event) { //deleta as notas apos o mouse sair
        if (notesPress.includes(event.target.dataset.stringfret))
            return
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
            let notecordenate = event.target.dataset.stringfret
            //alert(notesPress.contains(notecordenate))
            if (notesPress.includes(notecordenate)) {
                noteIndex = notesPress.indexOf(notecordenate)
                notesPress.splice(noteIndex, 1)
            } else {
                notesPress.push(notecordenate)
                //alert(notesPress)
            }
            //alert(event.target.dataset.stringfret)//só pra testar o retorno
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
function generateStringFret(string, fret) {
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
//timer
// function startTimer(duration, display) {
//     var timer = duration, minutes, seconds;
//     setInterval(function () {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);
//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;
//         display.textContent = minutes + ":" + seconds;
//         if (--timer < 0) {
//             timer = duration;
//         }
//     }, 1000);
// }

// window.onload = function () {
//     var duration = 30; // Converter para segundos
//     display = document.querySelector('#timer'); // selecionando o timer
//     startTimer(duration, display); // iniciando o timer
// };


// //chords
// function selectRandomChord() {
//     fetch('chords.json')
//         .then(response => response.json())
//         .then(data => {
//             var chords = data.chords;

//             // Gera um índice aleatório para selecionar um acorde
//             var randomIndex = Math.floor(Math.random() * chords.length);

//             // Obtém o acorde aleatório
//             var randomChord = chords[randomIndex];

//             // Obtém o nome do acorde
//             var chordName = randomChord.name;

//             // Obtém as posições do acorde
//             var chordPositions = randomChord.positions;

//             // Exibe o nome do acorde em um elemento com ID "chords"
//             document.getElementById("chords").textContent = chordName;

//             // Retorna as posições do acorde
//             return chordPositions;
//         })
//         .catch(error => {
//             console.error('Erro ao carregar o arquivo JSON:', error);
//         });
// }
// selectRandomChord()//retorna as posiçãoes das notas

app.init();
