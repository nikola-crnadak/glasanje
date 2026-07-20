const MOCK_API_BASE_URL = "https://6a5e8dfb98d9f02aed79a955.mockapi.io/votes";
const MOCK_API_ITEM_URL = `${MOCK_API_BASE_URL}/1`;
const grbaBtn = document.querySelector('.grba');
const crniBtn = document.querySelector('.crni');
const grbaCounter = document.querySelector('.grba-span');
const crniCounter = document.querySelector('.crni-span');
const alertSpan = document.querySelector('.alert .msg');

let currentVotes = { grba: 0, crni: 0 };

// 1. Dohvaćanje podataka s MockAPI-ja
async function fetchVotes() {
    try {
        console.log("Dohvaćam podatke s MockAPI...");
        const response = await fetch(MOCK_API_ITEM_URL);
        
        if (response.status === 404) {
            console.log("ID 1 ne postoji. Kreiram početne podatke...");
            const initResponse = await fetch(MOCK_API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: "1", grba: 0, crni: 0 })
            });
            currentVotes = await initResponse.json();
        } else if (!response.ok) {
            throw new Error("Greška pri dohvaćanju s API-ja");
        } else {
            currentVotes = await response.json();
        }
        
        // Prikaz broja glasova u HTML-u (osiguravamo da piše broj, ako nema podatka stavljamo 0)
        grbaCounter.innerText = currentVotes.grba || 0;
        crniCounter.innerText = currentVotes.crni || 0;
        console.log("Podaci uspješno učitani:", currentVotes);
    } catch (error) {
        console.error("Greška u fetchVotes():", error);
    }
}

// 2. Provjera kolačića
function hasUserVoted() {
    return document.cookie.split('; ').some(row => row.startsWith('has_voted='));
}

// 3. Prikaz poruke na ekranu
function showAlert(message) {
    if (alertSpan) {
        alertSpan.innerText = message;
        alertSpan.style.display = 'block';
    }
}

// 4. Slanje glasa
async function castVote(candidate) {
    if (hasUserVoted()) {
        showAlert("You have already voted!");
        return;
    }

    // Osigurajmo da su polja brojevi prije zbrajanja
    currentVotes.grba = Number(currentVotes.grba) || 0;
    currentVotes.crni = Number(currentVotes.crni) || 0;

    // Dodaj glas lokalno
    currentVotes[candidate] += 1;

    try {
        console.log(`Šaljem glas za ${candidate}...`);
        const response = await fetch(MOCK_API_ITEM_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grba: currentVotes.grba,
                crni: currentVotes.crni
            })
        });

        if (response.ok) {
            // Ažuriraj brojač na ekranu
            grbaCounter.innerText = currentVotes.grba;
            crniCounter.innerText = currentVotes.crni;

            // Postavi kolačić na 1 godinu
            const oneYear = 365 * 24 * 60 * 60;
            document.cookie = "has_voted=true; max-age=" + oneYear + "; path=/; SameSite=Lax; Secure";

            showAlert("You voted!");
            console.log("Glas uspješno spremljen!");
        } else {
            // Vrati na staro ako API javi grešku
            currentVotes[candidate] -= 1;
            showAlert("Failed to save vote. Try again.");
            console.log("MockAPI je odbio PUT zahtjev.");
        }
    } catch (error) {
        currentVotes[candidate] -= 1;
        console.error("Greška u castVote():", error);
        showAlert("Server connection failed.");
    }
}

// 5. Event Listeners
if(grbaBtn) grbaBtn.addEventListener('click', () => castVote('grba'));
if(crniBtn) crniBtn.addEventListener('click', () => castVote('crni'));

// Pokretanje pri učitavanju stranice
window.addEventListener('DOMContentLoaded', () => {
    fetchVotes();
    if (hasUserVoted()) {
        showAlert("Welcome back! You have already voted.");
    }
});
