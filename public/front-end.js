// Calculate the maximum date (five days before today)
const today = new Date();
const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(today.getDate() - 5);

// Format the date in yyyy-mm-dd format
const maxDate = fiveDaysAgo.toISOString().split('T')[0];

// Set the max attribute of the input element
document.getElementById("pastDate").setAttribute("max", maxDate);




const card = document.querySelector('.card');

card.addEventListener('click', function() {
    // Flip the card
    card.style.transform = card.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
});

