// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title NameRegistry
 * @dev Bir domain'in kime ait olduğunu ve hangi resolver'a yönlendirildiğini tutar.
 */
contract NameRegistry {
    address owner;

    // namehash => domain sahibi
    mapping(bytes32 => address) internal _owners;

    // namehash => resolver adresi
    mapping(bytes32 => address) public resolvers;

    // namehash => expireDate
    mapping(bytes32 => uint256) private _expiries;

    // address => bool only internal contracts
    mapping(address => bool) internal verifiedContracts;

    // Olaylar
    event NameRegistered(bytes32 indexed nameHash, address indexed owner);
    event NameTransferred(bytes32 indexed nameHash, address indexed oldOwner, address indexed newOwner);
    event ResolverSet(bytes32 indexed nameHash, address indexed resolver);

    modifier isVerified {
        require(verifiedContracts[msg.sender], "Contract is not registred");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "This is an only owner function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Basit kayıt fonksiyonu.
     *         Daha gerçekçi senaryolarda, ücret, zaman kısıtlaması vs. kontrol edersiniz.
     * @param nameHash Önceden hesaplanmış namehash (örnek: Namehash.namehash("alice.eth"))
     */
    function registerName(bytes32 nameHash, address userAddress) external isVerified {
        require(ownerOf(nameHash) == address(0), "Name already registered");
        _owners[nameHash] = userAddress;
        _setExpiry(nameHash, block.timestamp + 365 days);

        emit NameRegistered(nameHash, msg.sender);
    }

    /**
     * @notice Bir domain'i başka birine transfer eder.
     * @param nameHash Transfer edilecek namehash
     * @param newOwner Yeni sahibi
     */
    function transferName(bytes32 nameHash, address newOwner, address sender) external isVerified {
        require(ownerOf(nameHash) == sender, "Not the owner");
        address oldOwner = _owners[nameHash];
        _owners[nameHash] = newOwner;

        emit NameTransferred(nameHash, oldOwner, newOwner);
    }

    /**
     * @notice Domain'e resolver atama fonksiyonu.
     * @param nameHash Güncellenecek namehash
     * @param resolver Yeni resolver kontrat adresi
     */
    function setResolver(bytes32 nameHash, address resolver) external isVerified {
        resolvers[nameHash] = resolver;

        emit ResolverSet(nameHash, resolver);
    }

    function _setExpiry(bytes32 nameHash, uint256 timestamp) internal {
        _expiries[nameHash] = timestamp;
    }

    function expiryOf(bytes32 nameHash) external view returns (uint256) {
        return _expiries[nameHash];
    }

    function isExpired(bytes32 nameHash) public view returns (bool) {
        return block.timestamp > _expiries[nameHash];
    }

    function ownerOf(bytes32 nameHash) public view returns (address) {
        if (isExpired(nameHash)) {
            return address(0);
        }
        return _owners[nameHash];
    }

    function addVerifiedContract(address contractAddress) public onlyOwner {
        verifiedContracts[contractAddress] = true;
    }

    function deleteVerifiedContract(address contractAddress) public onlyOwner {
        verifiedContracts[contractAddress] = false;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

}