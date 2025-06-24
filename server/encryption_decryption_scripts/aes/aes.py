import sys
import base64
import hashlib
from typing import Union
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

class AESCipher:
    """
    This class provides methods to encrypt and decrypt data using the AES algorithm
    with varying key sizes specified by the mode (128-bit, 192-bit, or 256-bit).
    """

    def __init__(self, key: str, mode: str):
        """
        Initializes the cipher with a key and mode.
        The key is hashed to produce a fixed size AES key.
        
        Args:
        key (str): The secret key used for encryption and decryption.
        mode (str): Specifies the AES mode as 'AES-256-CBC', 'AES-192-CBC', or 'AES-128-CBC'.
        """
        self.bs = AES.block_size  # AES block size for padding
        # Determine key size based on mode and truncate SHA-256 hash accordingly
        if mode == 'AES-256-CBC':
            self.key = hashlib.sha256(key.encode()).digest()  # Full SHA-256 hash for 256-bit key
        elif mode == 'AES-192-CBC':
            self.key = hashlib.sha256(key.encode()).digest()[:24]  # First 24 bytes for 192-bit key
        elif mode == 'AES-128-CBC':
            self.key = hashlib.sha256(key.encode()).digest()[:16]  # First 16 bytes for 128-bit key
        else:
            raise ValueError("Unsupported AES mode")

    def encrypt(self, raw: str) -> str:
        """
        Encrypts plaintext using AES encryption in CBC mode.
        
        Args:
        raw (str): The plaintext to encrypt.
        
        Returns:
        str: The encrypted text, encoded in base64.
        """
        raw_padded = pad(raw.encode(), self.bs)  # Pad plaintext to block size
        iv = get_random_bytes(self.bs)  # Generate a random initialization vector (IV)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)  # Create new AES cipher instance with IV
        encrypted_data = cipher.encrypt(raw_padded)  # Encrypt the padded plaintext
        return base64.b64encode(iv + encrypted_data).decode('utf-8')  # Return IV + encrypted data base64 encoded

    def decrypt(self, enc: str) -> str:
        """
        Decrypts a piece of data encrypted by this class.
        
        Args:
        enc (str): The encrypted data encoded in base64.
        
        Returns:
        str: The decrypted plaintext.
        """
        enc = base64.b64decode(enc)  # Decode the base64 encoded encrypted data
        iv = enc[:self.bs]  # Extract the IV from the start of the encrypted block
        cipher = AES.new(self.key, AES.MODE_CBC, iv)  # Initialize AES cipher with the extracted IV for decryption
        decrypted_data = cipher.decrypt(enc[self.bs:])  # Decrypt data after the IV
        decrypted = unpad(decrypted_data, self.bs)  # Remove padding from decrypted data
        return decrypted.decode('utf-8')  # Convert bytes to string and return

def main() -> None:
    """
    Main function to handle encryption and decryption operations using the AES algorithm from the command line.

    This function accepts four command line arguments to determine the operation (encrypt or decrypt), the text to be processed,
    the key for encryption/decryption, and the AES mode to use.

    Usage:
        python aes.py <encrypt|decrypt> <text> <key> <mode>

    Args:
        encrypt (str): Command to encrypt the provided text.
        decrypt (str): Command to decrypt the provided text.
        text (str): Text to be encrypted or decrypted.
        key (str): Encryption key used for the AES algorithm.
        mode (str): Specifies the AES mode (e.g., 'AES-256-CBC').

    Raises:
        SystemExit: Exits the script with an error if the command format is incorrect, an invalid action is specified,
                     or if an encryption/decryption error occurs.
    """

    # Check if the correct number of arguments were provided
    if len(sys.argv) != 5:
        print("Usage: python aes.py <encrypt|decrypt> <text> <key> <mode>", file=sys.stderr)
        sys.exit(1)

    action, text, key, mode = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]  # Unpack command line arguments
    aes = AESCipher(key, mode)  # Initialize the AES cipher with the specified key and mode

    try:
        if action == 'encrypt':
            result = aes.encrypt(text)  # Encrypt the text using AES
            print(result)  # Print the encrypted text
        elif action == 'decrypt':
            result = aes.decrypt(text)  # Decrypt the text using AES
            print(result)  # Print the decrypted text
        else:
            print("Invalid action. Use 'encrypt' or 'decrypt'.", file=sys.stderr)  # Inform user of incorrect usage
            sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)  # Print any errors that occur
        sys.exit(1)

# Ensure that this script runs when executed directly
if __name__ == "__main__":
    main()