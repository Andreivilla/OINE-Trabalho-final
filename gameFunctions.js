// Game state controla se o jogo iniciou ou não. É alterado por startGame e EndGame
let gameState = 0;

var chordName, chordPositions;

let timerDisplay = document.getElementById('timer');
let minutes, seconds, totalSeconds;
let interval;


// Inicia o jogo
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
    startTimer();

    // Seleciona o botão de play
    let playButton = document.getElementById('play');
    // Altera o id do botão, para alterar a estilização CSS
    playButton.id = 'playing';
    // Altera a função do botão, para que verifique as notas tocadas
    playButton.onclick = playNote;
  }
}

// Finaliza o jogo
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
      clearChordDisplay();
      clearTimerDisplay();
      // Habilita o botão
      playButton.disabled = false;
      // Devolve a função original do botão, de iniciar o jogo
      playButton.onclick = startGame;
    }, 3000)
  }
}

// Quando o jogo está iniciado, toca as notas pressionadas quando o botão principal é clicado
function playNote() {
  // Lógica para verificar se o acorde veio corretamente entra aqui 
  // Vai precisar de uma forma de verificar os elementos HTML selecionados em fretboard
  let notesPressed = window.notesPress;

  if (verifChord(chordPositions, notesPressed)) {
    calculatePoints()
    //zera o timer e escolhe outro acorde
    resetTimer()
    selectRandomChord()
    //window.notesPress = []
    //alert(window.notesPress)
  }

  clearNotes();
}

// Atribuição dos valores minutes, seconds e totalSeconds (para iniciar ou reiniciar o timer)
function declareSeconds() {
  // Aqui configura o tempo em min e seg de tudo, pra não precisar reescrever em mais de um lugar
  minutes = 0;
  seconds = 30;
  totalSeconds = (minutes % 60) + seconds;
}

// Atualiza o display do Timer
function updateTimerDisplay() {
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerDisplay.textContent = formattedTime;
}

// Limpa o display do Timer
function clearTimerDisplay() {
  timerDisplay.textContent = "";
}

// Inicia o timer
function startTimer() {
  declareSeconds();
  updateTimerDisplay();
  interval = setInterval(() => {

    if (totalSeconds <= 0) {
      clearInterval(interval);
      endGame();
      return;
    }

    totalSeconds--;
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;

    updateTimerDisplay();
  }, 1000);
}

// Reseta o timer
function resetTimer() {
  clearInterval(interval);
  declareSeconds();
  updateTimerDisplay();
  startTimer();
}

// Para o timer
function stopTimer() {
  clearInterval(interval);
}

// Limpa as cordas selecionadas (função vêem de app.js)
function clearNotes() { window.clearSelectedNotes(); }

// Calcula os pontos que o player ganha ao acertar a nota. Pontos são descontados quanto menor o tempo restante
function calculatePoints() {
  let time = getTimerValue();
  let timelose = pointTime(time)

  setScoreValue(10 - timelose)
}

// Função para esconder o cadastro do usuário durante o jogo, e aparecer apenas quando acabar(ainda fazendo)
// function ToggleScoreDiv() {
//   const scoreContainer = document.getElementById('save-score');
//   const children = scoreContainer.children;
//   let setVal = gameState === 1 ? true : false;

//   for (let i = 0; i < children.length; i++) {
//     children[i].hidden = setVal;
//   }

// }

// Retorna o valor da penalidade que será descontada da pontuação após o jogador acertar a nota
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

// Soma os pontos com a quantidade que o jogador acumulou até o momento
function setScoreValue(value) {
  let scoreElement = document.getElementById('score');
  let currentValue = parseInt(scoreElement.textContent);

  if (isNaN(currentValue)) {
    currentValue = 0;
  }

  let newValue = currentValue + value;
  scoreElement.textContent = newValue;
}

// Pega o tempo atual do timer
function getTimerValue() {
  // Pega o display do timer
  let display = document.getElementById('timer');

  // Obtém o valor atual do timer do texto do display
  let timerValue = display.textContent;

  // Retorna o valor atual do timer
  return timerValue;
}

// Valida se as cordas pressionadas no braço do violão são as da nota alvo
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

// Seleciona uma corda aleatória para o jogador tocar
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

// Limpa o display de acorde alvo
function clearChordDisplay() {
  document.getElementById("chords").textContent = '';
}