// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MedicalRecordNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private _hospitalWallet;

    mapping(address => bool) private _hospitalRoles;

    event HospitalRoleAdded(address indexed hospital);
    event HospitalRoleRemoved(address indexed hospital);

    constructor(address hospitalWallet) ERC721("MedicalRecordNFT", "MRNFT") {
        _hospitalWallet = hospitalWallet;
        _hospitalRoles[hospitalWallet] = true;
    }

    function addHospitalRole(address hospital) public onlyOwner {
        require(hospital != address(0), "Hospital address cannot be zero");
        require(!_hospitalRoles[hospital], "Hospital role already added");

        _hospitalRoles[hospital] = true;

        emit HospitalRoleAdded(hospital);
    }

    function removeHospitalRole(address hospital) public onlyOwner {
        require(hospital != address(0), "Hospital address cannot be zero");
        require(_hospitalRoles[hospital], "Hospital role not found");

        _hospitalRoles[hospital] = false;

        emit HospitalRoleRemoved(hospital);
    }

    function isHospital(address _address) public view returns (bool) {
        return _hospitalRoles[_address];
    }

    modifier onlyHospital() {
        require(
            _hospitalRoles[msg.sender],
            "Only hospital can perform this action"
        );
        _;
    }

    function mintToken(
        address patientWallet,
        string memory tokenURI
    ) public onlyHospital {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(patientWallet, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTTransfer(
            newItemId,
            address(0),
            patientWallet,
            tokenURI,
            block.timestamp
        );
    }

    event NFTTransfer(
        uint256 tokenId,
        address from,
        address to,
        string tokenURI,
        uint256 timestamp
    );
}
