import { useEffect, useState } from "react";
import { BrowserProvider, ethers } from "ethers";
import logo from "../design/assets/Logotype.svg";
import walletimg from "../design/assets/Icons/wallet.svg";

function Navbar() {
  const [address, setAddress] = useState(sessionStorage.getItem("address"));
  const [name, setName] = useState("");

  const contratAddress = "0x3484eF73bd71039B5B580E4D3023209FA413A2C0";
  const contratABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newProxy",
          type: "address",
        },
      ],
      name: "changeProxy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_newFee",
          type: "uint256",
        },
      ],
      name: "changeRegisterFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "createNewRegister",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "expiryOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "isExpired",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
      ],
      name: "resolveAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      name: "reverseLookup",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "domain",
          type: "string",
        },
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferName",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "address",
          name: "_contractAddress",
          type: "address",
        },
      ],
      name: "updateContractAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const handleConnectWallet = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      let contract = new ethers.Contract(contratAddress, contratABI, signer);
      sessionStorage.setItem("address", userAddress);
      setAddress(userAddress);

      try {
        const details = await contract.reverseLookup(userAddress);
        if (details === "") {
          setName(truncateString(userAddress));
        } else {
          setName(details + ".units");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        setName(truncateString(userAddress));
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  useEffect(() => {
    const savedAddress = sessionStorage.getItem("address");
    if (savedAddress) {
      setAddress(savedAddress);
      setName(truncateString(savedAddress));
      fetchName(savedAddress);
    }
  }, []);

  const fetchName = async (addr) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(contratAddress, contratABI, signer);
      const details = await contract.reverseLookup(addr);

      if (details === "") {
        setName(truncateString(addr));
      } else {
        setName(details + ".units");
      }
    } catch (error) {
      console.error("Error fetching name:", error);
    }
  };

  function truncateString(str) {
    return str.slice(0, 5) + "..." + str.slice(-5);
  }

  return (
    <header>
      <div className="container">
        <div className="row row-cols-2 hd">
          <div className="col df">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
          </div>
          <div className="col df je aic">
            {address ? (
              <div className="wallet-border px-3 py-1 pointer df jc aic">
                <div className="row">
                  <div className="col-auto pe-0">
                    <div className="wallet-img">
                      <img src={walletimg} alt="wallet icon" />
                    </div>
                  </div>
                  <div className="col df aic">
                    <div className="text-14 white-t connect">{name}</div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="wallet white-b pointer df jc aic"
                onClick={handleConnectWallet}
              >
                <div className="text-14 connect">Connect Wallet</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
