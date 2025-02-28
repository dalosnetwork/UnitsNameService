// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./NameRegistry.sol";

contract ReverseRegistrar {
    address proxy;

    // Referans alınan NameRegistry (sahiplik kontrolü için)
    NameRegistry public registry;

    // Hangi adresin hangi nameHash'i “primary name” olarak ayarladığı
    mapping(address => string) private _reverseRecords; // make it without string

    event ReverseRecordSet(address indexed user, string indexed name);

    modifier isProxy {
        require(msg.sender == proxy, "This is a only proxy function");
        _;
    }

    constructor(NameRegistry _registry, address _proxy) {
        registry = _registry;
        proxy = _proxy;
    }

    /**
     * @notice Kullanıcı (msg.sender), kendine ait domain'i primary name olarak ayarlar.
     * @param nameHash Domain'in namehash'i (ör. "alibertay.units" -> 0x1234..)
     */
    function setReverseRecord(bytes32 nameHash, string memory name, address sender) external isProxy {
        // 1. Bu nameHash gerçekten msg.sender’a mı ait?
        //    NameRegistry’de ownerOf(nameHash) bu kullanıcı mı?
        address ownerInRegistry = registry.ownerOf(nameHash);
        require(ownerInRegistry == sender, "You are not the domain owner");

        // 2. Kayıt yap
        _reverseRecords[sender] = name;
        emit ReverseRecordSet(sender, name);
    }

    /**
     * @notice Belirli bir kullanıcının “primary nameHash” değerini döndürür.
     * @param user Kullanıcı (cüzdan) adresi
     * @return nameHash Domain namehash (yoksa 0x0)
     */
    function reverseLookup(address user) external view returns (string memory) {
        return _reverseRecords[user];
    }

    /**
     * @notice nameHash’in kime ait olduğunu öğrenmek için: 
     *         registry.ownerOf(nameHash) fonksiyonunu kullanabilirsiniz.
     */

    function changeProxy(address _newProxy) external isProxy {
        proxy = _newProxy;
    }
}
