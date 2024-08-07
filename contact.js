document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
    var errorMessage = document.getElementById('errorMessage');
    
    var namePattern = /^[a-zA-Z0-9]+$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Reset error message
    errorMessage.style.display = "none";
    
    if (!namePattern.test(name)) {
        errorMessage.textContent = "Name should be alphanumeric";
        errorMessage.style.display = "block";
        return;
    }
    
    if (!emailPattern.test(email)) {
        errorMessage.textContent = "Invalid email address";
        errorMessage.style.display = "block";
        return;
    }
    
    if (message.length <= 5) {
        errorMessage.textContent = "Message should be more than 5 characters";
        errorMessage.style.display = "block";
        return;
    }
    
    // If all validations pass, open Gmail compose window
    var gmailComposeUrl = "https://mail.google.com/mail/?view=cm&fs=1" +
                          "&to=" + encodeURIComponent(email) +
                          "&su=" + encodeURIComponent("Te invito a jugar Boogle " + name + "!") +
                          "&body=" + encodeURIComponent(message);
    
    window.open(gmailComposeUrl, '_blank');
    
    // Clear form fields after successful submission
    clearForm();
});

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}