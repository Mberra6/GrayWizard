import React from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import PageHeader from '../../components/pageHeader';
import { Animate } from 'react-simple-animate';
import './styles.scss';
import aboutMe from './utils.js';
import { MdOutlineSecurity } from "react-icons/md";
import { SiKalilinux, SiCyberdefenders } from 'react-icons/si';
import { RiLockPasswordFill } from "react-icons/ri";

const About = () => {
  return (
    <section id="about" className='about'>
      <PageHeader
        headerText='About'
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className='about__content'>
        <div className='about__content__personalWrapper'>
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
            <h3 className='about__content__personalWrapper__headerText'>GrayWizard</h3>
            <p>{aboutMe.introduction}<br/><br/>
            <b className='boldSubTitles'>Purpose of the Project</b><br/><br/>
            {aboutMe.purpose}<br/><br/>
            <b className='boldSubTitles'>What We Offer</b><br/><br/>
            {aboutMe.offer}<br/><br/>
            <ul className='offerList'>
                <li><b>{aboutMe.offerList1Title}</b>&nbsp;{aboutMe.offerList1}<br/><br/></li>
                <li><b>{aboutMe.offerList2Title}</b>&nbsp;{aboutMe.offerList2}<br/><br/></li>
                <li><b>{aboutMe.offerList3Title}</b>&nbsp;{aboutMe.offerList3}</li>
            </ul>
            <br/><br/>
            <b className='boldSubTitles'>Educational Impact</b><br/>
            <br/>{aboutMe.educational}<br/><br/>
            <b className='boldSubTitles'>Commitment to Privacy and Security</b><br/>
            <br/>{aboutMe.commitment}<br/><br/>{aboutMe.last}</p>
          </Animate>
        </div>
        <div className='about__content__servicesWrapper'>
        <Animate
            play
            duration={1}
            delay={0}
            start={{
              transform: 'translateX(400px)'
            }}
            end={{
              transform: 'translateX(0px)'
            }}
          >
            <div className='about__content__servicesWrapper__innerContent'>
              <div>
                <SiCyberdefenders size={60} color="var(--green-theme-main-color)" />
              </div>
              <div>
                <SiKalilinux size={90} color="var(--green-theme-main-color)" />
              </div>
              <div>
                <RiLockPasswordFill size={60} color="var(--green-theme-main-color)" />
              </div>
              <div>
                <MdOutlineSecurity size={60} color="var(--green-theme-main-color)" />
              </div>
            </div>
          </Animate>
        </div>
      </div>
    </section>
  )
}

export default About;