document.getElementById("startGameButton").onclick = function() {
    const name = document.getElementById('name').value;
    const mail = document.getElementById('mail').value;
    const time = document.getElementById('select_time').value;
    const errorMessage = document.getElementById('error-message');

    const mailPattern = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
}