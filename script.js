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

const fetchJsonData = url => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const seatingArrangement = data.arrangement;
            generateSeats(seatingArrangement);
        });
};

let selectedFloor = '';
let selectedDay = '';

function selectFloor(floor) {
    selectedFloor = floor;
    updateButtonSelection('.floor-button', floor);
    document.getElementById('selected-floor').textContent = floor.replace('etaj', '');
    loadSeatingArrangement();
}

function selectDay(day) {
    selectedDay = day;
    updateButtonSelection('.day-button', day);
    document.getElementById('selected-day').textContent = day.replace('.json', '');
    loadSeatingArrangement();
}

function updateButtonSelection(buttonClass, value) {
    const buttons = document.querySelectorAll(buttonClass);
    buttons.forEach(button => {
        if (button.getAttribute('onclick').includes(value)) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

async function loadSeatingArrangement() {
    if (!selectedFloor || !selectedDay) return;

    const filePath = `${selectedFloor}/${selectedDay}`;
    try {
        const response = await fetch(filePath);
        const data = await response.json();
        displaySeatingArrangement(data.arrangement);
    } catch (error) {
        console.error('Error fetching the JSON data:', error);
    }
}

function updateSeatCounter() {
    const seatCounter = document.getElementById('seat-counter');
    seatCounter.textContent = `${selectedSeatCount}`;
};

function getSeatClasses(seat) {
    const classes = ['seat'];
    switch (seat) {
        case 1:
            break;
        case 2:
            classes.push('occupied');
            break;
        case 0:
            classes.push('corridor');
            break;
    }
    return classes;
};

function createSeatElement(seat, rowIndex, seatIndex) {
    const seatDiv = document.createElement('div');
    const classes = getSeatClasses(seat);
    seatDiv.classList.add(...classes);
    seatDiv.setAttribute('data-index', seatIndex);

    if (!seatDiv.classList.contains('occupied') && !seatDiv.classList.contains('corridor')) {
        seatDiv.addEventListener('click', () => {
            seatDiv.classList.toggle('selected');
            selectedSeatCount += seatDiv.classList.contains('selected') ? 1 : -1;
            updateSeatCounter();
        });

        seatDiv.addEventListener('mouseover', () => {
            const seatNumber = `R${rowIndex + 1}S${seatIndex + 1}`;
            seatDiv.setAttribute('title', seatNumber);
        });
    }

    return seatDiv;
}

function displaySeatingArrangement(arrangement) {
    const seatingArea = document.querySelector('.seating-area');
    seatingArea.innerHTML = '';

    let displayRowIndex = 0;
    arrangement.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        let seatIndex = 0;
        let hasNonCorridorSeat = false;
        row.forEach((seat) => {
            const seatDiv = createSeatElement(seat, displayRowIndex, seatIndex);
            rowDiv.appendChild(seatDiv);
            if (seat !== 0) { // Only increment seatIndex for non-corridor seats
                seatIndex++;
                hasNonCorridorSeat = true;
            }
        });

        seatingArea.appendChild(rowDiv);
        if (hasNonCorridorSeat) {
            displayRowIndex++;
        }
    });
}

function validateCredentials(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.seat-selector').style.display = 'block';
    } else {
        alert('Invalid credentials');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.landing-buttons .button:nth-child(1)');
    const selectSeatButton = document.querySelector('.landing-buttons .button:nth-child(2)');
    const loginDiv = document.querySelector('.login');
    const seatSelectorDiv = document.querySelector('.seat-selector');
    const landingDiv = document.querySelector('.landing');
    const addNewFloorOption = document.querySelector('#floor option[value="emptyStorey/emptyStorey.json"]');

    loginButton.addEventListener('click', () => {
        if (!loginDiv.classList.contains('admin-logged-in')) {
            loginDiv.style.display = 'block';
        }
        seatSelectorDiv.style.display = 'none';
        landingDiv.style.display = 'none';
    });

    selectSeatButton.addEventListener('click', () => {
        seatSelectorDiv.style.display = 'block';
        loginDiv.style.display = 'none';
        landingDiv.style.display = 'none';
    });

    const loginForm = document.querySelector('.login form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin') {
            addNewFloorOption.style.display = 'block';
            loginDiv.classList.add('admin-logged-in');
        } else {
            addNewFloorOption.style.display = 'none';
        }

        loginDiv.style.display = 'none';
        seatSelectorDiv.style.display = 'block';
    });

    addNewFloorOption.style.display = 'none';
});

const loginForm = document.querySelector('.login form');
loginForm.addEventListener('submit', validateCredentials);

document.addEventListener('DOMContentLoaded', loadSeatingArrangement);