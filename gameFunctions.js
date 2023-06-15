// Game state controla se o jogo iniciou ou não. É alterado por startGame e EndGame
let gameState = 0;
var chordName, chordPositions, a

function playNote() {
    // Lógica para verificar se o acorde veio corretamente entra aqui 
    // Vai precisar de uma forma de verificar os elementos HTML selecionados em fretboard
    let notesPressed = window.notesPress;
    let rightNote = true
    
    //alert('Alvo: ' + chordPositions + '\nSelecionado: ' + notesPressed);

    verifChord(chordPositions, notesPressed)
    /*
    if (chordPositions.length !== notesPressed.length) {
        alert('Errou')
    } else {
        for (let note of notesPress) {
            rightNote = rightNote && (chordPositions.includes(note))
        }
    }*/



}
//valida nota
function deletNote(vetor, valor){
    let indice = vetor.indexOf(valor);

    if (indice !== -1) {
        vetor.splice(indice, 1);
    }

    return vetor
}
function verifChord(targetChords, pressedChords){
    var target = targetChords.slice();
    var pressed = pressedChords.slice();

    for (targetNote of target){
        for (pressedNote of pressed){
            if (targetNote == pressedNote){
                deletNote(target, targetNote)
                deletNote(pressed, pressedNote)
            }
        }
    }

    if (target.length > 0 && pressed.length > 0){
        alert("acertou")
    }else{
        alert("errou")
    }
}

function startGame() {
    // Só inicia se não tiver iniciado
    if (gameState === 0) {
        // gameState = 1: Jogo iniciado
        gameState = 1;
        // Seleciona o acorde:
        selectRandomChord()//retorna as posiçãoes das notas
        //alert(selectRandomChord())
        

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

function endGame() {
    // Só finaliza se não tiver finalizado
    if (gameState === 1) {
        // gameState = 1: Fim de jogo
        gameState = 0;
        // Seleciona o botão de play alterado (que agora é playing)
        let playButton = document.getElementById('playing');
        // Retorna o botão para o id play
        playButton.id = 'play';
        // Desabilita ele, vai desabilitar por 3 segundos logo abaixo
        playButton.disabled = true;

        // Seleciona o display do timer
        let display = document.getElementById('timer');
        // Exibe "Game Over!" no display do timer
        display.textContent = "Game Over!"

        // Inicia um timer de 3 segundos, executa a função dentro dele quando acaba
        setTimeout(() => {
            // Retira o conteúdo do display do timer
            display.textContent = "";
            // Habilita o botão
            playButton.disabled = false;
            // Devolve a função original do botão, de iniciar o jogo
            playButton.onclick = startGame;
        }, 3000)
    }
}

function startTimer() {
    // Pega o display do timer
    let display = document.getElementById('timer');
    // Aqui define o tempo em minutos e segundos
    let minutes = 1, seconds = 30;

    // Transforma tudo em segundos, para o controle
    let totalSeconds = minutes * 60 + seconds;

    let interval = setInterval(() => {
        // Se acabou o tempo, termina o interval e chama a função endGame()
        if (totalSeconds <= 0) {
            clearInterval(interval);
            endGame()
            return;
        }

        totalSeconds--;

        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60;

        // Aqui é a string formatada, padStart adiciona o '0' se o tamanho da string é menor que 2
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Conteúdo formatado vai para o display do timer
        display.textContent = formattedTime
    }, 1000);
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