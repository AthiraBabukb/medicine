const crypto = require('crypto');
const readline = require('readline');

// Define the secret key (same as in usersRoute.js)
const secretKey = 'your-secret-key-12345';

// Encryption function
function encrypt(password) {
  const algorithm = 'aes-256-cbc';
  const iv = Buffer.alloc(16, 0); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, crypto.scryptSync(secretKey, 'salt', 32), iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Read password input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question('Enter a password: ', (password) => {
  const encryptedPassword = encrypt(password);
  console.log(`Encrypted password: ${encryptedPassword}`);
  rl.close();
});
