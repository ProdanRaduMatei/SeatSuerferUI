const userId = 1;
const isAdmin = true;
let seats;
const container = document.querySelector('.container');

const reserveButton = document.querySelector('.reserve-button');
reserveButton.addEventListener('click', () => {
    generateReservationMessage();
    openModal();
});

const openModal = () => {
    const modal = document.querySelector('.modal');
    const closeModalButton = document.querySelector('.close-modal');

    modal.style.display = 'block';

    closeModalButton.addEventListener('click', () => {
        closeModal();
    });
};

const closeModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
};

const updateSelectedCount = () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedSeatsCount = selectedSeats.length - 1;

    document.querySelector('#total').innerText = selectedSeatsCount;
};

const fetchJsonData = url => {
    fetch(url).then(response => response.json()).then(data => {
        const seatingArrangement = data.arrangement;
        seats = data.seats;
        generateSeats(seatingArrangement);
        calculateTotalPrice();
    });
};

const handleStoreySelection = () => {
    const storeySelect = document.getElementById('storey');
    const selectedStoreyValue = storeySelect.value;
    let url;

    switch (selectedStoreyValue) {
        case '1':
            url = 'caldire/etaj4/day1.json';
            console.log('the url is ', url);
            break;
        case '2':
            url = 'cladire/etaj4/day2.json';
            console.log('the url is ', url);
            break;
        case '3':
            url = 'cladire/etaj6/day1.json';
            console.log('the url is ', url);
            break;
        case '4':
            url = 'cladire/etaj6/day2.json';
            console.log('the url is ', url);
            break;
    }
    fetchJsonData(url);
};

const generateSeats = seatingArrangement => {
    container.innerHTML = '<div class = "screen"></div>';
    seatingArrangement.forEach((row, rowIndex) => {
        const seatRow = document.createElement('div');
        seatRow.classList.add('row');

        row.forEach((seatType, seatIndex) => {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.classList.add('seat-${seatIndex + 1}');

            seat.id = 'seat-${rowIndex + 1}-${seatIndex + 1}';

            if (seatType === 1)
                seat.classList.add('occupied');
            else if (seatType === 2) {
                seat.classList.add('corridor');
                seat.removeAttribute('id');
            }
            if (seatType === 0)
                seat.addEventListener('click', () => {
                    handleSeatSelection(seat);
                });
        });
        container.appendChild(seatRow);
    });
};

const handleSeatSelection = seat => {
    seat.classList.toggle('selected');
    updateSelectedCount();
    generateTicketMessage();
};

const generateTicketMessage = () => {
    const selectedSeats = document.querySelectorAll('seat.selected');
    const selectedIdMessages = [];

    selectedSeats.forEach(seat => {
        const seatId = seat.id;
        const idParts = seatId.split('-');

        if (idParts.length === 3) {
            const rowNumber = idParts[1];
            const seatNumber = idParts[2];
            const seatMessage = 'Seat ${seatNumber}, row ${rowNumber}';
            seatIdMessage.push(seatMessage);
        }
    });

    const ticketMessage = seatIdMessage.join(', ');
    const ticketMessageElement = document.getElementById('ticket-message');
    ticketMessageElement.textContent = 'Your seats are: ${ticketMessage}';
};

const seatSelect = document.getElementById('storey');
seatSelect.addEventListener('change', handleStoreySelection);

handleStoreySelection();