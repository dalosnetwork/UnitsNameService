// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Namehash Library
 * @dev EIP-137 benzeri bir recursive namehash algoritması.
 *      Bu fonksiyon, "bob.alice.eth" gibi stringleri bytes32 hash'e çevirir.
 *      Daha fazla bilgi için: https://eips.ethereum.org/EIPS/eip-137
 */
library Namehash {
    /**
     * @notice Verilen bir domain string'ini EIP-137 tarzı bir namehash'e dönüştürür.
     * @param domain Örneğin: "alice.eth" veya "bob.alice.eth"
     * @return nameHash Elde edilen bytes32 hash
     */
    function namehash(string memory domain) public pure returns (bytes32) {
        // Boş string verildiyse hash = 0x0
        if (bytes(domain).length == 0) {
            return bytes32(0);
        }

        // add .units
        domain = string(abi.encodePacked(domain, ".units"));

        // EIP-137'ye göre, domaini sağdan sola '.' ile ayırıp
        // her label'ı parent hash ile birleştirerek ilerleriz
        bytes32 node;
        uint256 start = 0;
        uint256 end = 0;
        bytes memory domainBytes = bytes(domain);

        // Sağdan sola parse edeceğimiz için, string'i ters okuyacağız
        // Yöntem: en sağdan '.' buldukça label'ları node'a ekle
        node = bytes32(0);
        end = domainBytes.length;

        while (end > 0) {
            // start, en soldaki '.' veya 0'a eşit olacak
            uint256 lastDotPos = end;
            while (lastDotPos > 0 && domainBytes[lastDotPos - 1] != ".") {
                lastDotPos--;
            }
            // label = domainBytes[lastDotPos..end-1]
            bytes32 labelHash = keccak256(abi.encodePacked(slice(domainBytes, lastDotPos, end - lastDotPos)));
            node = keccak256(abi.encodePacked(node, labelHash));

            if (lastDotPos == 0) {
                break; // artık bitti
            }
            end = lastDotPos - 1; // bir önceki '.' işaretinin solundan devam edeceğiz
        }
        return node;
    }

    /**
     * @notice Bir byte array içerisinden [start, start+length) dilimini kopyalar.
     */
    function slice(
        bytes memory data,
        uint256 start,
        uint256 length
    ) internal pure returns (bytes memory) {
        require(start + length <= data.length, "slice_outOfRange");
        bytes memory tempBytes = new bytes(length);

        for (uint256 i = 0; i < length; i++) {
            tempBytes[i] = data[start + i];
        }
        return tempBytes;
    }
}