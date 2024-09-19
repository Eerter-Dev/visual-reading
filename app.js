let words = [];
let currentIndex = 0;
let intervalId = null;
let isPaused = true;
let isLooping = false;
let speed = 200; // Domyślna prędkość (słów na minutę)
const pauseAfterSentence = 500; // Czas przerwy po zakończeniu zdania (w milisekundach)

document.getElementById('txtInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            words = splitTextIntoWords(text);
            currentIndex = 0;
            if (!isPaused) {
                startDisplayingWords();
            }
        };
        reader.onerror = function() {
            console.error('Błąd podczas odczytu pliku TXT.');
            alert('Nie udało się odczytać pliku TXT.');
        };
        reader.readAsText(file);
    }
});

function splitTextIntoWords(text) {
    // Regex do dzielenia tekstu na słowa i uwzględnienia przerw po zdaniach
    return text.split(/(\s+|(?<=[.!?]))/).filter(word => word.trim().length > 0);
}

function displayWord() {
    if (!isPaused && words.length > 0) {
        if (currentIndex >= words.length) {
            if (isLooping) {
                currentIndex = 0; // Zaczynamy od początku, jeśli zapętlanie włączone
            } else {
                clearInterval(intervalId);
                return;
            }
        }
        const word = words[currentIndex];
        document.getElementById('displayWord').innerText = word;

        if (/[.!?]/.test(word)) {
            // Ustal czas przerwy po zakończeniu zdania
            clearInterval(intervalId);
            setTimeout(() => {
                currentIndex++;
                startDisplayingWords();
            }, pauseAfterSentence);
        } else {
            currentIndex++;
        }
    }
}

function startDisplayingWords() {
    intervalId = setInterval(displayWord, (60000 / speed)); // 60000 ms w 1 minucie
}

function togglePlayPause() {
    if (isPaused) {
        isPaused = false;
        startDisplayingWords();
    } else {
        isPaused = true;
        clearInterval(intervalId);
    }
}

// Nasłuchuj naciśnięcia klawisza spacji
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // Zapobiegaj przewijaniu strony podczas naciśnięcia spacji
        togglePlayPause();
    }
});

document.getElementById('startButton').addEventListener('click', function() {
    if (words.length === 0) return;

    const speedInput = document.getElementById('speedInput').value;
    speed = parseInt(speedInput);
    
    clearInterval(intervalId); // Zatrzymaj bieżący timer, jeśli jest
    isPaused = false;
    startDisplayingWords();
});

document.getElementById('pauseButton').addEventListener('click', function() {
    isPaused = true;
    clearInterval(intervalId); // Zatrzymanie timera
});

document.getElementById('textInput').addEventListener('input', function() {
    const text = this.value;
    words = splitTextIntoWords(text);
    currentIndex = 0;
});

document.getElementById('loopButton').addEventListener('click', function() {
    isLooping = !isLooping;
    this.innerText = `Zapętlaj: ${isLooping ? 'Włączone' : 'Wyłączone'}`;
});

function updateColors() {
    const bgColor = document.getElementById('bgColorInput').value;
    const textColor = document.getElementById('textColorInput').value;
    document.documentElement.style.setProperty('--background-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);
}

document.getElementById('bgColorInput').addEventListener('input', updateColors);
document.getElementById('textColorInput').addEventListener('input', updateColors);

document.getElementById('fullscreenButton').addEventListener('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Błąd podczas próby wejścia w tryb pełnoekranowy:', err);
        });
    } else {
        document.exitFullscreen();
    }
});
