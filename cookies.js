// Pomoćna funkcija za prikaz poruke i promjenu CSS-a u 'display: block'
function showAlert(message) {
    const alertElement = document.querySelector('.alert');
    if (alertElement) {
        alertElement.innerText = message;
        alertElement.style.display = 'block'; // Mijenja display s none na block
    }
}

function hasUserVoted() {
    return document.cookie.split('; ').some(row => row.startsWith('has_voted='));
}

function registerVote(candidateId) {
    if (hasUserVoted()) {
        showAlert("Već ste glasovali!"); // Prikazuje CSS obavijest umjesto alerta
        return false;
    }

    fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate: candidateId })
    })
    .then(response => {
        if (response.ok) {
            const oneYear = 365 * 24 * 60 * 60; 
            document.cookie = "has_voted=true; max-age=" + oneYear + "; path=/; SameSite=Lax; Secure";
            
            showAlert("Hvala vam na glasovanju!"); // Prikazuje CSS obavijest
            showResults(); 
        } else {
            showAlert("Glasovanje nije uspjelo. Pokušajte ponovno.");
        }
    });
}
