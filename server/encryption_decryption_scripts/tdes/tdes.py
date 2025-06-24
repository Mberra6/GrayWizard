import sys
import json
from base64 import b64encode, b64decode
from Crypto.Cipher import DES3
from Crypto.Util.Padding import pad, unpad
import hashlib

class TripleDESCipher:
    """
    Class to handle Triple DES (3DES) encryption and decryption in CBC mode.
    Supports keys of 16 bytes (Option 2) or 24 bytes (Option 1).
    """
    
    def __init__(self, key: str, mode: str):
        """
        Initializes the cipher using a SHA-256 hash of the provided key.
        
        Args:
            key (str): The encryption key as a string.
            mode (str): 'TDES-16' for 16-byte keys, 'TDES-24' for 24-byte keys.
        """
        self.bs = DES3.block_size
        hashed_key = hashlib.sha256(key.encode()).digest()

        if mode == 'TDES-24':
            self.key = DES3.adjust_key_parity(hashed_key[:24])  # Use the first 24 bytes
        elif mode == 'TDES-16':
            self.key = DES3.adjust_key_parity(hashed_key[:16])  # Use the first 16 bytes
        else:
            raise ValueError("Unsupported mode. Valid modes are 'TDES-16' or 'TDES-24'.")

        self.cipher = DES3.new(self.key, DES3.MODE_CBC)  # Create a new 3DES cipher in CBC mode

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypts plaintext using 3DES in CBC mode with PKCS7 padding.
        
        Args:
            plaintext (str): The text to encrypt.
            
        Returns:
            str: The base64-encoded ciphertext.
        """
        padded_text = pad(plaintext.encode(), self.bs)
        encrypted_text = self.cipher.encrypt(padded_text)
        return b64encode(self.cipher.iv + encrypted_text).decode('utf-8')

    def decrypt(self, encrypted_text: str) -> str:
        """
        Decrypts ciphertext using 3DES in CBC mode with PKCS7 padding.
        
        Args:
            encrypted_text (str): The base64-encoded ciphertext to decrypt.
            
        Returns:
            str: The decrypted plaintext.
        """
        encrypted_bytes = b64decode(encrypted_text)
        iv = encrypted_bytes[:self.bs]
        ciphertext = encrypted_bytes[self.bs:]
        cipher = DES3.new(self.key, DES3.MODE_CBC, iv)
        decrypted_text = unpad(cipher.decrypt(ciphertext), self.bs)
        return decrypted_text.decode('utf-8')

def main() -> None:
    """
    Main function to handle command line arguments for encryption and decryption using Triple DES.

    Usage:
        python script.py <encrypt|decrypt> <text|ciphertext> <key> <mode>

    Args:
        encrypt|decrypt (str): Specifies the operation to perform.
        text|ciphertext (str): The text to encrypt or the ciphertext to decrypt.
        key (str): The encryption/decryption key.
        mode (str): The key length mode ('TDES-16' or 'TDES-24').

    Returns:
        None: Prints the result to standard output or an error message to standard error.
    """

    # Check command line arguments length
    if len(sys.argv) != 5:
        print("Usage: python script.py <encrypt|decrypt> <text|ciphertext> <key> <mode>", file=sys.stderr)
        sys.exit(1)

    # Extract command line arguments
    action = sys.argv[1].lower()  # Action to perform ('encrypt' or 'decrypt')
    text = sys.argv[2]  # Text to encrypt or ciphertext to decrypt
    key = sys.argv[3]  # Key for encryption or decryption
    mode = sys.argv[4]  # Key length mode

    # Initialize the Triple DES cipher
    cipher = TripleDESCipher(key, mode)

    # Perform the action based on the input
    try:
        if action == 'encrypt':
            result = cipher.encrypt(text)  # Encrypt the plaintext
            print(result)  # Print the encrypted text
        elif action == 'decrypt':
            result = cipher.decrypt(text)  # Decrypt the ciphertext
            print(result)  # Print the decrypted text
        else:
            print("Invalid action specified. Use 'encrypt' or 'decrypt'.", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)

# Ensures the main function is called when this script is executed directly
if __name__ == "__main__":
    main()

