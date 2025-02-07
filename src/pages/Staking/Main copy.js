import React, { Component } from 'react';
import auficon from './auficon.png';
import './index.css';

import Button from 'components/Button';


class Main extends Component {
  
  render() {
    
    return (
      <div id="content">

<label className="menu__item-label_">Account balance: {window.web3.utils.fromWei(this.props.aufTokenBalance, 'Ether')} AMONG
</label>

<label className="menu__item-label_">Staking balance: {window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} AMONG
</label>

<div className="menu__item-content">
                
               
            
<div className="menu__item-content">
                <label className="menu__item-label__">1. Approve $AMONG</label>
                <div className="menu__item-divider" />
               
             

              <Button
                  secondary
                  type="submit"
                  className="menu__item-button__"
                  onClick={(event) => {
                    event.preventDefault();
                    this.props.approveTokens();
                  }}
                >
                  approve
                </Button>
</div>     
                
              
        
</div>

<div className="menu__item-content">
                <label className="menu__item-label__">2. Stake tokens</label>
                <div className="menu__item-divider" />
                <form className="menu__item-input" onSubmit={(event) => {
                event.preventDefault();
                let amount;
                amount = this.input.value;
                amount = window.web3.utils.toBN(amount);
                amount = window.web3.utils.toWei(amount, 'Ether');
                this.props.stakeTokens(amount);
              }}>
                  <input type="text"
                  ref={(input) => { this.input = input; }}
                  className="input_"
                  style={{ width: '245px' }}
                  placeholder="0"
                  required />
              
              <Button
           
                  secondary
                  type="submit"
                  className="menu__item-button_"
            
                >
                  stake
                </Button>
                 
                
                </form>
        
</div>






<div className="menu__item-content">
                <label className="menu__item-label__">3. Unstake all tokens</label>
                <div className="menu__item-divider" />
               
             

              <Button
                  secondary
                  type="submit"
                  className="menu__item-button__"
                  onClick={(event) => {
                    event.preventDefault();
                    this.props.unstakeTokens();
                  }}
                >
                  unstake
                </Button>
</div>
        

     

      </div>
    );
  }
}

export default Main;
