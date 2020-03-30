pragma solidity ^0.5.0;

contract Example{
    string memeHash;

    function set(string memory _memeHash) public {
      memeHash = _memeHash;
    }

    function get() public view returns(string memory) {
      return memeHash;
    }
}