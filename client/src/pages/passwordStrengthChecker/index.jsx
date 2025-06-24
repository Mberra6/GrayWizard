import React, { useState } from 'react';
import { FaKey, FaEyeSlash, FaEye } from "react-icons/fa6";
import PageHeader from '../../components/pageHeader';
import './styles.scss';

const PasswordStrengthChecker = () => {
    const [password, setPassword] = useState('');
    const [passwordStrengthResult, setPasswordStrengthResult] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

    const checkPasswordStrength = async () => {
        try {
            const payload = {
              password
            };
            const response = await fetch(`${process.env.REACT_APP_API_URL}/passwordStrength`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                setPasswordStrengthResult(data.result);
            } else {
                throw new Error(data.message || 'Error checking password strength');
            }
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    };

    return (

      <section id="passwordStrengthChecker" className='passwordStrengthChecker'>
          <PageHeader
              headerText='Assess the Strength of your Password'
              icon={<FaKey size={40} />}
          />
          <div className="passwordStrengthCheckerContainer">
            <div className='inputWrapper'>
              <input
                  type={ showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="passwordInput"
              />
              <button onClick={togglePasswordVisibility} className="visibilityButton">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button onClick={checkPasswordStrength} className="checkButton">Check Password</button>
            </div>

            {passwordStrengthResult && (
              <>
                <div
                    className={`resultMessage ${passwordStrengthResult.grade === 'pass' ? 'pass' : 'fail'}`}
                >
                    {passwordStrengthResult.grade === 'pass' ? (
                        <>
                            <p className='largeText'><br/>Well Done!<br/><br/>Your password is complex enough and does not appear on any data breach.<br/><br/></p>
                            <p className='largeText'><b>Estimated Time to Crack by a Computer: {passwordStrengthResult.cracking_time} *</b><br/><br/></p>
                        </>
                    ) : (
                        <>
                            {passwordStrengthResult.compromised ? (
                              <>
                              <br/>
                              <p className="largeText">
                                  Warning: The password has been compromised. <br/>
                              </p>
                              <p className='largeSubText'>
                                  This password has previously appeared in a data breach and should never be used. 
                                  If you've ever used it anywhere before, change it!<br/><br/>
                              </p></> ) : (
                              <p className='largeText'>
                                  The password is Weak. <br/><br/>
                              </p>

                            )}
                            <p className='largeText'>Estimated Time to Crack by a Computer: {passwordStrengthResult.cracking_time} *<br/><br/><br/></p>
                            <p className='listLargeText'><b>Here Are Some Tips to Improve Your Password Strength:</b> <br/><br/></p>
                            <ul className='listText'>
                              {passwordStrengthResult.tips.length > 0 ? (
                                passwordStrengthResult.tips.map((tip, index) => (
                                  <li key={index}>{tip}<br/><br/></li>
                              ))) : (
                                <li>Consider increasing the password complexity by making it longer, not using common words, and using more special characters.</li>
                              )}
                            </ul>
                        </>
                    )}
                </div>
                <p className='noteText'>
                  <b>* </b>
                  The Estimate only takes into account Brute Force Attacks, with 2 billion guesses entered by the computer per second.<br/><br/>
                  <b>* </b>The time displayed is the maximum time a computer would take to crack the password. In general, a computer 
                  will take 50% less time to crack the password.
                </p>
              </>
              )}
          </div>
        </section>
    );
}

export default PasswordStrengthChecker;

