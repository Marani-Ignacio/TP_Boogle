document.getElementById("startGameButton").onclick = function() {
    const name = document.getElementById('name').value;
    const mail = document.getElementById('mail').value;
    const time = document.getElementById('select_time').value;
    const errorMessage = document.getElementById('error-message');

    const mailPattern = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

if (name.length >= 3 && mailPattern.test(mail) && time) {
    localStorage.setItem('namePlayer', name);
    window.location.href = `game.html?time=${time}`;
} else {
    if (name.length < 3) {
        errorMessage.textContent = "Too short (3 letters minimum)";
    } else if (!mailPattern.test(mail)) {
        errorMessage.textContent = "Invalid email";
    } else {
        errorMessage.textContent = "Complete all the fields";
    }
    errorMessage.style.display = "block";
} 
};