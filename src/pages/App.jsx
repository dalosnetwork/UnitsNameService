import { useEffect, useState } from "react";
import logo from "../design/assets/Logotype.svg";
import shapeimg from "../design/assets/shape.svg";
import searchimg from "../design/assets/Icons/search.svg";
import searchredimg from "../design/assets/Icons/searchred.svg";
import checkimg from "../design/assets/Icons/check.svg";
import ximg from "../design/assets/Icons/x.svg";
import addressimg from "../design/assets/Icons/address.svg";
import Navbar from "../components/navbar";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

function App() {
  const [name, setName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isClaimNow, setIsClaimNow] = useState(false);
  const [readyToCheck, setReadyToCheck] = useState(true);
  const [isBuyPhase, setIsBuyPhase] = useState(false);
  const navigate = useNavigate();

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

  const handleNameChange = async (e) => {
    setIsClaimNow(false);
    setName(e.target.value);
  };

  const handleIsNameAvailable = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    let contract = new ethers.Contract(contratAddress, contratABI, signer);
    console.log(contract);
    try {
      const details = await contract.ownerOf(name);
      if (details !== "0x0000000000000000000000000000000000000000") {
        setIsAvailable(false);
        setIsClaimNow(false);
        setReadyToCheck(false);
      } else {
        setIsAvailable(true);
        setIsClaimNow(true);
        setReadyToCheck(false);
      }
      console.log("DENEME DETAILS", details);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleBuyName = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    let contract = new ethers.Contract(contratAddress, contratABI, signer);
    const value = ethers.parseEther("10");
    try {
      const tx = await contract.createNewRegister(name, { value });

      console.log("Transaction Sent:", tx);
      await tx.wait();
      console.log("Transaction Mined:", tx);
      navigate("/profile");
    } catch (error) {
      console.error("Error creating stake:", error.reason || error.message);
    }
  };

  function truncateString(str) {
    if (!str){
      return "not connected"
    }
    return str.slice(0, 5) + "..." + str.slice(str.length - 10, str.length);
  }

  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1);
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setExpiryDate(formattedDate);
  }, []);

  return (
    <>
      <Navbar />
      <article>
        <div className="container">
          {!isBuyPhase ? (
            <div className="row article">
              <div className="col-12 up">
                <div className="row row-up">
                  <div className="col je df">
                    <div className="shape">
                      <img src={shapeimg} alt="shape" />
                    </div>
                  </div>
                  <div className="col-auto jc df">
                    <div className="text-24b white-t df aic">
                      Get your name now
                    </div>
                  </div>
                  <div className="col js df">
                    <div className="shape">
                      <img src={shapeimg} alt="shape" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 down df jc aic">
                <div className={`down-div ${isAvailable}`}>
                  <div className="row">
                    <div className="col">
                      <div className="row">
                        <div className="col-auto">
                          <div className="search">
                            <img
                              src={isAvailable ? searchimg : searchredimg}
                              alt="Search"
                            />
                          </div>
                        </div>

                        <div className="col grey text-48">
                          <div className="input-name">
                            <input
                              className={`text-48 ${
                                isAvailable ? "units_green" : "red"
                              }`}
                              placeholder="Claim your name"
                              maxLength={"100"}
                              type="text"
                              onChange={handleNameChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div
                        className={`text-48 df je ${
                          isAvailable ? "units_green " : "red"
                        }`}
                      >
                        .units
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`col-12 df jc aic ${
                  name !== "" ? "d-flex" : "d-none"
                }`}
                id="infoBox"
              >
                <div className="check-name mt-3 df jc aic">
                  <div className="row check-div">
                    <div className="col df aic p-0">
                      <div className="row">
                        <div className="col-auto aic df je">
                          <div className="check-btn">
                            {isAvailable ? (
                              <img src={checkimg} alt="True" />
                            ) : (
                              <img src={ximg} alt="False" />
                            )}
                          </div>
                        </div>
                        <div
                          className="col text-24 white-t pe-5"
                          style={{ overflowWrap: "anywhere" }}
                        >
                          “{name}”
                          {!readyToCheck
                            ? isAvailable
                              ? " is available"
                              : " is not available, try something else."
                            : " please check the name"}
                        </div>
                      </div>
                    </div>
                    <div className="col-auto df je aic p-0">
                      <button
                        className="claim-btn text-14 black jc df aic wallet"
                        id="claim"
                        onClick={() =>
                          isClaimNow
                            ? setIsBuyPhase(true)
                            : handleIsNameAvailable()
                        }
                      >
                        {isClaimNow ? "Claim Now" : "Check Name"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12 df jc">
                <div className="row claim-up df aic">
                  <div className="col df aic p-0">
                    <div className="row">
                      <div className="col-auto aic df je">
                        <div className="check-btn">
                          <img src={checkimg} alt="True" />
                        </div>
                      </div>
                      <div
                        className="col text-24 white-t pe-5"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        “{name}” is available.
                      </div>
                    </div>
                  </div>
                  <div className="col-auto je df">
                    <div className="row df aic">
                      <div className="col p-0">
                        <button
                          className="claim-btn text-14 black jc df aic wallet pointer"
                          id="profile-claimed"
                          onClick={() => handleBuyName()}
                        >
                          Claim now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 df jc mt-3">
                <div className="row profile-down">
                  <div className="col-12 jc d-grid aic inner-container">
                    <div className="inner-container">
                      <div className="row">
                        <div
                          className="col-12 text-48 units_green mt-2"
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {name}.units
                        </div>
                        <div className="col-12 mb-3">
                          <div className="row">
                            <div className="col-auto">
                              <div className="text-24b white-t">Address</div>
                            </div>
                            <div className="col p-0 aie df">
                              <div className="line"></div>
                            </div>
                            <div className="col-auto">
                              <div className="text-24b white-t">
                                <div className="row">
                                  <div className="col df je">
                                     { truncateString(
                                        sessionStorage.getItem("address")
                                      )}
                                    
                                  </div>
                                  <div className="col-auto p-0 df je">
                                    {sessionStorage.getItem("address") && (
                                      <div className="address pointer df aic">
                                        <img src={addressimg} alt="icon" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mb-3">
                          <div className="row">
                            <div className="col-auto">
                              <div className="text-24b white-t">Ownership</div>
                            </div>
                            <div className="col p-0 aie df">
                              <div className="line"></div>
                            </div>
                            <div className="col-auto">
                              <div className="text-24b white-t">
                                <div className="row">
                                  <div className="col df je">not owned</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mb-3">
                          <div className="row">
                            <div className="col-auto">
                              <div className="text-24b white-t">Expiry</div>
                            </div>
                            <div className="col p-0 aie df">
                              <div className="line"></div>
                            </div>
                            <div className="col-auto">
                              <div className="text-24b white-t">
                                <div className="row">
                                  <div className="col df je">{expiryDate}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

export default App;
