pragma solidity ^0.5.0;


contract MetaCoin {
	mapping (address => uint) public balances;

	constructor() public {
		balances[tx.origin] = 1;
	}
}