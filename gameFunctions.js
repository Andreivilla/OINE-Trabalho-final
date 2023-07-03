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
    score = 0;

    clearScoreDisplay();
    clearNotes();

    toogleScoreHidden(true);
    toogleScoreboardHidden(true);

    // Seleciona o acorde:
    selectRandomChord();//retorna as posiçãoes das notas

    // Inicia o timer
    startTimer();

    // Seleciona o botão de play
    let playButton = document.getElementById('play');
    // Altera a função do botão, para que verifique as notas tocadas
    playButton.onclick = playChord;
    // Altera o id do botão, para alterar a estilização CSS
    playButton.id = 'playing';

  }
}

// Finaliza o jogo
function endGame() {
  // Só finaliza se não estiver finalizado / aguardando
  if (gameState === 1) {
    // gameState = 1: Fim de jogo
    gameState = 0;

    if (checkNewHighscore()) {
      toogleScoreHidden(false);
    }

    toogleScoreboardHidden(false);

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



  } else {
    duckScream(true)
    playSound('sons/Duck Quack.mp3')
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
  setScoreValue((10 - timeLost) * 10)
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

// Deixa o ranking invisível ou não, dependendo de bool, sempre o jogo não está rodando
function toogleScoreboardHidden(bool) {
  const rankingContainer = document.getElementById('scoreboard-div');
  const children = rankingContainer.children;

  if (bool) {
    rankingContainer.className = "";
  } else {
    rankingContainer.className = "scoreboard-container"
  }

  for (let i = 0; i < children.length; i++) {
    children[i].hidden = bool;
  }
}
//faz o pato aparecer e sumir
function duckScream(bool) {
  const duckContainer = document.getElementById('duck-scream');

  if (bool) {
    // Checa se o pato já existe (para evitar duplicação desnecessária de patos 0_0 )
    let checkPato = document.getElementById('duck')

    if (!checkPato) {
      // Cria um elemento <img> para exibir o gif
      const gif = document.createElement('img');
      gif.src = 'images/duck_scream.gif';
      gif.id = 'duck'

      // Adiciona o gif à div
      duckContainer.appendChild(gif);

      // Adiciona um evento de escuta para quando o gif terminar de ser reproduzido
      gif.addEventListener('load', function () {
        setTimeout(function () {
          // Remove o gif da div após 0,5 segundos
          duckContainer.removeChild(gif);
        }, 350);
      });
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

// Função que salva o array "scoreArray" no localStorage
function setScoreboard(scoreArray) {
  localStorage.setItem('scoreboard', JSON.stringify(scoreArray));
}

// Função que puxa o array em localStorage;
function loadScoreboard() {
  const storedPlayers = localStorage.getItem('scoreboard');
  return storedPlayers ? JSON.parse(storedPlayers) : [];
}

// Função que salva o score do jogador, adicionando-o no array e usando a função setScoreboard para gravar a alteração
function savePlayerScore() {
  const scoreboard = loadScoreboard();
  let name = document.getElementById('text-name').value;

  if (name && score > 0) {

    scoreboard.push({ name, score });
    // Abaixo, ordena pela pontuação em ordem descrescente
    scoreboard.sort((a, b) => b.score - a.score);

    // Se o número de elementos passou de 5, remove o último
    if (scoreboard.length > 5) {
      scoreboard.pop();
    }

    setScoreboard(scoreboard);
    toogleScoreHidden(true);
    updateScoreboard();
  }
}

// Função que atualiza o display do score, e atualiza ele de acordo com o que está no localStorage
function updateScoreboard() {
  const scoreboard = loadScoreboard();
  const container = document.getElementById('scoreboard-div');

  container.innerHTML = '';

  const h1 = document.createElement('h1');
  h1.innerText = 'Melhores Pontuações:';
  container.appendChild(h1);

  if (scoreboard.length > 0) {
    let emptyDisplay = document.getElementById('empty-scoreboard');

    if (emptyDisplay) {
      container.removeChild(emptyDisplay)
    }

    for (let i = 0; i < scoreboard.length; i++) {
      let player = scoreboard[i];
      const scoreDisplay = document.createElement('h2');
      scoreDisplay.innerText = `${i + 1}º ${player.name}: ${player.score} pts`;
      container.appendChild(scoreDisplay)
    }
  } else {
    if (!document.getElementById('empty-scoreboard')) {
      const emptyDisplay = document.createElement('h2')
      emptyDisplay.id = 'empty-scoreboard';
      emptyDisplay.innerText = 'Não há pontuações salvas!';
      container.appendChild(emptyDisplay)
    }
  }
}

// Função para verificar se o score pode ser salvo. Só será salvo se tiver menos que 5 registros, se tiver 5, a pontuação deve ser melhor que a de um dos 5
function checkNewHighscore() {
  const scoreboard = loadScoreboard();

  if (scoreboard.length >= 5) {

    for (let i = 0; i < scoreboard.length; i++) {
      if (score > scoreboard[i].score) {
        return true
      }
    }

    return false;
  } else {
    return true
  }
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

function clearScoreDisplay() {
  document.getElementById('score').textContent = '';
}