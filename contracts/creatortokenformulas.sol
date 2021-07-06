// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenownership.sol";

contract CreatorTokenFormulas is CreatorTokenOwnership {

	constructor(string memory uri) CreatorTokenOwnership(uri) { }

	// Calculate area under buy price function
	function _buyFunction(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator) internal pure returns (uint256) {
		// b(x) = m*x
		uint endSupply = _startingSupply + _amount;
		uint base1 = _mNumerator*_startingSupply/_mDenominator;
		uint base2 = _mNumerator*endSupply/_mDenominator;
		uint height = endSupply-_startingSupply;
		uint area = (base1 + base2) * height / 2;
		return area;
	}

	// Calculate area under sale price function
	function _saleFunction(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator, uint _maxSupply, uint _profitMargin) internal pure returns (uint256) {
		// Calculate breakpoint and endSupply
		(uint a, uint b, uint endSupply) = _breakpoint(_startingSupply, _amount, _mNumerator, _mDenominator, _maxSupply, _profitMargin);
		// Initialize area under curve
		uint area = 0;
		// Check where _startingSupply is relative to the breakpoint
		if (_startingSupply < a) {
			// Just need trapezoidal area of partial entirely left of the breakpoint
			area = _leftArea(a, b, _startingSupply, endSupply);
		} else if (endSupply < a) {
			// Scenario in which _startingSupply >= a, and endSupply < a
			// There, need trapezoidal area of components both to right and left of breakpoint
			area = _bothArea(a, b, _startingSupply, endSupply, _mNumerator, _mDenominator, _maxSupply);
		} else {
			// Scenario in which entire sale occurs to right of breakpoint
			// Just need trapezoidal area of partial entirely right of the breakpoint
			area = _rightArea(a, b, _startingSupply, endSupply, _mNumerator, _mDenominator, _maxSupply);
		}
		return area;
	}

	// Calculate breakpoint and other key inputs into _saleFunction
	function _breakpoint(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator, uint _maxSupply, uint _profitMargin) internal pure returns (uint, uint, uint) {
		// Define breakpoint (a,b) chosen s.t. area under sale price function is (1-profitMargin) times area under buy price function
		uint a = _maxSupply/2;
		uint b = _maxSupply*(50-_profitMargin)/100*_mNumerator/_mDenominator;
		uint endSupply = _startingSupply - _amount;
		return (a, b, endSupply);
	}

	// _saleFunction scenario in which entire transaction occurs left of breakpoint
	function _leftArea(uint _a, uint _b, uint _startingSupply, uint _endSupply) internal pure returns (uint256) {
			//uint base1 = ((_b/_a)*(_a-_endSupply)+_b);
			//uint base1 = ((_b/_a)*(_endSupply-_a)+_b);
			uint base1 = (_b-(_b/_a)*(_a-_endSupply));
			//uint base2 = ((_b/_a)*(_a-_startingSupply)+_b);
			//uint base2 = ((_b/_a)*(_startingSupply-_a)+_b);
			uint base2 = (_b-(_b/_a)*(_a-_startingSupply));
			uint height = _startingSupply-_endSupply;
			return (base1 + base2) * height / 2;
	}

	// _saleFunction scenario in which transaction crosses breakpoint
	function _bothArea(uint _a, uint _b, uint _startingSupply, uint _endSupply, uint _mNumerator, uint _mDenominator, uint _maxSupply) internal pure returns (uint256) {
		//uint leftBase1 = ((_b/_a)*(_a-_endSupply)+_b);
		//uint leftBase1 = ((_b/_a)*(_endSupply-_a)+_b);
		uint leftBase1 = (_b-(_b/_a)*(_a-_endSupply));
		uint sharedBase = _b;
		uint leftHeight = _a-_endSupply;
		uint leftArea = (leftBase1 + sharedBase) * leftHeight / 2;
		uint rightBase2 = (_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a)*(_startingSupply-_a)+_b;
		uint rightHeight = _startingSupply-_a;
		uint rightArea = (sharedBase + rightBase2) * rightHeight / 2;
		return leftArea + rightArea;
	}

	// _saleFunction scneario in which entire transaction occurs right of breakpoint
	function _rightArea(uint _a, uint _b, uint _startingSupply, uint _endSupply, uint _mNumerator, uint _mDenominator, uint _maxSupply) internal pure returns (uint256) {
		uint base1 = (((_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a))*(_endSupply-_a)+_b);
		uint base2 = (((_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a))*(_startingSupply-_a)+_b);
		uint height = _startingSupply-_endSupply;
		return (base1 + base2) * height / 2;
	}
}
