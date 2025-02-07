pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;


import "./AufToken.sol";
import "./AufNFT.sol";

contract AufGame is Ownable{
    string public name = "AUF game core v.0.3.0";
    AufToken public aufToken;
    AufNFT public aufNFT;
    uint private constant max_players = 10;

    //First 5 roles for current stage. Last 3 for player
    enum Roles { 
        BETS,
        ACTIVE,
        INACTIVE,
        VOTING,

        IMPOSTOR, 
        CREWMATE,
        UNKNOWN
    } 

    enum States {
        ALIVE,
        GHOST
    }

    enum Color {
        RED,
        BLUE,
        GREEN,
        PINK,
        ORANGE,
        YELLOW,
        BLACK,
        WHITE,
        PURPLE,
        BROWN,
        CYAN,
        LIME,
        MAROON,
        ROSE,
        BANANA,
        GRAY,
        TAN,
        CORAL,
        UNKNOWN
    }

    struct Player {
        States state;
        Roles role;
        address adr;
        string username;
        Color color;
        bool voted_;
    }
    
    Player[max_players] private players;
    Roles private current_stage = Roles.INACTIVE;

    address[max_players] private Users;
    mapping(address => uint) public player_index;
    mapping(address => bool) public authorized;
    mapping(string => Color) public lookup_colors;

    event Log(string _text);
    event Winside(Roles a, string b);
    event CurrentStage(Roles a);

    uint private impostor_count = 3; 
    uint private crewmate_count = 7; 
    uint private hit = 11; 
    uint private voted = 0;
    uint private index = 0;
    uint private bank = 0;
    uint private bets_count = 0;
    uint private min_stake = 1000000000000000000000; //AMONG tokens
    uint public impostor_bets = 0;
    uint public crewmate_bets = 0;
    uint[max_players] private voted_for;
    address burnaddr = 0x000000000000000000000000000000000000000d;

    constructor(AufToken _aufToken, AufNFT _aufNFT) public {
        aufToken = _aufToken;
        aufNFT = _aufNFT;
    }

    modifier onlyAuthorized() {
    require(authorized[msg.sender] || owner() == msg.sender);
    _;
    }

    modifier ActiveGame() {
        require(current_stage == Roles.ACTIVE);
        _;
    }

    modifier ActiveBets() {
        require(current_stage == Roles.BETS);
        _;
    }

    modifier ActiveVote() {
        require(current_stage == Roles.VOTING);
        _;
    }

    modifier avaliable() {
        require (
            index < max_players,
            "There are enough players in this game already"
        );
        _;
    }

    modifier playerCheck() {
        bool plflag = false;
        for (uint i = 0; i < max_players; i++) {
            if (players[i].adr == msg.sender) {
                if (players[i].state == States.ALIVE) {
                    plflag = true; 
                }
                break;
            }    
        }
        require (plflag);
        _;
    }

    modifier CanKill() {
        bool flag = false;
        for (uint i = 0; i < max_players; i++) {
            if (players[i].adr == msg.sender) {

                if (players[i].role == Roles.IMPOSTOR && players[i].state == States.ALIVE && current_stage == Roles.ACTIVE) {
                    flag = true; 
                }
                break;
            }    
        }
        require (flag);
        _;
    }

    modifier CheckName(string memory crewname_) {
        bool flag = false;
        for (uint i = 0; i < max_players; i++) {
            if (keccak256(abi.encodePacked(players[i].username)) == keccak256(abi.encodePacked(crewname_))) {
                    flag = true; 
            }    
        }
        require (flag);
        _;
    }

    modifier voterCheck() {
        bool vtflag = false;
        for (uint i = 0; i < max_players; i++) {
            if (players[i].adr == msg.sender) {
                if (players[i].state == States.ALIVE && players[i].voted_ == false) {
                    vtflag = true; 
                }
                break;
            }    
        }
        require (vtflag, "1. You must be alive. 2. Only one vote accepted from player during voting round");
        _;
    }

    modifier impostor_settled(uint ind) {
        require(ind < max_players && ind >= 3 && players[ind].state == States.ALIVE);
        _;
    }

    function gameStatus() public view returns (string memory) {
        if (current_stage == Roles.BETS) {
            return ("bets");
        }
        if (current_stage == Roles.ACTIVE) {
            return ("active");
        }
        if (current_stage == Roles.INACTIVE) {
            return ("inactive");
        }
        if (current_stage == Roles.VOTING) {
            return ("voting");
        }
        if (current_stage == Roles.UNKNOWN) {
            return ("unknown");
        }    
    } 

    function addAuthorized(address _toAdd) onlyOwner public {
        require(_toAdd != address(0));
        authorized[_toAdd] = true;
    }

    function removeAuthorized(address _toRemove) onlyOwner public {
        require(_toRemove != address(0));
        require(_toRemove != msg.sender);
        authorized[_toRemove] = false;
    }

    function checkAliveCount() public view returns(uint) {//to compare with alivePlayers
        uint count = 0;
        for (uint i = 0; i < max_players; i += 1){
            if(players[i].state == States.ALIVE) count += 1;
        }
        return(count);
    }

    function alivePlayers() public view returns (uint) {
        return (impostor_count + crewmate_count);
    } 

    function votedPlayers() public view returns (uint) {
        return (voted);
    }

    function indexActual() public view returns (uint) {
        return (index);
    }

    function latestKilled() public view returns (uint) {
        return (hit);
    }

    function latestBank() public view returns (uint) {
        return (bank);
    }

    function checkPlayerAlive(uint ind) public view correct_range(ind) returns(bool) {
        return(players[ind].state == States.ALIVE);
    }

    function checkPlayerVoted(uint ind) public view correct_range(ind) returns(bool) {
        return(players[ind].voted_);
    }

    function myPlayerName(uint ind) public view correct_range(ind) returns(string memory) {
        require (players[ind].adr == msg.sender);
        return(players[ind].username);
    }

    function myPlayerRole(uint ind) public view correct_range(ind) returns(string memory) {
        require (players[ind].adr == msg.sender);

        if (players[ind].role == Roles.IMPOSTOR) {
            return ("impostor");
        }
        if (players[ind].role== Roles.CREWMATE) {
            return ("crewmate");
        }  
        return("unknown");
    }

    function initColorsLookup() onlyAuthorized public {
        lookup_colors["red"] = Color.RED;
        lookup_colors["blue"] = Color.BLUE;
        lookup_colors["green"] = Color.GREEN;
        lookup_colors["pink"] = Color.PINK;
        lookup_colors["orange"] = Color.ORANGE;
        lookup_colors["yellow"] = Color.YELLOW;
        lookup_colors["black"] = Color.BLACK;
        lookup_colors["white"] = Color.WHITE;
        lookup_colors["purple"] = Color.PURPLE;
        lookup_colors["brown"] = Color.BROWN;
        lookup_colors["lime"] = Color.LIME;
        lookup_colors["maroon"] = Color.MAROON;
        lookup_colors["rose"] = Color.ROSE;
        lookup_colors["banana"] = Color.BANANA;
        lookup_colors["gray"] = Color.GRAY;
        lookup_colors["tan"] = Color.TAN;
        lookup_colors["coral"] = Color.CORAL;
    }

    function myColor(uint ind) public view correct_range(ind) returns(string memory) {
        require (players[ind].adr == msg.sender);

        if (players[ind].color == Color.RED) {
            return ("red");
        }
        if (players[ind].color == Color.BLUE) {
            return ("blue");
        }  
        if (players[ind].color == Color.GREEN) {
            return ("green");
        }  
        if (players[ind].color == Color.PINK) {
            return ("pink");
        }  
        if (players[ind].color == Color.ORANGE) {
            return ("orange");
        }  
        if (players[ind].color == Color.YELLOW) {
            return ("yellow");
        }  
        if (players[ind].color == Color.BLACK) {
            return ("black");
        }  
        if (players[ind].color == Color.WHITE) {
            return ("white");
        }  
        if (players[ind].color == Color.PURPLE) {
            return ("purple");
        }  
        if (players[ind].color == Color.BROWN) {
            return ("brown");
        }  
        if (players[ind].color == Color.LIME) {
            return ("lime");
        }  
        if (players[ind].color == Color.MAROON) {
            return ("maroon");
        }  
        if (players[ind].color == Color.ROSE) {
            return ("rose");
        }  
        if (players[ind].color == Color.BANANA) {
            return ("banana");
        }  
        if (players[ind].color == Color.GRAY) {
            return ("gray");
        }  
        if (players[ind].color == Color.TAN) {
            return ("tan");
        }  
        if (players[ind].color == Color.CORAL) {
            return ("coral");
        } 
        return("unknown");
    }

    function connectGame(string memory player_name, string memory color_, uint256 nftid) avaliable public {
        require(aufNFT.ownerOf(nftid) == msg.sender, "You are not owner of this ATICKET ID");
        bool flag = true;
         for (uint i = 0; i < max_players; i++) {
            if (Users[i] == msg.sender) {
              flag = false;  
            }    
        }
        require(flag, "You've already connected");
        aufNFT.transferFrom(msg.sender, burnaddr, nftid);
        Users[index] = msg.sender;
        player_index[msg.sender] = index;
        players[index].username = player_name;
        players[index].color = lookup_colors[color_];
        index++;
        emit Log("Connected!");
        if (index == max_players) {
            _gameStart();
        }      
    }

    function gameStartManually() onlyAuthorized public {
        _gameStart();
    } 

    function _gameStart() private {
        for (uint i = 0; i < max_players; i += 1) {
            players[i].state = States.ALIVE;
            players[i].adr = Users[i];
            players[i].voted_ = false;
        }
        players[0].role = Roles.IMPOSTOR;
        players[1].role = Roles.IMPOSTOR;
        players[2].role = Roles.IMPOSTOR;
        players[3].role = Roles.CREWMATE;
        players[4].role = Roles.CREWMATE;
        players[5].role = Roles.CREWMATE;
        players[6].role = Roles.CREWMATE;
        players[7].role = Roles.CREWMATE;
        players[8].role = Roles.CREWMATE;
        players[9].role = Roles.CREWMATE;
        current_stage = Roles.BETS;
        bank = 0;
        impostor_bets = 0;
        crewmate_bets = 0;
    }

    function Bet(uint256 stake) ActiveBets playerCheck public {
        require(stake >= min_stake, "Less than min stake"); 
        require(aufToken.balanceOf(msg.sender) >= stake, "Not enough");
        bank += stake;
        bets_count ++;
        uint ind = player_index[msg.sender];
        if (players[ind].role == Roles.IMPOSTOR) {
            impostor_bets += stake;
        } else {
            crewmate_bets += stake;
        }
        aufToken.transferFrom(msg.sender, address(this), stake);
        emit Log("Congrats, your bet placed!");
        if (bets_count == 10){
           current_stage = Roles.ACTIVE;
           emit CurrentStage(Roles.ACTIVE); 
        }

    }

    function startActiveManually() onlyAuthorized public {
        current_stage = Roles.ACTIVE;
        emit CurrentStage(Roles.ACTIVE);
    }

    function KillCrewmate(string memory crewname) CanKill ActiveGame CheckName(crewname) public {
        for (uint i = 0; i < max_players; i++) {            
            if (keccak256(abi.encodePacked(players[i].username)) == keccak256(abi.encodePacked(crewname))) {
             hit = i;
             players[hit].state = States.GHOST;
             crewmate_count--;
             emit Log("Crewmate killed!");
                if (crewmate_count == 0) { 
                     _ImpostorWin();
                } //else {
                   // current_stage = Roles.VOTING;
                   // emit CurrentStage(Roles.VOTING);
                //}
            }
        }

    }

    function startVoting() ActiveGame playerCheck public {
        current_stage = Roles.VOTING;
        emit CurrentStage(Roles.VOTING);
    }

    function Vote(uint ind) voterCheck ActiveVote public {
        require (players[ind].state == States.ALIVE, "Please vote for ALIVE player!");
        uint voterindex = player_index[msg.sender];         
        voted_for[ind] += 1;
        players[voterindex].voted_ = true;
        voted ++;
        emit Log("Voted!");
            if (voted == alivePlayers()) {
            uint max = 0;
            uint i_max = 0;
            for (uint i = 0; i < max_players; i++) {
                if (voted_for[i] > max) {
                    max = voted_for[i];
                    i_max = i;
                }
            }

            if (players[i_max].role == Roles.IMPOSTOR) impostor_count--;
                else crewmate_count--;
            players[i_max].state = States.GHOST;

            voted = 0;

            for (uint i = 0; i < max_players; i++) {
                voted_for[i] = 0;
            }
            for (uint i = 0; i < max_players; i++) {
                players[i].voted_ = false;
            }
            current_stage = Roles.ACTIVE;
            emit CurrentStage(Roles.ACTIVE);
            emit Log("Voting ends");
        
            if (crewmate_count == 0) {
                _ImpostorWin();
            }
            else if (impostor_count == 0) {
                _CrewmateWin();
            } 
        } 
    }

    function StopVoting() ActiveVote onlyAuthorized public {
        if (voted >= crewmate_count) { //To avoid impostors manipulation
            uint max = 0;
            uint i_max = 0;
            for (uint i = 0; i < max_players; i++) {
                if (voted_for[i] > max) {
                    max = voted_for[i];
                    i_max = i;
                }
            }

            if (players[i_max].role == Roles.IMPOSTOR) impostor_count--;
                else crewmate_count--;
            players[i_max].state = States.GHOST;

            voted = 0;

            for (uint i = 0; i < max_players; i++) {
                voted_for[i] = 0;
            }
            for (uint i = 0; i < max_players; i++) {
                players[i].voted_ = false;
            }
            current_stage = Roles.ACTIVE;
            emit CurrentStage(Roles.ACTIVE);
            emit Log("Voting ends");
        
            if (crewmate_count == 0) {
                _ImpostorWin();
            }
            else if (impostor_count == 0) {
                _CrewmateWin();
            } 
        } else {

            voted = 0;

            for (uint i = 0; i < max_players; i++) {
                voted_for[i] = 0;
            }
            for (uint i = 0; i < max_players; i++) {
                players[i].voted_ = false;
            }
            current_stage = Roles.ACTIVE;
            emit CurrentStage(Roles.ACTIVE);
            emit Log("Voting did not happen");

        }
    }

    
    function _ImpostorWin() private {
       emit Winside(Roles.IMPOSTOR, ":WIN");
       uint256 count = bank / 3;
       for (uint i = 0; i < 3; i++) {
           aufToken.transfer(Users[i], count);
       }
       _Reset();
       return;
    }

    function _CrewmateWin() private {
        emit Winside(Roles.CREWMATE, ":WIN");
        uint256 count = bank / 7;
        for (uint i = 3; i < max_players; i++) {
           aufToken.transfer(Users[i], count);
        }
        _Reset();
        return;
    }

    function Reset() onlyAuthorized public {
        _Reset();
    }

    function _Reset() private {
        current_stage = Roles.INACTIVE;
        index = 0;
        voted = 0;
        for (uint i = 0; i < max_players; i++) {
             players[i].voted_ = false; 
        }
        for (uint i = 0; i < max_players; i++) {
             players[i].username = ""; 
        }
        for (uint i = 0; i < max_players; i++) {
            voted_for[i] = 0;
        }
        for (uint i = 0; i < max_players; i++) {
            players[i].role = Roles.UNKNOWN;
        }
        hit = 11;
        impostor_count = 3;
        crewmate_count = 7;
    }

    modifier correct_range(uint ind) {
        require(ind < max_players && ind >= 0);
        _;
    }
}