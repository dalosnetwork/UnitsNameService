// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title SimpleResolver
 * @dev Her bir namehash için hangi Ethereum adresine denk geldiğini depolar.
 *      Farklı tipte kayıtlar (örn. IPFS, metin kayıtları) eklemek için genişletilebilir.
 */

import "./NameRegistry.sol";

contract SimpleResolver {
    address proxy;

    // namehash => cüzdan adresi
    mapping(bytes32 => address) private _addresses;

    event AddressSet(bytes32 indexed nameHash, address indexed addr);

    modifier isProxy {
        require(msg.sender == proxy, "This is a proxy contract");
        _;
    }

    constructor(address _proxy) {
        proxy = _proxy;
    }

    /**
     * @notice Bir domain'e karşılık gelen adresi set eden fonksiyon.
     *         Sadece domain sahibi çağırabilir (NameRegistry üzerinden kontrol edilir).
     * @param nameHash namehash
     * @param addr domain'in karşılık geldiği adres (cüzdan, kontrat, vb.)
     */
    function setAddress(bytes32 nameHash, address addr) external isProxy {
        _addresses[nameHash] = addr;
        emit AddressSet(nameHash, addr);
    }

    /**
     * @notice Verilen namehash'in hangi adrese işaret ettiğini döndürür.
     * @param nameHash namehash
     * @return kayıtlı adres
     */
    function resolveAddress(bytes32 nameHash) external view returns (address) {
        return _addresses[nameHash];
    }

    function changeProxy(address _newProxy) external isProxy {
        proxy = _newProxy;
    }
}