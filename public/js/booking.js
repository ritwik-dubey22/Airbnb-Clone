document.addEventListener("DOMContentLoaded", () => {
    const checkInInput = document.getElementById("bookingCheckIn");
    const checkOutInput = document.getElementById("bookingCheckOut");
    const totalNights = document.getElementById("bookingNights");
    const totalPrice = document.getElementById("bookingTotalPrice");
    const bookingTotalInput = document.getElementById("bookingTotal");
    const listingPrice = Number(document.getElementById("listingPrice").dataset.price || 0);
    const unavailableRanges = JSON.parse(document.getElementById("unavailableRanges").textContent || "[]");
    const bookingMessage = document.getElementById("bookingMessage");

    const calculateNights = (checkIn, checkOut) => {
        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.ceil((checkOut - checkIn) / msPerDay);
    };

    const isRangeUnavailable = (startDate, endDate) => {
        return unavailableRanges.some((range) => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            return startDate < end && endDate > start;
        });
    };

    const updateBookingSummary = () => {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);

        bookingMessage.textContent = "";

        if (checkInInput.value && checkOutInput.value) {
            if (checkOut <= checkIn) {
                bookingMessage.textContent = "Check-out must be after check-in.";
                totalNights.textContent = "0";
                totalPrice.textContent = "0";
                bookingTotalInput.value = "";
                return;
            }

            const nights = calculateNights(checkIn, checkOut);
            const conflict = isRangeUnavailable(checkIn, checkOut);

            if (conflict) {
                bookingMessage.textContent = "One or more selected dates are already booked.";
                totalNights.textContent = nights;
                totalPrice.textContent = "0";
                bookingTotalInput.value = "";
                return;
            }

            const total = listingPrice * nights;
            totalNights.textContent = nights;
            totalPrice.textContent = total.toLocaleString("en-IN");
            bookingTotalInput.value = total;
        }
    };

    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener("change", updateBookingSummary);
        checkOutInput.addEventListener("change", updateBookingSummary);
    }
});