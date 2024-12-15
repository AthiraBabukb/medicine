// Fetch products from backend API and display them dynamically
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        const container = document.getElementById('products-container');
        container.innerHTML = ''; // Clear existing content

        products.forEach((product) => {
            const productDiv = document.createElement('div');
            productDiv.className = 'pro';

            // Encode product name for use in the image path
            const productNameEncoded = encodeURIComponent(product.name);
            const imagePath = `image/products/${productNameEncoded}.png`;

            // Add an event listener for click to redirect to the product page
            productDiv.addEventListener('click', () => {
                const redirectUrl = `sproduct.html?productId=${product._id}`;
                window.location.href = redirectUrl;
            });

            productDiv.innerHTML = `
                <img src="${imagePath}" alt="${product.name}" onerror="this.src='image/products/f1.png'">
                <div class="des">
                    <h5>${product.name}</h5>
                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fa-solid fa-star-half"></i>
                    </div>
                    <h4>₹ ${product.price}</h4>
                </div>
            `;

            container.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Call the function when the page loads
window.onload = fetchProducts;
