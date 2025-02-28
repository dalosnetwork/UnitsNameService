// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title RegistrarController
 * @dev Domain kaydı (register) işlemleri için basit bir kontrol katmanı.
 *      Örneğin: Ücret, logic, vs. eklemek için kullanılabilir.
 */

 import "./NameRegistry.sol";
contract RegistrarController {
    NameRegistry public registry;
    address public proxy;

    modifier isProxy {
        require(msg.sender == proxy, "This is an only proxy function");
        _;
    }

    constructor(NameRegistry _registry, address _proxy) {
        registry = _registry;
        proxy = _proxy;
    }

    /**
     * @notice Domain kaydı yapan fonksiyon.
     *         Kullanıcı, yeterli ücreti (registrationFee) ödeyerek domain'i kaydedebilir.
     * @param nameHash Kayıtlanacak domain'in namehash'i.
     */
    function registerName(bytes32 nameHash, address _sender) external isProxy {
        // Domain boşta mı?
        address currentOwner = registry.ownerOf(nameHash);
        require(currentOwner == address(0), "Name already taken");

        // NameRegistry üzerinden domain'i kaydet
        registry.registerName(nameHash, _sender);
    }

    function changeProxy(address _newProxy) external isProxy {
        proxy = _newProxy;
    }

}
