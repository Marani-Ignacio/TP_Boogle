var list = "ABCDEFGHIJKLMNOPQRSTUWXYZ";
var currentTrack = [];
var clickable = [];
var submitted = new Set();
var currentWord = "";
var lastSelectedButton = null;
var words = [];

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var intervalId = setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
            saveResults();
            showModal();
        }
    }, 1000);
}

function showModal() {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    var modalBtn = document.getElementById("modalBtn");

    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
        window.location.href = "conteo.html";
    };

    modalBtn.onclick = function() {
        modal.style.display = "none";
        window.location.href = "conteo.html";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            window.location.href = "conteo.html";
        }
    };
}

document.getElementById("finish").onclick = function() {
    saveResults();
    window.location.href = "conteo.html";
};

window.onload = function() {
    var timeSelect = getUrlParameter('time');
    var timeInSeconds = parseInt(timeSelect) * 60;
    var display = document.querySelector('#time');
    startTimer(timeInSeconds, display);
};

function saveResults() {
    var totalPoints = words.reduce(function(sum, word) {
        return sum + word.points;
    }, 0);
    var namePlayer = localStorage.getItem('namePlayer');

    var newResult = {
        player: namePlayer,
        point: totalPoints,
        date: new Date().toISOString()
    };

    var rankingData = JSON.parse(localStorage.getItem('rankingData')) || [];
    rankingData.push(newResult);
    localStorage.setItem('rankingData', JSON.stringify(rankingData));
    localStorage.setItem('words', JSON.stringify(words));
    localStorage.setItem('puntosTotales', totalPoints);
}

board();
buttonEvent();

function board() {
    var board = [];
    var boardGenerator = list.split('');
    shuffle(boardGenerator);

    for (var i = 0; i < 16; i += 4) {
        var line = boardGenerator.slice(i, i + 4);
        board.push(line);
    }

    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            var character = board[row][col];
            var button = "<button type='button' class='dice' row='" + row + "' col='" + col + "'>" + character + "</button>";
            var rowSelector = document.getElementById("row" + row);
            if (rowSelector) {
                rowSelector.innerHTML += button;
            } else {
                console.error("Element with id 'row" + row + "' not found.");
            }
        }
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
}

function buttonEvent() {
    var events = document.getElementsByClassName('dice');
    for (var i = 0; i < events.length; i++) {
        events[i].onclick = function() {
            var row = Number(this.getAttribute('row'));
            var col = Number(this.getAttribute('col'));
            var text = this.innerHTML;

            if (lastSelectedButton) {
                lastSelectedButton.classList.remove('selected');
            }

            if (!this.classList.contains('active')) {
                currentTrack.push([row, col]);
                currentWord += text;
                this.classList.add('selected');
                lastSelectedButton = this;
            } else {
                currentTrack.pop();
                currentWord = currentWord.substring(0, currentWord.length - 1);
                this.classList.remove('selected');
                lastSelectedButton = null;
            }

            if (currentTrack.length !== 0) {
                var currentDice = currentTrack[currentTrack.length - 1];
                ajacent(currentDice[0], currentDice[1]);
                clickable = modifyClickable(clickable, currentTrack);
                clickable.push([currentDice[0], currentDice[1]]);
            } else {
                clickable = [];
            }
            updateClickableDice();
            document.getElementById('currentWord').innerHTML = currentWord;
            this.classList.toggle('active');
        };
    }

    var submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.onclick = validateAndSubmitWord;
    } else {
        console.error("Element with id 'submit' not found.");
    }
}

function modifyClickable(clickable, currentTrack) {
    return clickable.filter(function(dice1) {
        return !currentTrack.some(function(dice2) {
            return dice1[0] === dice2[0] && dice1[1] === dice2[1];
        });
    });
}

function updateClickableDice() {
    var events = document.getElementsByClassName('dice');
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var row = Number(event.getAttribute('row'));
        var col = Number(event.getAttribute('col'));
        var isClickable = currentTrack.length === 0 || clickable.some(function(dice) {
            return dice[0] === row && dice[1] === col;
        });

        event.disabled = !isClickable;
        if (isClickable) {
            event.classList.add('highlightBtn');
        } else {
            event.classList.remove('highlightBtn');
        }
    }
}

function showWordExistsModal() {
    var modal = document.getElementById("wordExistsModal");
    var span = document.getElementsByClassName("close")[1];
    
    modal.style.display = "block";
    
    span.onclick = function() {
        modal.style.display = "none";
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function validateAndSubmitWord() {
    if (currentWord.length < 3) {
        showError("The word must have at least 3 letters.");
    } else if (submitted.has(currentWord)) {
        showWordExistsModal();
        resetWord();
        afterSubmit();
    } else {
        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + currentWord)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Invalid word");
                }
            })
            .then(function() {
                var score = calculateScore(currentWord);
                words.push({ word: currentWord, points: score });
                submitWord();
                updateWords();
                clearSelectedButtons();
                afterSubmit();
            })
            .catch(function() {
                showError("The word is not valid. Points will be deducted.");
                var score = -calculateScore(currentWord);
                words.push({ word: currentWord, points: score });
                updateWords();
                resetWord();
                clearSelectedButtons();
                afterSubmit();
            });
    }
}

function resetWord() {
    currentWord = "";
    document.getElementById('currentWord').innerHTML = currentWord;
}

function clearSelectedButtons() {
    var selectedButtons = document.getElementsByClassName('selected');
    var activeButtons = document.getElementsByClassName('active');
    
    for (var i = 0; i < selectedButtons.length; i++) {
        selectedButtons[i].classList.remove('selected');
    }
    for (var i = 0; i < activeButtons.length; i++) {
        activeButtons[i].classList.remove('active');
    }
    
    lastSelectedButton = null;
}

function submitWord() {
    currentTrack = [];
    submitted.add(currentWord);
    resetWord();
}

function afterSubmit() {
    var events = document.getElementsByClassName('dice');
    for (var i = 0; i < events.length; i++) {
        events[i].classList.remove('active');
    }
    currentTrack = [];
    updateClickableDice();
}

function updateWords() {
    var validWords = words.filter(function(entry) {
        return entry.points > 0;
    });
    var wordsHtml = validWords.map(function(entry) {
        return entry.word + " (" + entry.points + ")";
    }).join(' - ');
    var sum = words.reduce(function(total, entry) {
        return total + entry.points;
    }, 0);
    
    document.getElementById('tableWords').innerHTML = wordsHtml;
    document.getElementById('totalScore').innerHTML = sum;
}

function calculateScore(word) {
    var length = word.length;
    if (length <= 2) return 0;
    if (length <= 4) return 1;
    if (length === 5) return 2;
    if (length === 6) return 3;
    if (length === 7) return 5;
    return 11;
}

function withinRange(row, col) {
    return (row >= 0 && row < 4 && col >= 0 && col < 4);
}

var ajacentDice = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1]
];

function ajacent(row, col) {
    clickable = ajacentDice
        .map(function(dice) {
            return [Number(row) + dice[0], Number(col) + dice[1]];
        })
        .filter(function(dice) {
            return withinRange(dice[0], dice[1]);
        });
}

function showError(message) {
    var errorElement = document.getElementById('error');
    errorElement.innerHTML = message;
    errorElement.style.display = 'block';
    setTimeout(function() {
        errorElement.style.display = 'none';
    }, 3000);
}