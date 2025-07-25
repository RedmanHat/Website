document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    let cartVisible = false;
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const closeCartBtn = document.getElementById('close-cart');
    const proceedToPaymentBtn = document.getElementById('proceed-to-payment');
    const cartIcon = document.getElementById('cart-icon');

    // Add click event to all cart buttons
    document.querySelectorAll('.pro .cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the product click event
            const productElement = this.closest('.pro');
            addToCart(productElement);
        });
    });

    // Toggle cart visibility
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCart();
    });

    closeCartBtn.addEventListener('click', toggleCart);
    
    // Proceed to payment
    proceedToPaymentBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('cartTotal', cartTotalElement.textContent);
            window.location.href = 'Payment.html';
        }
    });

    function addToCart(productElement) {
        const productImg = productElement.querySelector('img').src;
        const productBrand = productElement.querySelector('.des span').textContent;
        const productName = productElement.querySelector('.des h5').textContent;
        const productPrice = parseFloat(productElement.querySelector('.des h4').textContent.replace('$', ''));
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                img: productImg,
                brand: productBrand,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Show cart if not visible
        if (!cartVisible) {
            toggleCart();
        }
        
        // Show cart count
        updateCartCount();
    }

    function updateCart() {
        // Clear current items
        cartItemsContainer.innerHTML = '';
        
        // Add each item
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <span>${item.brand}</span>
                    <h5>${item.name}</h5>
                    <div>$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Update total
        cartTotalElement.textContent = total.toFixed(2);
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
                updateCartCount();
                if (cart.length === 0 && cartVisible) {
                    toggleCart();
                }
            });
        });
    }

    function toggleCart() {
        cartVisible = !cartVisible;
        if (cartVisible) {
            cartSidebar.classList.add('visible');
        } else {
            cartSidebar.classList.remove('visible');
        }
    }

    function updateCartCount() {
        let cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            if (!cartCount) {
                cartCount = document.createElement('span');
                cartCount.id = 'cart-count';
                cartIcon.appendChild(cartCount);
            }
            cartCount.textContent = totalItems;
        } else if (cartCount) {
            cartCount.remove();
        }
    }

    // Show cart when scrolling
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100 && cart.length > 0 && !cartVisible) {
            toggleCart();
        }
    });
});