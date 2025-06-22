document.addEventListener('DOMContentLoaded', () => {
    // All your shopping cart JavaScript code goes inside here
    // ...
});






document.addEventListener('DOMContentLoaded', () => {
    const TAX_RATE = 0.10; // 10% tax rate

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    const productGrid = document.getElementById('products');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartItemCountSpan = document.getElementById('cart-item-count');
    const totalItemsCountSpan = document.getElementById('total-items-count');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const cartTaxSpan = document.getElementById('cart-tax');
    const cartGrandTotalSpan = document.getElementById('cart-grand-total');
    const emptyCartMessage = cartItemsContainer.querySelector('.empty-cart-message');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

     

    


    // Function to save cart to Local Storage
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Function to render cart items
    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Clear previous items
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block'; // Show empty message
        } else {
            emptyCartMessage.style.display = 'none'; // Hide empty message
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.dataset.id = item.id; // Store item ID for easy access

                cartItemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} each</p>
                        </div>
                    </div>
                    <div class="item-quantity-controls">
                        <button class="decrease-quantity-btn">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity-btn">+</button>
                    </div>
                    <button class="remove-item-btn">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        updateCartSummary();
        saveCart(); // Save cart state after rendering
    }

    // Function to update cart summary (totals, tax, item count)
    function updateCartSummary() {
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * TAX_RATE;
        const grandTotal = subtotal + tax;

        cartItemCountSpan.textContent = totalItems;
        totalItemsCountSpan.textContent = totalItems;
        cartSubtotalSpan.textContent = subtotal.toFixed(2);
        cartTaxSpan.textContent = tax.toFixed(2);
        cartGrandTotalSpan.textContent = grandTotal.toFixed(2);
    }

    // Event Listener for "Add to Cart" buttons
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productItem = event.target.closest('.product-item');
            const productId = productItem.dataset.id;
            const productName = productItem.dataset.name;
            const productPrice = parseFloat(productItem.dataset.price);
            // Assuming image src is the same as the product placeholder image
            const productImage = productItem.querySelector('img').src;

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            renderCart();
        }
    });

    // Event Listener for cart item controls (increase, decrease, remove)
    cartItemsContainer.addEventListener('click', (event) => {
        const cartItemDiv = event.target.closest('.cart-item');
        if (!cartItemDiv) return; // Not a cart item element

        const productId = cartItemDiv.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) { // Item found in cart
            if (event.target.classList.contains('increase-quantity-btn')) {
                cart[itemIndex].quantity++;
            } else if (event.target.classList.contains('decrease-quantity-btn')) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    // Remove item if quantity goes to 0
                    cart.splice(itemIndex, 1);
                }
            } else if (event.target.classList.contains('remove-item-btn')) {
                cart.splice(itemIndex, 1); // Remove item completely
            }
            renderCart();
        }
    });

    // Event Listener for Clear Cart button
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            renderCart();
        }
    });

    // Function to generate receipt content
    function generateReceiptContent() {
        if (cart.length === 0) {
            return '<p style="text-align: center;">Your cart is empty. No receipt to print.</p>';
        }

        let receiptHTML = `
            <div class="receipt-content">
                <h2>Your Awesome Store</h2>
                <h3>--- Official Receipt ---</h3>
                <p>Date: ${new Date().toLocaleString()}</p>
                <hr style="border-top: 1px dashed #000; margin: 10px 0;">
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let subtotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            receiptHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        });

        const tax = subtotal * TAX_RATE;
        const grandTotal = subtotal + tax;

        receiptHTML += `
                    </tbody>
                </table>
                <hr style="border-top: 1px dashed #000; margin: 10px 0;">
                <div class="receipt-total">
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                    <p>Tax (${(TAX_RATE * 100).toFixed(0)}%): $${tax.toFixed(2)}</p>
                    <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
                </div>
                <hr style="border-top: 1px dashed #000; margin: 10px 0;">
                <p class="receipt-footer">Thank you for your purchase!</p>
                <p class="receipt-footer">Visit us again soon!</p>
            </div>
        `;
        return receiptHTML;
    }

    // Event Listener for Checkout & Print Receipt button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }

        const receiptWindow = window.open('', '_blank', 'width=400,height=600');
        if (receiptWindow) {
            receiptWindow.document.write('<html><head><title>Receipt</title>');
            receiptWindow.document.write('<style>');
            receiptWindow.document.write(`
                body { font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #000; margin: 0; padding: 20px; box-sizing: border-box; }
                h2, h3 { text-align: center; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                th, td { border-bottom: 1px dashed #bbb; padding: 5px 0; text-align: left; }
                th { font-weight: bold; }
                .receipt-total { text-align: right; font-size: 14px; font-weight: bold; margin-top: 10px; }
                .receipt-total p { margin: 5px 0; }
                .receipt-footer { text-align: center; margin-top: 20px; font-size: 10px; }
                hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
                @media print {
                    /* Only the content inside the new window should be visible */
                    body { visibility: visible !important; }
                    .receipt-content {
                        position: static !important; /* Override absolute positioning for print */
                        width: auto !important;
                        padding: 0 !important;
                        box-sizing: content-box !important;
                    }
                }
            `);
            receiptWindow.document.write('</style></head><body>');
            receiptWindow.document.write(generateReceiptContent());
            receiptWindow.document.write('</body></html>');
            receiptWindow.document.close();
            receiptWindow.print(); // Trigger the print dialog
        } else {
            alert('Please allow pop-ups for printing your receipt.');
        }

        // Clear cart after printing (optional, can be done after actual payment in a real app)
        // cart = [];
        // renderCart();
    });


    // Initial render of the cart when the page loads
    renderCart();
});

const productGrid = document.getElementById('products');
// ...
productGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
        // ...
    }
});