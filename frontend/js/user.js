// Mask credit card helper function
function maskCreditCard(cardNumber) {
  return cardNumber.replace(/\d(?=\d{4})/g, '*');
}

// Fetch user details and update the UI
async function fetchUserDetails() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch("http://localhost:5000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        throw new Error("Failed to fetch user data");
      }
    }

    const user = await response.json();

    // Mask the credit card number
    const maskedCreditCard = maskCreditCard(user.credit_card);

    // Update the HTML with user details
    document.querySelector('#user-details .user-info').innerHTML = `
      <h2>User Details</h2>
      <p><strong>Name:</strong> <span id="name">${user.name}</span></p>
      <p><strong>Email:</strong> <span id="email">${user.email}</span></p>
      <p><strong>Age:</strong> <span id="age">${user.age}</span></p>
      <p><strong>Gender:</strong> <span id="gender">${user.gender}</span></p>
      <p><strong>Credit Card:</strong> <span id="credit_card">${maskedCreditCard}</span></p>
      <button id="edit-btn" class="edit-btn">Edit</button>
    `;

    // Attach the edit button functionality
    document.getElementById('edit-btn').addEventListener('click', handleEdit);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

// Handle Edit Button Click
function handleEdit() {
  const userInfo = document.querySelector('.user-info');
  const name = document.getElementById('name').textContent;
  const email = document.getElementById('email').textContent;
  const age = document.getElementById('age').textContent;
  const gender = document.getElementById('gender').textContent;
  const creditCard = document.getElementById('credit_card').textContent.replace(/\*/g, ''); // Unmask for editing

  // Replace static text with input fields
  userInfo.innerHTML = `
    <h2>Edit User Details</h2>
    <label>Name: <input type="text" id="edit-name" value="${name}" /></label><br>
    <label>Email: <input type="email" id="edit-email" value="${email}" /></label><br>
    <label>Age: <input type="number" id="edit-age" value="${age}" /></label><br>
    <label>Gender: 
      <select id="edit-gender">
        <option value="Male" ${gender === 'Male' ? 'selected' : ''}>Male</option>
        <option value="Female" ${gender === 'Female' ? 'selected' : ''}>Female</option>
        <option value="Other" ${gender === 'Other' ? 'selected' : ''}>Other</option>
      </select>
    </label><br>
    <label>Credit Card: <input type="text" id="edit-credit-card" value="${creditCard}" /></label><br>
    <button id="save-btn" class="save-btn">Save</button>
    <button id="cancel-btn" class="cancel-btn">Cancel</button>
  `;

  // Attach event listeners for Save and Cancel buttons
  document.getElementById('save-btn').addEventListener('click', handleSave);
  document.getElementById('cancel-btn').addEventListener('click', fetchUserDetails);
}

// Handle Save Button Click
async function handleSave() {
  const updatedUser = {
    name: document.getElementById('edit-name').value,
    email: document.getElementById('edit-email').value,
    age: document.getElementById('edit-age').value,
    gender: document.getElementById('edit-gender').value,
    credit_card: document.getElementById('edit-credit-card').value, // Send unmasked data to backend
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch("http://localhost:5000/api/users/me", {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      throw new Error("Failed to update user data");
    }

    // Reload the user details after a successful save
    fetchUserDetails();
  } catch (error) {
    console.error('Error saving user details:', error);
  }
}

// Call the function to load user details
fetchUserDetails();
