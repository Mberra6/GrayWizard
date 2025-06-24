const { spawn } = require('child_process');
const path = require('path');

const executePythonScript = (action, text, key, algorithm, nonce='undefined') => {
  return new Promise((resolve, reject) => {
    // Determine which script to use based on the algorithm specified
    let scriptName = '';
    if (algorithm.startsWith('AES')) {
      scriptName = 'aes/aes.py'; // Path for AES Python script
    } else if (algorithm.startsWith('Blowfish')) {
      scriptName = 'blowfish/blowfish.py'; // Path for Blowfish Python script
    } else if (algorithm.startsWith('Chacha')) {
      scriptName = 'chacha20/chacha20.py'; // Path for Chacha20 Python script
    } else if (algorithm.startsWith('Salsa')) {
      scriptName = 'salsa20/salsa20.py'; // Path for Chacha20 Python script
    } else if (algorithm.startsWith('TDES')) {
      scriptName = 'tdes/tdes.py'; // Path for TDES Python script
    } else {
      reject('Unsupported algorithm');
      return;
    }

    const scriptPath = path.join(__dirname, `../encryption_decryption_scripts/${scriptName}`);

    let pythonProcessArgs = [scriptPath, action, text, key];
    
    // Adjust arguments based on the action and algorithm
    if (algorithm.startsWith('Chacha')) {
      if (action == 'decrypt') {
        pythonProcessArgs.push(nonce); // Add nonce only for decryption
      }
    } else if (algorithm.startsWith('Salsa')) {
        pythonProcessArgs.push(algorithm); // Add algorithm for Salsa20
        if (action == 'decrypt') {
          pythonProcessArgs.push(nonce); // Add nonce only for decryption
        }
    } else {
      pythonProcessArgs.push(algorithm); // Add algorithm for AES/Blowfish/TDES
    }

    const pythonProcess = spawn('python', pythonProcessArgs);

    let data = '';

    pythonProcess.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject('Error occurred');
      } else {
        resolve(data.trim());
      }
    });
  });
};

exports.encryptText = async (req, res) => {
  const { text, key, algorithm } = req.body;

  if (!text || !key || !algorithm) {
    return res.status(400).send("Missing required parameters");
  }

  try {
    const encryptedText = await executePythonScript('encrypt', text, key, algorithm);

    if (algorithm.startsWith('Chacha') || algorithm.startsWith('Salsa')) {
      try {
        const result = JSON.parse(encryptedText); // Attempt to parse the JSON output
        res.json(result); // Send the parsed JSON object as the response
      } catch (parseError) {
        console.error('Failed to parse encryption result:', parseError);
        res.status(500).send("Failed to parse encryption result.");
      }
    } else {
      res.json({ result: encryptedText }); // For other algorithms, send as plain text
    }
  } catch (error) {
    console.error('Encryption failed:', error);
    res.status(500).send("Encryption failed: " + error);
  }
};

exports.decryptText = async (req, res) => {
  const { text, key, algorithm, nonce } = req.body;

  if (!text || !key || !algorithm) {
    return res.status(400).send("Missing required parameters");
  }

  try {
    if (algorithm.startsWith('Chacha') || algorithm.startsWith('Salsa')) {
      const decryptedText = await executePythonScript('decrypt', text, key, algorithm, nonce);
      res.json({ result: decryptedText });
    } else {
      const decryptedText = await executePythonScript('decrypt', text, key, algorithm);
      res.json({ result: decryptedText });
    }
  } catch (error) {
    res.status(500).send("Decryption failed: " + error);
  }
};
