const selectButton = document.querySelector('.select');
selectButton.addEventListener('click', () => {
    generateBookingMessage();
    openModal();
});

document.getElementById('save-layout').addEventListener('click', () => {
    openAdminModal();
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

const openAdminModal = () => {
    const adminModal = document.getElementById('admin-modal');
    const closeAdminModalButton = document.querySelector('.close-admin-modal');
    const confirmAdminButton = document.querySelector('.confirm-admin');

    adminModal.style.display = 'block';

    closeAdminModalButton.addEventListener('click', closeAdminModal);
    confirmAdminButton.addEventListener('click', handleAdminFormSubmission);
};

const closeAdminModal = () => {
    const adminModal = document.getElementById('admin-modal');
    adminModal.style.display = 'none';
};

const handleAdminFormSubmission = () => {
    const floorName = document.getElementById('floorName').value;
    const days = Array.from(document.querySelectorAll('#days input:checked')).map(checkbox => checkbox.value);
    const endPeriod = document.getElementById('endPeriod').value;

    console.log('Floor Name/Number:', floorName);
    console.log('Days:', days);
    console.log('End Period:', endPeriod);

    // Process the data as needed
    closeAdminModal();
};

function addNewFloor() {
    fetch('emptyStorey/emptyStorey.json')
        .then(response => response.json())
        .then(data => {
            const emptyStoreyArrangement = data.arrangement;
            displaySeatingArrangement(emptyStoreyArrangement);
            document.getElementById('message').style.display = 'block';
        })
        .catch(error => console.error('Error fetching emptyStorey.json:', error));
}


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

let selectedSeatPositions = [];
let selectedSeatCount = 0;

function selectFloor(floor) {
    if (floor === 'newFloor') {
        addNewFloor();
        return;
    }
    selectedFloor = floor;
    updateButtonSelection('.floor-button', floor);
    document.getElementById('selected-floor').textContent = floor.replace('etaj', '');
    loadSeatingArrangement();
}

function selectDay(day) {
    selectedDay = getDateForDay(day);
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

let seatMatrix = new Array(24).fill(0).map(() => new Array(24).fill(0));

async function loadSeatingArrangement() {
    if (!selectedFloor || !selectedDay) return;

    const url = `http://localhost:8080/api/seats/all?storeyName=${selectedFloor}&date=${selectedDay}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedMatrix = await response.json();

        // Update the existing seatMatrix with the fetched data
        for (let i = 0; i < fetchedMatrix.length; i++) {
            for (let j = 0; j < fetchedMatrix[i].length; j++) {
                if (fetchedMatrix[i][j] !== 0) {
                    seatMatrix[i][j] = fetchedMatrix[i][j];
                }
            }
        }

        // Save the matrix in a response.json file
        saveMatrixToFile(seatMatrix);

        displaySeatingArrangement(seatMatrix);
        await fetchEmptySeats(selectedFloor, selectedDay); // Fetch empty seats
        await fetchBookedSeats(selectedFloor, selectedDay); // Fetch booked seats
        await fetchNrOfBookedSeats(selectedFloor, selectedDay); // Fetch number of booked seats
        await fetchNrOfEmptySeats(selectedFloor, selectedDay); // Fetch number of empty seats
        await fetchNrOfSeats(selectedFloor, selectedDay); // Fetch total number of seats
    } catch (error) {
        console.error('Error fetching the JSON data:', error);
    }
}

function saveMatrixToFile(matrix) {
    const json = JSON.stringify(matrix, null, 2);
    console.log(json);
    // You can handle the JSON data here as needed
}

function getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const options = { weekday: 'long' };
    return today.toLocaleDateString('en-US', options);
}

function getDateForDay(day) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
    const todayDayIndex = today.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
    const targetDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);


    let daysToAdd = targetDayIndex - todayDayIndex;
    if (daysToAdd < 0) {
        if (daysToAdd === -1)
            daysToAdd = 7;
        if (daysToAdd === -2)
            daysToAdd = 6;
        if (daysToAdd === -3)
            daysToAdd = 5;
        if (daysToAdd === -4)
            daysToAdd = 4;
        if (daysToAdd === -5)
            daysToAdd = 3;
        if (daysToAdd === -6)
            daysToAdd = 2;
    }

    const targetDate = new Date(today);
    targetDate.setUTCDate(today.getUTCDate() + daysToAdd);
    targetDate.setUTCHours(0, 0, 0, 0); // Ensure time is 00:00:00 UTC
    return targetDate.toISOString().split('.')[0] + 'Z'; // Return date in YYYY-MM-DDTHH:MM:SSZ format
}

async function fetchEmptySeats(selectedFloor, selectedDay) {
    const url = `/api/seats/empty?storeyName=${selectedFloor}&date=${selectedDay}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching empty seats:', error);
    }
}

async function fetchBookedSeats(selectedFloor, selectedDay) {
    const url = `/api/seats/booked?storeyName=${selectedFloor}&date=${selectedDay}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching booked seats:', error);
    }
}

async function fetchNrOfBookedSeats(selectedFloor, selectedDay) {
    const url = `/api/seats/nrOfBookedSeats`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ storeyName: selectedFloor, date: selectedDay })
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching number of booked seats:', error);
    }
}

async function fetchNrOfEmptySeats(selectedFloor, selectedDay) {
    const url = `/api/seats/nrOfEmptySeats?storeyName=${selectedFloor}&date=${selectedDay}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching number of empty seats:', error);
    }
}

async function fetchNrOfSeats(selectedFloor, selectedDay) {
    const url = `/api/seats/nrOfSeats?storeyName=${selectedFloor}&date=${selectedDay}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching number of seats:', error);
    }
}

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
}

function createSeatElement(seat, rowIndex, seatIndex) {
    const seatDiv = document.createElement('div');
    const classes = getSeatClasses(seat);
    seatDiv.classList.add(...classes);
    seatDiv.setAttribute('data-index', seatIndex);

    if (!seatDiv.classList.contains('occupied') && !seatDiv.classList.contains('corridor')) {
        seatDiv.addEventListener('click', () => {
            seatDiv.classList.toggle('selected');
            if (seatDiv.classList.contains('selected')) {
                selectedSeatPositions.push({ row: rowIndex, seat: seatIndex });
                selectedSeatCount++;
            } else {
                selectedSeatPositions = selectedSeatPositions.filter(
                    pos => !(pos.row === rowIndex && pos.seat === seatIndex)
                );
                selectedSeatCount--;
            }
            updateSeatCounter();
        });

        seatDiv.addEventListener('mouseover', () => {
            const seatNumber = `R${rowIndex + 1}S${seatIndex + 1}`;
            seatDiv.setAttribute('title', seatNumber);
        });
    }

    return seatDiv;
}

function updateSeatCounter() {
    const seatCounter = document.getElementById('seat-counter');
    seatCounter.textContent = `${selectedSeatCount}`;
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
    const addNewFloorButton = document.getElementById('add-new-floor');

    const today = new Date();
    const options = { weekday: 'long' };
    const currentDay = today.toLocaleDateString('en-US', options).toLowerCase();

    const currentDayButton = document.getElementById(currentDay);
    if (currentDayButton) {
        currentDayButton.classList.add('current-day');
    }

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
            addNewFloorButton.style.display = 'block';
            loginDiv.classList.add('admin-logged-in');
        } else {
            addNewFloorButton.style.display = 'none';
        }

        loginDiv.style.display = 'none';
        seatSelectorDiv.style.display = 'block';
    });

    addNewFloorButton.style.display = 'none';

    let bookingMessageDisplayed = false;
    const container = document.querySelector('.container');

    const generateBookingMessage = () => {
        const seatCounter = document.getElementById('seat-counter').textContent;
        const seatMessage = document.getElementById('seat-message');
        seatMessage.textContent = `You have selected ${seatCounter} seats.`;
    };

    let isAddingNewFloor = false;

    document.getElementById('floor4').addEventListener('click', () => {
        isAddingNewFloor = false; // Set to false
        selectFloor('etaj4');
        document.querySelector('.selected-seats-message').style.display = 'block'; // Show the "You selected..." section
    });

    document.getElementById('floor6').addEventListener('click', () => {
        isAddingNewFloor = false; // Set to false
        selectFloor('etaj6');
        document.querySelector('.selected-seats-message').style.display = 'block'; // Show the "You selected..." section
    });

    document.getElementById('add-new-floor').addEventListener('click', () => {
        isAddingNewFloor = true;
        addNewFloor(); // Call the addNewFloor function
        document.getElementById('save-layout-container').style.display = 'block'; // Show the Save layout button
        document.querySelector('.selected-seats-message').style.display = 'none'; // Hide the "You selected..." section
        document.querySelector('.selected-options').style.display = 'none'; // Hide the selected items section
    });

    document.getElementById('monday').addEventListener('click', () => {
        selectDay('Monday');
    });

    document.getElementById('tuesday').addEventListener('click', () => {
        selectDay('Tuesday');
    });

    document.getElementById('wednesday').addEventListener('click', () => {
        selectDay('Wednesday');
    });

    document.getElementById('thursday').addEventListener('click', () => {
        selectDay('Thursday');
    });

    document.getElementById('friday').addEventListener('click', () => {
        selectDay('Friday');
    });

    const selectButton = document.querySelector('.select');
    selectButton.addEventListener('click', () => {
        generateBookingMessage();
        openModal();
    });

    document.getElementById('save-layout').addEventListener('click', () => {
        openAdminModal();
    });
});

const loginForm = document.querySelector('.login form');
loginForm.addEventListener('submit', validateCredentials);

document.addEventListener('DOMContentLoaded', loadSeatingArrangement);