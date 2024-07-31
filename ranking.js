document.addEventListener('DOMContentLoaded', function() {
    var rankingTableBody = document.querySelector('#rankingTable tbody');
    var sortScoreButton = document.getElementById('sortScore');
    var sortDateButton = document.getElementById('sortDate');

    function loadRankingData() {
        return JSON.parse(localStorage.getItem('rankingData')) || [];
    }

    function renderRanking(rankingData) {
        var tableContent = '';
        for (var i = 0; i < rankingData.length; i++) {
            var item = rankingData[i];
            tableContent += '<tr>' +
                '<td>' + item.player + '</td>' +
                '<td>' + item.point + '</td>' +
                '<td>' + new Date(item.date).toLocaleDateString() + '</td>' +
                '</tr>';
        }
        rankingTableBody.innerHTML = tableContent;
    }


