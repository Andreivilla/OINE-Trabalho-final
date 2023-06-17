// Game state controla se o jogo iniciou ou não. É alterado por startGame e EndGame
let gameState = 0;
var chordName, chordPositions;
var timer = timer();

function clearNotes() { window.clearSelectedNotes(); }

//var pointUser = 0, pointChord

function playNote() {
  // Lógica para verificar se o acorde veio corretamente entra aqui 
  // Vai precisar de uma forma de verificar os elementos HTML selecionados em fretboard
  let notesPressed = window.notesPress;

  if (verifChord(chordPositions, notesPressed)) {
    calculatePoints()
    //zera o timer e escolhe outro acorde
    timer.resetTimer()
    selectRandomChord()
    //window.notesPress = []
    //alert(window.notesPress)
  }

  clearNotes();
}

//sistema pontos
function calculatePoints() {
  let time = getTimerValue();
  let timelose = pointTime(time)

  setScoreValue(10 - timelose)
}

function ToggleScoreDiv() {
  const scoreContainer = document.getElementById('save-score');
  const children = scoreContainer.children;
  let setVal = gameState === 1 ? true : false;

  for (let i = 0; i < children.length; i++) {
    children[i].hidden = setVal;
  }

}

//retorna a penalidade por tempo
function pointTime(time) {
  const [minutes, seconds] = time.split(":");//vou deixar os minutos só por garatia ne vai q precisa
  if (seconds >= 25 && seconds <= 30) {
    return 0;
  } else if (seconds >= 20 && seconds < 25) {
    return 1;
  } else if (seconds >= 15 && seconds < 20) {
    return 2;
  } else if (seconds >= 10 && seconds < 15) {
    return 3;
  } else if (seconds >= 5 && seconds < 10) {
    return 4;
  } else if (seconds >= 0 && seconds < 5) {
    return 5;
  }
}

//soma pontos
function setScoreValue(value) {
  let scoreElement = document.getElementById('score');
  let currentValue = parseInt(scoreElement.textContent);

  if (isNaN(currentValue)) {
    currentValue = 0;
  }

  let newValue = currentValue + value;
  scoreElement.textContent = newValue;
}

//pega o tempo atual do timer
function getTimerValue() {
  // Pega o display do timer
  let display = document.getElementById('timer');

  // Obtém o valor atual do timer do texto do display
  let timerValue = display.textContent;

  // Retorna o valor atual do timer
  return timerValue;
}

//valida chord
function verifChord(targetChords, pressedChords) {
  // Verifica se os arrays têm o mesmo tamanho
  if (targetChords.length !== pressedChords.length) {
    return false;
  }

  // Cria cópias ordenadas dos arrays
  const sortedTarget = targetChords.slice().sort();
  const sortedPressed = pressedChords.slice().sort();

  // Verifique se todos os elementos correspondem em ambos os arrays
  return sortedTarget.every((val, index) => val === sortedPressed[index]);
}


function startGame() {
  // Só inicia se não tiver iniciado
  let display = document.getElementById('timer')
  if (gameState === 0) {
    // gameState = 1: Jogo iniciado
    gameState = 1;
    clearNotes()
    // Seleciona o acorde:
    selectRandomChord();//retorna as posiçãoes das notas

    // Inicia o timer
    timer.startTimer();

    // Seleciona o botão de play
    let playButton = document.getElementById('play');
    // Altera o id do botão, para alterar a estilização CSS
    playButton.id = 'playing';
    // Altera a função do botão, para que verifique as notas tocadas
    playButton.onclick = playNote;
  }
}

function endGame() {
  // Só finaliza se não estiver finalizado / aguardando
  if (gameState === 1) {
    // gameState = 1: Fim de jogo
    gameState = 0;

    // Seleciona o botão de play alterado (que agora é playing)
    let playButton = document.getElementById('playing');

    // Retorna o botão para o id play
    playButton.id = 'play';

    // Desabilita ele, vai desabilitar por 3 segundos logo abaixo
    playButton.disabled = true;

    // Inicia um timer de 3 segundos, executa a função dentro dele quando acaba
    setTimeout(() => {
      clearChord();
      timer.clearDisplay();
      // Habilita o botão
      playButton.disabled = false;
      // Devolve a função original do botão, de iniciar o jogo
      playButton.onclick = startGame;
    }, 3000)
  }
}

function timer() {
  let display = document.getElementById('timer');
  let minutes, seconds, totalSeconds;
  let interval;

  function declareSeconds() {
    // Aqui configura o tempo em min e seg de tudo, pra não precisar reescrever em mais de um lugar
    minutes = 0;
    seconds = 30;
    totalSeconds = (minutes % 60) + seconds;
  }

  function updateDisplay() {
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    display.textContent = formattedTime;
  }

  function clearDisplay() {
    display.textContent = "";
  }

  function startTimer() {
    declareSeconds();
    updateDisplay();
    interval = setInterval(() => {

      if (totalSeconds <= 0) {
        clearInterval(interval);
        endGame();
        return;
      }

      totalSeconds--;
      minutes = Math.floor(totalSeconds / 60);
      seconds = totalSeconds % 60;

      updateDisplay();
    }, 1000);
  }

  function resetTimer() {
    clearInterval(interval);
    declareSeconds();
    updateDisplay();
    startTimer();
  }

  function stopTimer() {
    clearInterval(interval);
  }

  return { startTimer, resetTimer, stopTimer, clearDisplay };
}

// Só trouxe a função do Andrei pra cá, talvez ela possa continuar em app.js e ser chamada de lá, não sei...
function selectRandomChord() {
  fetch('chords.json')
    .then(response => response.json())
    .then(data => {
      var chords = data.chords;

      // Gera um índice aleatório para selecionar um acorde
      var randomIndex = Math.floor(Math.random() * chords.length);

      // Obtém o acorde aleatório
      var randomChord = chords[randomIndex];
      // Obtém o nome do acorde
      chordName = randomChord.name;


      // Obtém as posições do acorde
      chordPositions = randomChord.positions;

      // Exibe o nome do acorde em um elemento com ID "chords"
      document.getElementById("chords").textContent = chordName;

      // Retorna as posições do acorde
      return chordPositions;
    })
    .catch(error => {
      console.error('Erro ao carregar o arquivo JSON:', error);
    });
}

function clearChord() {
  document.getElementById("chords").textContent = '';
}