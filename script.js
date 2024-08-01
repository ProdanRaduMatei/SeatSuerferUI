let bookingMessageDisplayed = false;
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

// Update the count number of the seats
const updateSelectedCount = () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedSeatsCount = selectedSeats.length - 1;

    document.querySelector('#count').innerText = selectedSeatsCount;
};

// Calculate the total price of selected seats
const calculateTotalPrice = () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedSeatsCount = selectedSeats.length - 1;

    const ticketPrice = price;
    const totalPrice = selectedSeatsCount * ticketPrice;

    document.querySelector('#total').innerText = totalPrice;
};

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

const generateSeats = seatingArrangement => {
    container.innerHTML = '<div class="walls"></div>';

    seatingArrangement.forEach((row, rowIndex) => {
        const seatRow = document.createElement('div');
        seatRow.classList.add('row');

        row.forEach((seatType, seatIndex) => {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.classList.add(`seat-${seatIndex + 1}`);

        seat.id = `seat-${rowIndex + 1}-${seatIndex + 1}`;

        if (seatType === 1) {
            seat.classList.add('occupied');
        } else if (seatType === 2) {
            seat.classList.add('corridor');
            seat.removeAttribute('id');
        }
        if (seatType === 0) {
            seat.addEventListener('click', () => {
            handleSeatSelection(seat);
            });
        }
        seatRow.appendChild(seat);
        });

        container.appendChild(seatRow);
    });
};

const handleSeatSelection = seat => {
    seat.classList.toggle('selected');
    updateSelectedCount();
    calculateTotalPrice();
    generateBookingMessage();
};

const generateBookingMessage = () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const seatIdMessages = [];

    selectedSeats.forEach(seat => {
        const seatId = seat.id;
        const idParts = seatId.split('-');

        if (idParts.length === 3) {
        const rowNumber = idParts[1];
        const seatNumber = idParts[2];
        const seatMessage = `Seat ${seatNumber}, row ${rowNumber}`;
        seatIdMessages.push(seatMessage);
        }
    });

    const bookingMessage = seatIdMessages.join(', ');
    const bookingMessageElement = document.getElementById('seat-message');
    bookingMessageElement.textContent = `Your seats are: ${bookingMessage}`;
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
}

function displaySeatingArrangement(arrangement) {
    const seatingArea = document.querySelector('.seating-area');
    seatingArea.innerHTML = ''; // Clear previous seating arrangement

    arrangement.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        row.forEach(seat => {
            const seatDiv = document.createElement('div');
            if (seat === 1)
                seatDiv.classList.add('seat', 'rotated-up');
            else if (seat === 11)
                seatDiv.classList.add('seat', 'rotated-left');
            else if (seat === 12)
                seatDiv.classList.add('seat', 'rotated-right');
            else if (seat === 13)
                seatDiv.classList.add('seat');
            else if (seat === 2)
                seatDiv.classList.add('seat', 'occupied');
            else if (seat === 21)
                seatDiv.classList.add('seat', 'occupied', 'rotated-up');
            else if (seat === 22)
                seatDiv.classList.add('seat', 'occupied', 'rotated-right');
            else if (seat === 23)
                seatDiv.classList.add('seat', 'occupied', 'rotated-left');
            else if (seat === 0)
                seatDiv.classList.add('seat', 'corridor');

            // Add click event listener to toggle the selected class
            seatDiv.addEventListener('click', () => {
                if (!seatDiv.classList.contains('occupied') && !seatDiv.classList.contains('corridor')) {
                    seatDiv.classList.toggle('selected');
                }
            });

            rowDiv.appendChild(seatDiv);
        });

        seatingArea.appendChild(rowDiv);
    });
}

// Load initial seating arrangement on page load
document.addEventListener('DOMContentLoaded', loadSeatingArrangement);