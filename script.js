let bookingMessageDisplayed = false;
let selectedSeatCount = 0;
const container = document.querySelector('.container');

const selectButton = document.querySelector('.select');
selectButton.addEventListener('click', () => {
    generateBookingMessage();
    openModal();
});

const openModal = () => {
    const modal = document.querySelector('.modal');
    const closeModalButton = document.getElementById('close-modal');

    modal.style.display = 'block';

    closeModalButton.addEventListener('click', () => {
        closeModal();
    });
};

const closeModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
};


function updateSeatCounter() {
    const seatCounter = document.querySelector('.seat-counter');
    seatCounter.textContent = `You selected ${selectedSeatCount} seats.`;
}

const fetchJsonData = url => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
        const seatingArrangement = data.arrangement;
        generateSeats(seatingArrangement);
        });
};

const handleStoreySection = () => {
    const floorSelect = document.getElementById('floor');
    const selectedMovieValue = floorSelect.value;
    let url;

    switch (selectedMovieValue) {
        case '1':
            fetch('etaj4/day1.json')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
            console.log('url-ul este ', url);
            break;
        case '2':
            fetch('etaj4/day2.json')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
            console.log('url-ul este ', url);
            break;
        case '3':
            fetch('etaj6/day2.json')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
            console.log('url-ul este ', url);
            break;
        case '4':
            fetch('etaj6/day2.json')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
            console.log('url-ul este ', url);
            break;
    }
    fetchJsonData(url);
};

const floorSelect = document.getElementById('floor');
floorSelect.addEventListener('change', handleStoreySection);

handleStoreySection();

async function loadSeatingArrangement() {
    const select = document.getElementById('floor');
    const filePath = select.value;

    try {
        const response = await fetch(filePath);
        const data = await response.json();
        displaySeatingArrangement(data.arrangement);
    } catch (error) {
        console.error('Error fetching the JSON data:', error);
    }
};

function updateSeatCounter() {
    const seatCounter = document.getElementById('seat-counter');
    seatCounter.textContent = `${selectedSeatCount}`;
};

function getSeatClasses(seat) {
    const classes = ['seat'];
    switch (seat) {
        case 1:
            classes.push('rotated-up');
            break;
        case 11:
            classes.push('rotated-left');
            break;
        case 12:
            classes.push('rotated-right');
            break;
        case 13:
            break;
        case 2:
            classes.push('occupied');
            break;
        case 21:
            classes.push('occupied', 'rotated-up');
            break;
        case 22:
            classes.push('occupied', 'rotated-right');
            break;
        case 23:
            classes.push('occupied', 'rotated-left');
            break;
        case 0:
            classes.push('corridor');
            break;
    }
    return classes;
};

function createSeatElement(seat) {
    const seatDiv = document.createElement('div');
    const classes = getSeatClasses(seat);
    seatDiv.classList.add(...classes);

    if (!seatDiv.classList.contains('occupied') && !seatDiv.classList.contains('corridor')) {
        seatDiv.addEventListener('click', () => {
            seatDiv.classList.toggle('selected');
            selectedSeatCount += seatDiv.classList.contains('selected') ? 1 : -1;
            updateSeatCounter();
        });
    }

    return seatDiv;
};

function displaySeatingArrangement(arrangement) {
    const seatingArea = document.querySelector('.seating-area');
    seatingArea.innerHTML = ''; // Clear previous seating arrangement

    arrangement.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        row.forEach(seat => {
            const seatDiv = createSeatElement(seat);
            rowDiv.appendChild(seatDiv);
        });

        seatingArea.appendChild(rowDiv);
    });
};

// Load initial seating arrangement on page load
document.addEventListener('DOMContentLoaded', loadSeatingArrangement);