import React, { Component, Suspense } from 'react';
import Stars from 'components/Stars';
import Button from 'components/Button';
import { Helmet } from 'react-helmet-async';
import stakeIcon from 'assets/menu/host2.png';
import gameIcon from 'assets/menu/host3.png';
import icon1 from 'assets/menu/host.png';
import icon2 from 'assets/menu/host10.png';
import icondash from 'assets/menu/hostdash.png';
import Web3 from 'web3';
import AufToken from '../../abis/AufToken.json';
import AufStaking from '../../abis/AufStaking.json';
import './index.css';
import { Link } from 'react-router-dom';
import Input2 from 'components/Input2';


class dApp extends Component {


  componentDidMount = async () => {
 
    await this.loadWeb3();
    await this.loadBlockchainData();
    
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      console.log('1');
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      console.log('2');
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
   

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();

    


    this.setState({ loading: false });
  }



  

  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
     
      loading: true
    };
  }

  render() {
    let content;
    let content2;
    let content3;
    let content5;
    let content4;
    let content6;
    
    let ethaddress = this.state.account;
    let toaddress = ethaddress.substr(0, 6) + '...' + ethaddress.substr(38, 4);

    if(this.state.loading) {
      content = 
      <label className="menu__item-label2">connecting to eth blockchain..</label>
      ;
    } else {
      content = 
      
      

            <Input2
              className="menu__username2"
              placeholder={toaddress}
              pattern=".{1,}"
              style={{ width: '500px' }}
              disabled = {true}
            
            /> ;

            content4 = 
            <div className="menu__item">
             <img
               className="menu__item-image"
               src={stakeIcon}
               alt="About"
             />

             
             <div className="menu__item-content">
               <label className="menu__item-label">Get AMONG tokens</label>
               <div className="menu__item-divider" />
               <Link to="/about">
               <Button
                 secondary
                 className="menu__item-button2"
               >
                 Become a millionaire
               </Button>
               </Link>

             </div>
           </div>;


content6 = 
<div className="menu__item">
 <img
   className="menu__item-image"
   src={icondash}
   alt="Host Game"
 />

 
 <div className="menu__item-content">
   <label className="menu__item-label">My Dashboard</label>
   <div className="menu__item-divider" />
   <Link to="/dashboard">
   <Button
     secondary
     className="menu__item-button2"
   >
     Сockpit entry
   </Button>
   </Link>

 </div>
</div>;

            content2 = 
             <div className="menu__item">
              <img
                className="menu__item-image"
                src={icon1}
                alt="Host Game"
              />

              
              <div className="menu__item-content">
                <label className="menu__item-label">stake and earn</label>
                <div className="menu__item-divider" />
                <Link to="/staking">
                <Button
                  secondary
                  className="menu__item-button2"
                >
                  10% Daily rewards
                </Button>
                </Link>

              </div>
            </div>;

content5 = 
<div className="menu__item">
 <img
   className="menu__item-image"
   src={gameIcon}
   alt="About"
 />

 
 <div className="menu__item-content">
   <label className="menu__item-label">NFT Farming</label>
   <div className="menu__item-divider" />
   <Link to="/farming">
   <Button
     secondary
     className="menu__item-button2"
   >
     Get Aticket to play
   </Button>
   </Link>

 </div>
</div>;

            content3 =

            <div className="menu__item">
              <img
                className="menu__item-image"
                src={icon2}
                alt="Host Game"
              />
              <div className="menu__item-content">
                <label className="menu__item-label">Play and earn</label>
                <div className="menu__item-divider" />
                <Link to="/play">
                  <Button
                  secondary
                  className="menu__item-button2">
                  Game
                  </Button>
                </Link>
                  
              </div>
            </div>
      
      ; 
    }

    return (
      <section className="menu">
      <Helmet>
        <title>AmongUS Finance</title>
        <meta
          name="description"
          content="Blockchain ready recreation of the popular -Among Us- indie game. Powered by Decentralized Finance, non-custodial staking and Farming protocols"
        />
      </Helmet>
    
        
        <Suspense fallback={null}>
        <Stars />
      </Suspense>
        
      
      

    {/* <p className="menu__version">Balance: {this.state.aufTokenBalance / 1000000000000000000} AMONG </p> */}
   
        
          <div className="menu__content">
            
          {content}
          {content4}
          {content6}
          {content2}
          {content5}
          {content3}
         
       
          </div>
          <Link to="/">
          <Button
            className="menu__nav-button"
            // onClick={backMenu}
          >
            exit
          </Button>
          </Link>
        
    
    
    </section>
    );
  }
}

export default dApp;
