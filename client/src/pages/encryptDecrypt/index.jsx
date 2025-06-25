// Import necessary libraries and components
import React, { useState } from 'react';
import { MdOutlineEnhancedEncryption } from "react-icons/md"; // Icon for visual enhancement
import PageHeader from '../../components/pageHeader'; // Reusable component for page headers
import { Animate } from 'react-simple-animate'; // Animation library to add visual effects
import EncryptionInfo from '../../components/encryptionInfo';
import './styles.scss'; // Stylesheet for specific styling

// Main React functional component for the encryption/decryption tool
const EncryptionDecryption = () => {
    // State variables to store the current mode (encrypt/decrypt), selected algorithm, and necessary keys
    const [mode, setMode] = useState('encrypt'); // State for tracking encryption or decryption mode
    const [algorithm, setAlgorithm] = useState('AES-256-CBC'); // State for selected encryption algorithm
    const [keyRequired, setKeyRequired] = useState(true); // State to determine if a key is required
    const [text, setText] = useState(''); // State for the text to encrypt/decrypt
    const [resultText, setResultText] = useState(''); // State for the result text
    const [encryptionKey, setEncryptionKey] = useState(''); // State for the encryption key
    const [nonce, setNonce] = useState(''); // State to check if nonce necessary for Chacha20

    // Handles changes in encryption/decryption mode
    const handleModeChange = (event) => {
        setMode(event.target.value);
        setText('');
        setResultText('');
    };

    // Handles changes in the selected encryption algorithm
    const handleAlgorithmChange = (event) => {
        const newAlgorithm = event.target.value;
        setAlgorithm(newAlgorithm);
        // Determine if an encryption key is necessary
        if (['AES-256-CBC', 'AES-192-CBC', 'AES-128-CBC', 'Blowfish-16-CBC', 'Blowfish-32-CBC', 'Blowfish-56-CBC','ChaCha20', 'Salsa20-128', 'Salsa20-256', 'TDES-16', 'TDES-24'].includes(newAlgorithm)) {
            setKeyRequired(true);
        } else {
            setKeyRequired(false);
            setEncryptionKey('');
        }
        setText('');
        setResultText('');
        setEncryptionKey('');
        setNonce(''); // Reset nonce when changing algorithm
    };

    // Updates the text based on user input
    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    // Updates the encryption key based on user input
    const handleKeyChange = (event) => {
        setEncryptionKey(event.target.value);
    };

    const handleNonceChange = (event) => {
        setNonce(event.target.value);
    };

    // Calls the API to perform encryption or decryption when the form is submitted
    const handleEncryptDecrypt = async (event) => {
        event.preventDefault(); // Prevent the form from submitting traditionally

        // Client-side validation
        if (!text.trim()) {
            setResultText("Please enter some text to " + mode + ".");
            return;
        }

        if (keyRequired && !encryptionKey.trim()) {
            setResultText("Please provide an encryption key.");
            return;
        }

        if (((algorithm === 'Chacha20' && mode === 'decrypt') || (algorithm.startsWith('Salsa20') && mode === 'decrypt')) && !nonce.trim()) {
            setResultText("Please provide a nonce for decryption.");
            return;
        }

        const apiUrl = mode === 'encrypt' ? `/api/encrypt` : `/api/decrypt`; // Construct the API URL based on mode
        const payload = {
            algorithm,
            text,
            key: encryptionKey,
            nonce: ((algorithm === 'Chacha20' && mode === 'decrypt') || (algorithm.startsWith('Salsa20') && mode === 'decrypt')) ? nonce : undefined // Send nonce for decryption with ChaCha20 and Salsa20
        };

        try {
            const response = await fetch(process.env.REACT_APP_API_URL + apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            let data;
            try {
            data = await response.json();
            } catch (err) {
            throw new Error("Invalid response from server");
            }
            if (!response.ok) {
                throw new Error(data.message || "An error occurred during the API call");
            }
            // Conditionally handle the response based on whether the data is JSON or not
            if ((algorithm === 'Chacha20' && mode === 'encrypt') || (algorithm.startsWith('Salsa20') && mode === 'encrypt')) {
                // Response is JSON with specific fields for ChaCha20
                const resultText = `Nonce: ${data.nonce}\nCiphertext: ${data.ciphertext}\nIMPORTANT!: Copy both the nonce and ciphertext for decryption`;
                setResultText(resultText);
            } else {
                // For other algorithms, expect a simple text result
                setResultText(data.result);
            }
        } catch (error) {
            setResultText(`Error: ${error.message}`);
        }
    };

    return (
        // Encapsulation of the encryption and decryption functionality 
        <section id="tool" className='tool'>
            {/* Page header component that includes a title and a relevant icon */}
            <PageHeader
                headerText='Encrypt and Decrypt Text'
                icon={<MdOutlineEnhancedEncryption size={40} />}
            />
            {/* Container for the interactive content of the tool */}
            <div className='tool__content'>
                {/* Animation to make the section title appear dynamically */}
                <Animate
                    play
                    duration={1}
                    delay={0}
                    start={{
                        transform: "translateX(-200px)" // Starts from 200px left of its initial position
                    }}
                    end={{
                        transform: "translateX(0px)" // Ends at its initial position
                    }}
                >
                    {/* Header indicating the current mode (Encrypt or Decrypt) in uppercase */}
                    <h3 className='tool__content__headerText'>{mode.toUpperCase()}</h3>
                </Animate>
                {/* Animation container for the form elements */}
                <Animate
                    play
                    duration={1}
                    delay={0}
                    start={{
                        transform: "translateX(200px)" // Starts from 200px right of its initial position
                    }}
                    end={{
                        transform: "translateX(0px)" // Ends at its initial position
                    }}
                >
                    {/* Form element that does not perform a traditional page submit when interacted with */}
                    <form onSubmit={handleEncryptDecrypt} className='tool__content__form'>
                        {/* Wrapper for all interactive form controls */}
                        <div className='tool__content__form__controlsWrapper'>
                            {/* Dropdown to select either 'encrypt' or 'decrypt' mode */}
                            <div>
                                <select name="mode" className="modeBox" value={mode} onChange={handleModeChange}>
                                    <option value="encrypt">Encrypt</option>
                                    <option value="decrypt">Decrypt</option>
                                </select>
                                <label htmlFor='mode' className='modeLabel'>Mode</label>
                            </div>
                            {/* Dropdown to select the encryption algorithm */}
                            <div>
                                <select name="algorithm" className="algorithmBox" value={algorithm} onChange={handleAlgorithmChange}>
                                    <option value="AES-256-CBC">AES-256-CBC</option>
                                    <option value="AES-192-CBC">AES-192-CBC</option>
                                    <option value="AES-128-CBC">AES-128-CBC</option>
                                    <option value="Blowfish-16-CBC">Blowfish-16-CBC</option>
                                    <option value="Blowfish-32-CBC">Blowfish-32-CBC</option>
                                    <option value="Blowfish-56-CBC">Blowfish-56-CBC</option>
                                    <option value="ChaCha20">ChaCha20</option>
                                    <option value="Salsa20-128">Salsa20-128</option>
                                    <option value="Salsa20-256">Salsa20-256</option>
                                    <option value="TDES-16">TDES-16</option>
                                    <option value="TDES-24">TDES-24</option>
                                </select>
                                <label htmlFor='algorithm' className='algorithmLabel'>Algorithm</label>
                            </div>
                            {/* Conditional input field for encryption key, displayed only if the selected algorithm requires it */}
                            {keyRequired && (
                                <div>
                                    <input
                                        required
                                        name="key"
                                        type="text"
                                        value={encryptionKey}
                                        onChange={handleKeyChange}
                                        className="keyField"
                                    />
                                    <label htmlFor='key' className='keyLabel'>Encryption Key</label>
                                </div>
                            )}
                            {/* Conditional input field for nonce, displayed only if the selected algorithm and mode requires it */}
                            {((algorithm === 'Chacha20' && mode === 'decrypt') || (algorithm.startsWith('Salsa20') && mode === 'decrypt')) && (
                                <div>
                                    <input required name="nonce" type="text" value={nonce} onChange={handleNonceChange} className="nonceField" />
                                    <label htmlFor='nonce' className='nonceLabel'>Nonce</label>
                                </div>
                            )}
                            {/* Text area for inputting text to be encrypted or decrypted */}
                            <div>
                                <textarea
                                    required
                                    name="encryptDecrypt"
                                    className="encryptDecryptTextArea"
                                    value={text}
                                    onChange={handleTextChange}
                                />
                                <label htmlFor='encryptDecrypt' className='encryptDecryptLabel'>{mode === 'encrypt' ? "Plain Text" : "Encrypted Text"}</label>
                            </div>
                            {/* Button to trigger encryption or decryption */}
                            <div className='buttonWrapper'>
                                <button className="button" onClick={handleEncryptDecrypt}>
                                    {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
                                </button>
                            </div>
                            {/* Text area to display the result of the encryption or decryption */}
                            <div>
                                <textarea
                                    name="result"
                                    className="resultTextArea"
                                    readOnly
                                    value={resultText}
                                />
                                <label htmlFor='result' className='resultLabel'>{mode === 'encrypt' ? "Encrypted Text" : "Plain Text"}</label>
                            </div>
                        </div>
                    </form>
                </Animate>
            </div>
            <Animate
                play
                duration={1}
                delay={0}
                start={{
                    transform: "translateY(200px)" // Starts from 200px bottom of its initial position
                }}
                end={{
                    transform: "translateY(0px)" // Ends at its initial position
                }}
           >
                <EncryptionInfo selectedAlgorithm={algorithm} />
            </Animate>
        </section>
    );
    
}

export default EncryptionDecryption; // Export the component for use in other parts of the application
