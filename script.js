let bookingMessageDisplayed = false;
let selectedSeatCount = 0;
const container = document.querySelector('.container');

const generateBookingMessage = () => {
    const seatCounter = document.getElementById('seat-counter').textContent;
    const seatMessage = document.getElementById('seat-message');
    seatMessage.textContent = `You have selected ${seatCounter} seats.`;
};

const selectButton = document.querySelector('.select');
selectButton.addEventListener('click', () => {
    generateBookingMessage();
    openModal();
});

const openModal = () => {
    const modal = document.getElementById('modal');
    const closeModalButton = document.querySelector('.close-modal');

    modal.style.display = 'block';

    closeModalButton.addEventListener('click', closeModal);
};

const closeModal = () => {
    const modal = document.getElementById('modal');
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
        case 11:
            break;
        case 12:
            classes.push('facing-inwards-right');
            break;
        case 13:
            classes.push('upside-down');
            break;
        case 14:
            classes.push('facing-inwards-left');
            break;
        case 21:
            classes.push('occupied');
            break;
        case 22:
            classes.push('occupied', 'facing-inwards-right');
            break;
        case 23:
            classes.push('occupied', 'upside-down');
            break;
        case 24:
            classes.push('occupied', 'facing-inwards-left');
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

    arrangement.forEach(row => { //to do row/seat index
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