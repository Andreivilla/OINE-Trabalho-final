// Game state controla se o jogo iniciou ou não. É alterado por startGame e EndGame
let gameState = 0;

var chordName, chordPositions;

let timerDisplay = document.getElementById('timer');
let minutes, seconds, totalSeconds;
let interval;

let score = 0;

// Inicia o jogo
function startGame() {
  // Só inicia se não tiver iniciado
  if (gameState === 0) {
    // gameState = 1: Jogo iniciado
    gameState = 1;
    clearNotes();

    toogleScoreHidden(true);

    // Seleciona o acorde:
    selectRandomChord();//retorna as posiçãoes das notas

    // Inicia o timer
    startTimer();

    // Seleciona o botão de play
    let playButton = document.getElementById('play');
    // Altera o id do botão, para alterar a estilização CSS
    playButton.id = 'playing';
    // Altera a função do botão, para que verifique as notas tocadas
    playButton.onclick = playChord;
  }
}

// Finaliza o jogo
function endGame() {
  // Só finaliza se não estiver finalizado / aguardando
  if (gameState === 1) {
    // gameState = 1: Fim de jogo
    gameState = 0;

    toogleScoreHidden(false);

    clearNotes();

    // Seleciona o botão de play alterado (que agora é playing)
    let playButton = document.getElementById('playing');

    // Retorna o botão para o id play
    playButton.id = 'play';

    // Desabilita ele, vai habilitar depois de 3 segundos com o timeout abaixo
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
function playChord() {
  // Lógica para verificar se o acorde veio corretamente entra aqui 
  // Vai precisar de uma forma de verificar os elementos HTML selecionados em fretboard
  let notesPressed = window.notesPress;

  if (verifChord(chordPositions, notesPressed)) {
    playSound('sons/acordes/acorde-' + chordName + '.mp3')
    calculatePoints()
    // zera o timer e escolhe outro acorde
    resetTimer()
    selectRandomChord()
    //window.notesPress = []
    //alert(window.notesPress)
  }

  clearNotes();
}


function playSound(caminho) {
  var audio = new Audio(caminho);
  audio.play();
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
  let timeLost = pointTime();
  setScoreValue(10 - timeLost)
}

// Função para esconder o cadastro do usuário durante o jogo, e aparecer apenas quando acabar(ainda fazendo)
function toogleScoreHidden(bool) {
  const scoreContainer = document.getElementById('save-score-div');
  const children = scoreContainer.children;

  if ((!bool && score > 0) || bool) {
    for (let i = 0; i < children.length; i++) {
      children[i].hidden = bool;
    }
  }
}

// Retorna o valor da penalidade que será descontada da pontuação após o jogador acertar a nota
function pointTime() {
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
  let scoreDisplay = document.getElementById('score');

  score = score + value

  scoreDisplay.textContent = score;
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

function setScoreboard(scoreArray) {
  localStorage.setItem('scoreboard', JSON.stringify(scoreArray));
}

function loadScoreboard() {
  const storedPlayers = localStorage.getItem('scoreboard');
  return storedPlayers ? JSON.parse(storedPlayers) : [];
}

function savePlayerScore() {
  const scoreboard = loadScoreboard();
  let name = document.getElementById('text-name').value;

  if (name && score > 0) {
    scoreboard.push({ name, score });
    setScoreboard(scoreboard);
    toogleScoreHidden(true);
    updateScoreboard()
  }
}

function updateScoreboard() {
  const scoreboard = loadScoreboard();
  const container = document.getElementById('scoreboard-div');

  const h1 = document.createElement('h1');
  h1.innerText = 'Ranking dos Jogadores';
  container.appendChild(h1);

  scoreboard.forEach((player) => {
    const scoreDisplay = document.createElement('h3');
    scoreDisplay.innerText = `${player.name}: ${player.score}`;
    container.appendChild(scoreDisplay)
  })

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