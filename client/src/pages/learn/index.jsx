import React from 'react';
import { GiGraduateCap } from 'react-icons/gi';
import PageHeader from '../../components/pageHeader';
import { Animate } from 'react-simple-animate';
import educationalContent from './educationalContent';
import './styles.scss';

const Learn = () => {

    // Function to process and display content with line breaks for '\n'
    const renderContentWithNewlines = (text) => (
        text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}<br />
            </React.Fragment>
        ))
    );

    return (
        <section id='learn' className='learn'>
            <PageHeader
                headerText='An Introduction to Cybersecurity'
                icon={<GiGraduateCap size={40} />}
            />
            <Animate
            play
            duration={1}
            delay={0}
            start={{
              transform: 'translateX(-400px)'
            }}
            end={{
              transform: 'translateX(0px)'
            }}
            >
                <div className='learn__contentWrapper'>
                    {educationalContent.map((content, index) => (
                        <div key={index}>
                            <h2>{content.title}</h2>
                            <p>{renderContentWithNewlines(content.body)}</p>
                            <ul>
                                {content.list.map((item, index) => (
                                    <li key={index}>{item}<br/><br/></li>
                                ))}
                            </ul>
                            <p>{renderContentWithNewlines(content.conclusion)}</p>
                            <p>{renderContentWithNewlines(content.reference)}</p>
                            <br/>
                        </div>
                    ))}
                </div>
            </Animate>
        </section>
    );
}

export default Learn;
