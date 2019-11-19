pragma solidity >=0.4.24;

import "./SafeMath.sol";

/*
This set of code is to depict the transaction of goods from the exporter, shipper & importer
*/
contract CorporateLending {
    using SafeMath for uint256;

    address bank;
    address client;
    string public loanStatus;
    string[] loanStatusArray;
    string[] errMsg;
    uint256 loanValue;
    uint256 interestRate;
    uint256 stockPrice; 

    Client clientObj;

    struct BillOfExchange {
        address holder;
        uint256 optionPrice;
    }

    struct Client{
        address addr;
        uint256 risk;
        string riskClass;
        uint256 collateralVal;
        KYC kyc;
    }

    struct KYC{
        uint256 capital;
        string creditRating;
        uint256 earnings;
    }


    constructor( address bankAddr, address clientAddr, uint256 loanVal,
        uint256 earningsVal, string memory creditR, uint256 capitalVal ) public {

        loanStatusArray = ["INITIATED", "EVALUATED", "PRICED", "SIGNED", "ACTIVE", "REPAID", "FORECLOSURE", "REJECTED"];
        errMsg = [
                    "Unauthorised Transaction",                                 //errMsg[0]
                    "Value has to be set below the Shipment Value.",            //errMsg[1]
                    "Value has to be set at least 80% of the Shipment Value.",  //errMsg[2]
                    "Sent value does not equal BOE Value",                 //errMsg[3]
                    "Transaction Failed"                                        //errMsg[4]
                    // NEW ERRORS, start with [5]
                ];

        bank = bankAddr;
        client = clientAddr;
        loanValue = SafeMath.mul(loanVal, 1 ether); // Stores ether value as wei
        loanStatus = loanStatusArray[0];

        // Assume interest rate and stock price are derived from Oracle data source
        interestRate = 10;
        stockPrice = 1000;


        // Assume KYC is already done, so when the contract is initiated, the information will be automatically loaded
        clientObj = Client({
            addr: client,
            risk: 0,
            riskClass: "",
            collateralVal: 0,
            kyc: KYC({
                capital: capitalVal,
                creditRating: creditR,
                earnings: earningsVal
            })
        });

    }


/*
    Based on the information from KYC, stored in info object in Client, evaluate and set risk value
*/
    function evaluateRiskAndCollateral() public {
        // Check if the risk is evaluated and the identity of the executor
        require(equal(loanStatus,loanStatusArray[0]) && msg.sender == bank, errMsg[0]);

        // Calculate risk based on the information from KYC
        if(clientObj.kyc.capital < 500){
            clientObj.risk = SafeMath.add(clientObj.risk,2);
        } else if(clientObj.kyc.capital < 1000){
            clientObj.risk = SafeMath.add(clientObj.risk,1);
        }

        if(equal(clientObj.kyc.creditRating, "B")){
            clientObj.risk = SafeMath.add(clientObj.risk,1);
        } else if(equal(clientObj.kyc.creditRating, "C")){
            clientObj.risk = SafeMath.add(clientObj.risk,2);
        } else if(equal(clientObj.kyc.creditRating, "D")){
            clientObj.risk = SafeMath.add(clientObj.risk,3);
        }

        if(clientObj.kyc.earnings < 5){
            clientObj.risk = SafeMath.add(clientObj.risk,2);
        } else if(clientObj.kyc.earnings < 10){
            clientObj.risk = SafeMath.add(clientObj.risk,1);
        }

        // Classify risk class
        if(clientObj.risk < 2){
            clientObj.riskClass = "low";
        } else if(clientObj.risk < 5){
            clientObj.riskClass = "medium";
        } else{
            clientObj.riskClass = "high";
        }

        // Calculate collateral
        clientObj.collateralVal = SafeMath.mul(SafeMath.mul(SafeMath.add(SafeMath.mul(interestRate, 100), 1), clientObj.risk), stockPrice);

        // Set state to SIGNED, because step "PRICING" and "SIGN" are skipped
        loanStatus = loanStatusArray[3];
    }
    function drawdown() public payable{
        require(equal(loanStatus,loanStatusArray[3]) && msg.sender == bank, errMsg[0]);
        // Loan drawdown - Transaction from bank to client


        // Transaction of collateral from client to bank


        // set state to ACTIVE
        loanStatus = loanStatusArray[4];
    }


    function repay() public payable{
        require(equal(loanStatus,loanStatusArray[4]) && msg.sender == client, errMsg[0]);
        // Repayment from client to bank


        // set state to REPAID
        loanStatus = loanStatusArray[5];
    }

    function getLoanStatus() public returns (string memory){
        return loanStatus;
    }

    function getRisk() public returns (string memory){
        return clientObj.riskClass;
    }

    function getCollateral() public returns (uint256){
        return clientObj.collateralVal;
    }


    function equal(string memory _a, string memory _b) private pure returns (bool) {
        return (keccak256(abi.encode(_a)) == keccak256(abi.encode(_b)));
        //return keccak256(_a) == keccak256(_b);
    }

}