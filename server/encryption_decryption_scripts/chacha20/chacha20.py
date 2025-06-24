import sys
import json
from base64 import b64encode, b64decode
from Crypto.Cipher import ChaCha20
from Crypto.Random import get_random_bytes
import hashlib

class ChaCha20Cipher:
    """
    This class provides methods to encrypt and decrypt messages using the ChaCha20 encryption algorithm.
    The key is hashed to a consistent length using SHA-256 to ensure security regardless of the input key length.
    """

    def __init__(self, key: str):
        """
        Initializes the cipher object with a specified key.

        :param key: The secret key used for encryption and decryption. The key will be hashed to SHA-256.
        """
        self.key = hashlib.sha256(key.encode()).digest()  # Hash the key to get a 256-bit key

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypts plaintext using ChaCha20 algorithm with a randomly generated nonce.

        :param plaintext: The plaintext string to encrypt.
        :return: A JSON string containing the nonce and ciphertext, both base64-encoded.
        """
        cipher = ChaCha20.new(key=self.key)
        ciphertext = cipher.encrypt(plaintext.encode())
        nonce = b64encode(cipher.nonce).decode('utf-8')
        ct = b64encode(ciphertext).decode('utf-8')
        result = json.dumps({'nonce': nonce, 'ciphertext': ct})
        return result

    def decrypt(self, ciphertext: str, nonce: str) -> str:
        """
        Decrypts a ciphertext using ChaCha20 algorithm with the provided nonce.

        :param ciphertext: The base64-encoded ciphertext to decrypt.
        :param nonce: The base64-encoded nonce used during the encryption.
        :return: The decrypted plaintext string.
        """
        nonce = b64decode(nonce)
        ciphertext = b64decode(ciphertext)
        cipher = ChaCha20.new(key=self.key, nonce=nonce)
        plaintext = cipher.decrypt(ciphertext)
        return plaintext.decode('utf-8')

def main() -> None:
    """
    Main function to handle encryption and decryption operations using the ChaCha20 algorithm.

    This function parses command-line arguments to determine whether to perform encryption or decryption.
    For encryption, it requires the plaintext and key, and for decryption, it additionally requires the nonce.

    Usage:
        python chacha20.py <encrypt> <text> <key> -- for encryption
        python chacha20.py <decrypt> <ciphertext> <key> <nonce> -- for decryption

    Args:
        encrypt (str): Command to encrypt the text.
        decrypt (str): Command to decrypt the ciphertext.
        text (str): Plaintext to encrypt.
        ciphertext (str): Ciphertext to decrypt.
        key (str): The secret key used for both encryption and decryption.
        nonce (str): A nonce used for decryption, necessary to match the encryption nonce for successful decryption.

    Returns:
        None: Outputs the result to standard output or an error message to standard error.

    Raises:
        SystemExit: Exits the script with an error if the command format is incorrect or if an encryption/decryption error occurs.
    """

    # Ensure the correct number of arguments for each action
    if len(sys.argv) not in [4, 5]:
        print("Usage: python chacha20.py <encrypt> <text> <key> or <decrypt> <ciphertext> <key> <nonce>", file=sys.stderr)
        sys.exit(1)

    action = sys.argv[1].lower()  # Action to perform (encrypt or decrypt)

    try:
        if action == 'encrypt' and len(sys.argv) == 4:
            text, key = sys.argv[2], sys.argv[3]  # Assign variables for encryption
            chacha = ChaCha20Cipher(key)  # Initialize ChaCha20 cipher with key
            result = chacha.encrypt(text)  # Encrypt the text
        elif action == 'decrypt' and len(sys.argv) == 5:
            ciphertext, key, nonce = sys.argv[2], sys.argv[3], sys.argv[4]  # Assign variables for decryption
            chacha = ChaCha20Cipher(key)  # Initialize ChaCha20 cipher with key and nonce
            result = chacha.decrypt(ciphertext, nonce)  # Decrypt the ciphertext
        else:
            print("Invalid command. Please use the correct format for 'encrypt' or 'decrypt'.", file=sys.stderr)
            sys.exit(1)
        print(result)  # Print the result
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)  # Print error details
        sys.exit(1)

# Ensures this script runs main() when executed directly
if __name__ == "__main__":
    main()


