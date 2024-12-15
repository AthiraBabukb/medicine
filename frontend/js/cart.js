// Fetch and display cart details
async function fetchCartDetails() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to view your cart.");
        window.location.href = "login.html";
        return;
    }

    try {
        const userResponse = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error("Unable to fetch user details.");

        const { _id: userId } = await userResponse.json();

        const cartResponse = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!cartResponse.ok) throw new Error("Unable to fetch cart details.");

        const { cartDetails } = await cartResponse.json();
        renderCart(cartDetails);
    } catch (error) {
        console.error("Error fetching cart details:", error);
        alert("Failed to load cart. Please try again later.");
    }
}

// Render cart items in the table
function renderCart(cartDetails) {
    const cartItemsBody = document.getElementById("cart-items-body");
    const cartTotalPrice = document.getElementById("cart-total-price");

    cartItemsBody.innerHTML = "";
    let totalPrice = 0;

    cartDetails.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>₹ ${item.price}</td>
            <td>${item.quantity}</td>
            <td>₹ ${item.total}</td>
        `;
        cartItemsBody.appendChild(row);
        totalPrice += item.total;
    });

    cartTotalPrice.textContent = `₹ ${totalPrice}`;
}

// Toast notification function
function showToast(message, type) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show the toast with animation
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Handle Buy Now button click
async function handleBuyNow() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to proceed with the purchase.");
        window.location.href = "login.html";
        return;
    }

    try {
        const userResponse = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user details.");

        const user = await userResponse.json();

        if (!user.credit_card || user.credit_card === "") {
            showToast("Please add your credit card information.", "error");
            // Redirect to user.html after showing the message
            setTimeout(() => {
                window.location.href = "user.html";
            }, 3000); // Delay to allow toast message to be visible
        } else {
            showToast("Thanks for purchasing!", "success");
        }
    } catch (error) {
        console.error("Error processing purchase:", error);
        alert("An error occurred. Please try again later.");
    }
}

// Initialize cart page
window.onload = () => {
    fetchCartDetails();
    document.getElementById("buy-now").addEventListener("click", handleBuyNow);
};
