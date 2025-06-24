import React from 'react';
import encryptionAlgorithms from './encryptionContent';
import './styles.scss';

const EncryptionInfo = ({ selectedAlgorithm }) => {
    // Filter the content based on the selected algorithm
    const filteredContent = encryptionAlgorithms.filter(algo => selectedAlgorithm.startsWith(algo.key));

    // Function to process and display content with line breaks for '\n'
    const renderContentWithNewlines = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    }

    return (
        <div className='contentWrapper'>
            <div>
                <h2>{filteredContent[0].title}</h2>
                <p>{renderContentWithNewlines(filteredContent[0].body)}</p>
                <ul>
                    {filteredContent[0].list.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <br/>
                <br/>
                <p>{filteredContent[0].conclusion}</p>
                <br/>
                <p>{filteredContent[0].reference}</p>
            </div>
        </div>
    );
}

export default EncryptionInfo;
