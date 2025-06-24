import sys
import json
from base64 import b64encode, b64decode
from Crypto.Cipher import Salsa20
import hashlib

class Salsa20Cipher:
    """
    This class provides methods to encrypt and decrypt messages using the Salsa20 encryption algorithm.
    It supports key sizes of 128-bit and 256-bit, specified at initialization.
    """

    def __init__(self, key: str, mode: str):
        """
        Initializes the cipher object with a specified key and mode.

        :param key: The secret key used for encryption and decryption, hashed to SHA-256.
        :param mode: The mode specifying the key size ('128' for 128-bit, '256' for 256-bit).
        """
        hashed_key = hashlib.sha256(key.encode()).digest()
        if mode == 'Salsa20-128':
            self.key = hashed_key[:16]  # Using only the first 16 bytes for 128-bit key
        elif mode == 'Salsa20-256':
            self.key = hashed_key[:32]  # Using only the first 32 bytes for 256-bit key
        else:
            raise ValueError("Unsupported key size. Valid options are '128' or '256'.")

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypts plaintext using the Salsa20 algorithm with a randomly generated nonce.

        :param plaintext: The plaintext string to encrypt.
        :return: A JSON string containing the nonce and ciphertext, both base64-encoded.
        """
        cipher = Salsa20.new(key=self.key)
        ciphertext = cipher.encrypt(plaintext.encode())
        nonce = b64encode(cipher.nonce).decode('utf-8')
        ct = b64encode(ciphertext).decode('utf-8')
        result = json.dumps({'nonce': nonce, 'ciphertext': ct})
        return result

    def decrypt(self, ciphertext: str, nonce: str) -> str:
        """
        Decrypts a ciphertext using Salsa20 algorithm given a nonce.

        :param ciphertext: The base64-encoded ciphertext to decrypt.
        :param nonce: The base64-encoded nonce used during encryption.
        :return: The decrypted plaintext string.
        """
        nonce = b64decode(nonce)
        ciphertext = b64decode(ciphertext)
        cipher = Salsa20.new(key=self.key, nonce=nonce)
        plaintext = cipher.decrypt(ciphertext)
        return plaintext.decode('utf-8')

def main() -> None:
    """
    Main function to handle command line arguments for encryption and decryption using the Salsa20 algorithm.
    Expects command line arguments to specify the action (encrypt or decrypt), the text to process,
    the key to use, the mode specifying key length, and optionally the nonce for decryption.

    Usage:
    python salsa20.py encrypt <text> <key> <mode>
    python salsa20.py decrypt <ciphertext> <key> <mode> <nonce>
    """
    # Validate command line arguments
    if len(sys.argv) < 5 or (sys.argv[1] == 'decrypt' and len(sys.argv) != 6):
        print("Usage: python salsa20.py <encrypt|decrypt> <text|ciphertext> <key> <mode> [<nonce>]", file=sys.stderr)
        sys.exit(1)

    # Parse command line arguments
    action: str = sys.argv[1].lower()
    text: str = sys.argv[2]
    key: str = sys.argv[3]
    mode: str = sys.argv[4]
    nonce: str = sys.argv[5] if len(sys.argv) == 6 else None  # Only needed for decryption

    # Initialize the Salsa20 cipher with the specified key and mode
    salsa: Salsa20Cipher = Salsa20Cipher(key, mode)

    try:
        # Perform encryption or decryption based on the specified action
        if action == 'encrypt':
            result: str = salsa.encrypt(text)
        elif action == 'decrypt':
            if nonce is None:
                raise ValueError("Nonce required for decryption.")
            result: str = salsa.decrypt(text, nonce)
        else:
            print("Invalid action. Use 'encrypt' or 'decrypt'.", file=sys.stderr)
            sys.exit(1)

        # Output the result
        print(result)
    except Exception as e:
        # Handle any exceptions that occur during encryption or decryption
        print(f"An error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

