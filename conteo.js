window.onload = function() {
    var words = JSON.parse(localStorage.getItem('words')) || [];
    var wordList = document.getElementById('wordList');
    var totalScore = 0;
    var i, entry, row, wordCell, pointsCell;

    for (i = 0; i < words.length; i++) {
        entry = words[i];
        row = document.createElement('tr');
        
        wordCell = document.createElement('td');
        wordCell.textContent = entry.word;
        row.appendChild(wordCell);
        
        pointsCell = document.createElement('td');
        pointsCell.textContent = entry.points;
        row.appendChild(pointsCell);
        
        wordList.appendChild(row);
        totalScore += entry.points;
    }

    document.getElementById('totalPoints').textContent = 'Total: ' + totalScore;
};