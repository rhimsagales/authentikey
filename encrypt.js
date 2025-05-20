const CryptoJS = require('crypto-js');

/**
 * Encrypts a given text using RC4 with a blank key.
 * @param {string} plaintext - The text to encrypt.
 * @returns {string} - The encrypted text in base64 format.
 */
function encryptRC4(plaintext) {
    const key = ''; // blank key
    const encrypted = CryptoJS.RC4.encrypt(plaintext, key);
    return encrypted.toString(); // base64 encoded
}


module.exports = {encryptRC4}; 