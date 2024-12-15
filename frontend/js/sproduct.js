let availableStock = 0; // Store current product stock
let userId = ''; // Store logged-in user's ID

// Fetch logged-in user's details
async function fetchUserDetails() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('User not logged in');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const user = await response.json();
            userId = user._id;

            // Display user ID on the page
            const userIdElement = document.getElementById('user-id');
            userIdElement.textContent = `User ID: ${userId}`;
        } else {
            throw new Error('Failed to fetch user details');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        window.location.href = 'login.html'; // Redirect if user details cannot be fetched
    }
}

// Fetch product details
async function fetchProductDetails() {
    const productId = new URLSearchParams(window.location.search).get('productId');
    if (!productId) {
        console.error('Invalid product ID');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');

        const product = await response.json();
        availableStock = product.stock;

        // Update product details on the page
        document.getElementById('MainImg').src = `image/products/${encodeURIComponent(product.name)}.png`;
        document.querySelector('.product-name').textContent = product.name;
        document.querySelector('.product-price').textContent = `₹ ${product.price}`;
        document.querySelector('.stock').textContent = `Stock: ${availableStock}`;
        document.querySelector('.composition').textContent = `Composition: ${product.composition}`;
        document.querySelector('.consume_Type').textContent = `Consume Type: ${product.consume_Type}`;
        document.querySelector('.company_name').textContent = `Manufacturer/Marketer: ${product.company_name}`;
        document.querySelector('.return_policy').textContent = `Return Policy: ${product.return_policy}`;
    } catch (error) {
        console.error('Error fetching product details:', error);
        alert('Failed to load product details.');
    }
}

// Add product to cart
document.getElementById('add-to-cart-btn').addEventListener('click', async () => {
    const productId = new URLSearchParams(window.location.search).get('productId');
    const quantity = parseInt(document.getElementById('product-quantity').value);

    if (!productId || !quantity || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }

    if (quantity > availableStock) {
        alert(`Only ${availableStock} items are in stock.`);
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/cart/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ userId, productId, quantity }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Product added to cart:', result.cart);

            // Decrease available stock on the UI
            availableStock -= quantity;
            document.querySelector('.stock').textContent = `Stock: ${availableStock}`;

            // Confirm and redirect to the cart
            const goToCart = confirm('Product added to cart successfully. Do you want to view your cart?');
            if (goToCart) {
                window.location.href = 'cart.html';
            }
        } else {
            const result = await response.json();
            alert(result.message || 'Failed to add product to cart.');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Something went wrong. Please try again.');
    }
});

// Initialize the page
window.onload = async () => {
    await fetchUserDetails();
    await fetchProductDetails();
};
