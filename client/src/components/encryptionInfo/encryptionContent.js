const encryptionAlgorithms = [
    {
        key: 'AES',
        title: "AES (Advanced Encryption Standard)",
        body: `Advanced Encryption Standard (AES) is a specification for the encryption of electronic data established by the U.S National Institute of Standards and Technology (NIST) in 2001. AES is widely used today as it is much stronger than DES and triple DES despite being harder to implement.
        
        Some important points:`,
        list: [
            "AES is a block cipher.",
            "The key size can be 128/192/256 bits.",
            "Encrypts data in blocks of 128 bits each.",
            "AES relies on substitution-permutation network principle which involves replacing and shuffling of the input data."
        ],
        conclusion: `That means it takes 128 bits as input and outputs 128 bits of encrypted cipher text as output. AES relies on substitution-permutation network principle which means it is performed using a series of linked operations which involves replacing and shuffling of the input data.`,
        reference: `Source: GeeksforGeeks, 2023`
    },

    {
        key: 'Blowfish',
        title: "Blowfish",
        body: `Blowfish is an encryption technique designed by Bruce Schneier in 1993 as an alternative to DES Encryption Technique. It is significantly faster than DES and provides a good encryption rate with no effective cryptanalysis technique found to date. It is one of the first, secure block cyphers not subject to any patents and hence freely available for anyone to use. It is symmetric block cipher algorithm.
        
        Advantages and Disadvantages of Blowfish Algorithm:`,
        list: [
            "Blowfish is a fast block cipher except when changing keys. Each new key requires a pre-processing equivalent to 4KB of text.",
            "It is faster and much better than DES Encryption.",
            "Blowfish uses a 64-bit block size which makes it vulnerable to birthday attacks.",
            "A reduced round variant of blowfish is known to be susceptible to known plain text attacks. ",
            "Number of substitution boxes: 4 [each having 512 entries of 32-bits each]"
        ],
        conclusion: `Some of the applications of Blowfish are: Bulk Encryption, Packet Encryption (ATM Packets), Password Hashing`,
        reference: `Source: GeeksforGeeks, 2024`
    },
    {
        key: 'ChaCha20',
        title: "ChaCha20",
        body: `ChaCha20 is a symmetric encryption algorithm that uses a 256-bit key for both encryption and decryption. It was developed by Daniel J. Bernstein, a renowned cryptographer, in 2008 as a stream cipher. It is designed to provide a combination of speed and security. It is constructed to resist known attacks, including differential cryptanalysis and linear cryptanalysis. Furthermore, it is highly parallelizable, making it easily adaptable to multi-core processors and other high-performance computing systems.
        
        Fundamental steps in the encryption process:`,
        list: [
            "Key Generation: The ChaCha20 algorithm generates a 256-bit key from a user-supplied key and a randomly generated 96-bit nonce.",
            "Initialization: The algorithm uses the key and nonce to initialize the cipher’s state.",
            "Data Encryption: ChaCha20 encrypts each data block using the state of the cipher, which is updated after processing each block.",
            "Output: The resulting ciphertext is produced by XORing the plaintext with the output of the data encryption step",
        ],
        conclusion: `Overall, ChaCha20 is a great algorithm for those seeking speed, security, parallelizability and simple implementation.`,
        reference: `Source: Nagaraj, K., 2024`
    },
    {
        key: 'Salsa20',
        title: "Salsa20",
        body: `Salsa20 encryption, also known as the Salsa family of stream ciphers, is a popular symmetric key stream cipher that has been widely used in various applications, including wireless networks, secure sockets layer (SSL), and virtual private networks (VPNs).
        
        Strengths of Salsa20 Encryption:`,
        list: [
            "It is fast and efficient, making it ideal for applications that require high-speed data encryption and decryption.",
            "It is designed to be secure and has withstood various cryptanalysis attacks over the years.",
            "Salsa20 encryption can be implemented in hardware or software, making it highly versatile and suitable for a wide range of devices and applications.",
            "Salsa20 encryption is a lightweight cipher, meaning it is optimized for performance in low-power devices with limited computing resources.",
        ],
        conclusion: `In conclusion, Salsa20 encryption is a popular symmetric key stream cipher that provides fast and efficient data encryption and decryption. Although it has several strengths, such as speed, efficiency, and security, it also has several known weaknesses, including vulnerabilities that can be exploited by attackers. Therefore, it is important to use Salsa20 encryption judiciously and to implement appropriate measures to mitigate its vulnerabilities.`,
        reference: `Source: Nagaraj, K., 2023`
    },
    {
        key: 'TDES',
        title: "Triple DES (TDES)",
        body: `Triple DES is a type of encryption algorithm that offers enhanced security through its triple-layered encryption technique. Triple DES is a modified version of the Data Encryption Standard (DES) algorithm that was developed by IBM in the 1970s.
        
        Key Features of TDES:`,
        list: [
            "Block Cipher Encryption: TDES is a block cipher encryption algorithm that operates on 64-bit blocks of plaintext at a time.",
            "Symmetric Key Encryption: TDES uses a symmetric key encryption system, meaning that the same key is used for both encryption and decryption.",
            "Triple Layer Encryption: TDES uses three different keys to encrypt the plaintext three times, hence the name Triple DES.",
            "Variable Key Size: TDES supports variable key sizes, ranging from 128 to 192 bits (16 to 24 bytes), offering enhanced security compared to DES.",
        ],
        conclusion: `Triple DES is a widely used encryption algorithm that provides enhanced security through its triple-layered encryption technique. While it has some limitations, such as slower speed and limited key size options, it is still widely used in many applications, such as financial transactions, healthcare systems, and government communications.`,
        reference: `Source: Nagaraj, K., 2023`
    }
];

export default encryptionAlgorithms;
