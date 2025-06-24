import sys
import base64
import hashlib
from Crypto.Cipher import Blowfish
from Crypto.Random import get_random_bytes
from struct import pack, unpack

class BlowfishCipher:
    """
    Class to handle Blowfish encryption and decryption in CBC mode with variable key length.
    This class adjusts the key size to fit Blowfish requirements of 16, 32, or 56 bytes.
    """

    def __init__(self, key: str, mode: str):
        """
        Initialize the cipher with a key that is hashed and adjusted to the correct length.
        
        Args:
            key (str): The encryption key as a string.
            mode (str): Specifies the key size for Blowfish encryption (either '16', '32', or '56' bytes).
        """
        self.bs = Blowfish.block_size
        hashed_key = hashlib.sha256(key.encode()).digest()  # SHA-256 hash of the key

        if mode == 'Blowfish-56-CBC':
            # Repeat the hashed key to match the required length
            repeated_key = (hashed_key * 2)[:56]
            self.key = repeated_key
        elif mode == 'Blowfish-32-CBC':
            self.key = hashed_key  # Use the full 32 bytes of the SHA-256 hash
        elif mode == 'Blowfish-16-CBC':
            self.key = hashed_key[:16]  # Use the first 16 bytes of the SHA-256 hash
        else:
            raise ValueError("Unsupported key size. Valid options are '16', '32', or '56' bytes.")

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypt plaintext using Blowfish encryption in CBC mode.
        
        Args:
            plaintext (str): Plaintext data to encrypt.
        
        Returns:
            str: Encrypted data encoded in base64, including the IV.
        """
        cipher = Blowfish.new(self.key, Blowfish.MODE_CBC)
        plen = self.bs - len(plaintext.encode()) % self.bs
        padding = pack('b'*plen, *(plen,)*plen)
        encrypted_data = cipher.encrypt(plaintext.encode() + padding)
        return base64.b64encode(cipher.iv + encrypted_data).decode('utf-8')

    def decrypt(self, enc_data: str) -> str:
        """
        Decrypt data using Blowfish decryption in CBC mode.
        
        Args:
            enc_data (str): Base64 encoded string containing the IV and encrypted data.
        
        Returns:
            str: Decrypted plaintext.
        """
        enc_data = base64.b64decode(enc_data)
        iv = enc_data[:self.bs]
        cipher = Blowfish.new(self.key, Blowfish.MODE_CBC, iv)
        decrypted_padded_msg = cipher.decrypt(enc_data[self.bs:])
        plen = unpack('b', decrypted_padded_msg[-1:])[0]
        return decrypted_padded_msg[:-plen].decode('utf-8')

def main() -> None:
    """
    Main function to handle encryption and decryption operations using Blowfish algorithm.

    Usage:
        python blowfish.py <encrypt|decrypt> <text|ciphertext> <key> <mode>

    Args:
        encrypt|decrypt (str): Specifies whether to encrypt or decrypt.
        text|ciphertext (str): The plaintext to encrypt or the ciphertext to decrypt.
        key (str): The key used for encryption or decryption.
        mode (str): Specifies the key size ('16', '32', or '56' bytes).

    Returns:
        None: Prints the result of the operation or an error message if something goes wrong.
    """

    # Ensure correct number of command line arguments
    if len(sys.argv) != 5:
        print("Usage: python blowfish.py <encrypt|decrypt> <text> <key> <mode>", file=sys.stderr)
        sys.exit(1)

    # Parse command line arguments
    action = sys.argv[1].lower()  # Action to perform (encrypt or decrypt)
    text = sys.argv[2]  # Text to encrypt or ciphertext to decrypt
    key = sys.argv[3]  # Encryption/decryption key
    mode = sys.argv[4]  # Key size mode

    # Initialize the Blowfish cipher
    bf_cipher = BlowfishCipher(key, mode)

    # Perform encryption or decryption
    try:
        if action == 'encrypt':
            result = bf_cipher.encrypt(text)  # Encrypt the provided text
            print(result)  # Output the encrypted text
        elif action == 'decrypt':
            result = bf_cipher.decrypt(text)  # Decrypt the provided ciphertext
            print(result)  # Output the decrypted text
        else:
            print("Invalid action. Use 'encrypt' or 'decrypt'.", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)  # Output error details
        sys.exit(1)

# Ensures this script runs main() when executed directly
if __name__ == "__main__":
    main()

