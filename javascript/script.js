// Add this function to your existing script.js file
// Ensure it's inside the DOMContentLoaded listener if you use one

function startDealTimers() {
    const dealTimers = document.querySelectorAll('.deal-timer');

    dealTimers.forEach(timerElement => {
        const endTimeString = timerElement.dataset.endTime; // Get end time from data attribute
        const endTime = new Date(endTimeString).getTime();
        const countdownSpan = timerElement.querySelector('.countdown');

        if (isNaN(endTime)) {
            countdownSpan.textContent = 'Invalid Time';
            timerElement.style.backgroundColor = '#ccc'; // Grey out if invalid
            return; // Skip this timer if date is invalid
        }

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                countdownSpan.textContent = 'EXPIRED!';
                timerElement.style.backgroundColor = '#6c757d'; // Grey out when expired
                timerElement.style.color = '#fff';
                // You might want to disable the "Add to Cart" button here
                const addToCartBtn = timerElement.nextElementSibling; // Assuming button is next sibling
                if (addToCartBtn && addToCartBtn.classList.contains('btn-add-to-cart')) {
                    addToCartBtn.disabled = true;
                    addToCartBtn.style.opacity = '0.7';
                    addToCartBtn.style.cursor = 'not-allowed';
                    addToCartBtn.textContent = 'Expired';
                }
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Format the countdown display
            let countdownText = '';
            if (days > 0) {
                countdownText += `${days}d `;
            }
            countdownText += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            countdownSpan.textContent = countdownText;
        };

        // Update countdown immediately and then every second
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
    });
}

// Ensure this function is called when the DOM is ready, especially on the deals page.
// If your script.js already has a DOMContentLoaded listener, put the call inside it:
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code here (e.g., shopping cart logic) ...

    // Call the deal timers function if on the deals page or on any page with deal timers
    if (document.querySelector('.deal-timer')) { // Only run if there are timers on the page
        startDealTimers();
    }
});