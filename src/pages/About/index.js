import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Stars from 'components/Stars';
import Button from 'components/Button';
import prerender from 'utils/prerender';
import { Link } from 'react-router-dom';
import './index.css';

const About_ = () => (
  <section className="about">
    <Helmet>
      <title tag="title">AmongUs Finance</title>
      <meta name="description" content="404 page not found. This page doesn't exist" />
    </Helmet>
    {!prerender &&
      <Suspense fallback={null}>
        <Stars />
      </Suspense>
    }

    <div className="menu__content">
    
      <h1 className="about__error">[AMONG] ERC20 governance token:</h1>
      <br/>
     
      <p className="about__text">Max supply: 21,000,000 AMONG</p>
      <p className="about__text">PreSale: 6,000,000 AMONG</p>
      <p className="about__text">Liquidity: 6,000,000 AMONG</p>
      <p className="about__text">Staking pool: 6,000,000 AMONG</p>
      <p className="about__text">Marketing, team, advisors: 3,000,000 AMONG</p>
   
    <Button href="https://twitter.com/AmongUsFinance" className="about__button">🔥 Presale SOON. Follow news 🔥</Button>
  
    <Button href="https://etherscan.io/token/0xF841D292c1141cbF1460A1E2010916565a010cc8" className="about__button">AMONG contract</Button>
    
   
    </div>

    <Link to="/menu">
          <Button
            className="menu__nav-button"
            // onClick={backMenu}
          >
            back
          </Button>
          </Link>
  </section>
);

export default About_;