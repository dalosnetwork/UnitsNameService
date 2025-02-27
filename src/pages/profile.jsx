import { useState } from "react";
import { ethers } from "ethers";
import logo from "../design/assets/logotype.svg";
import shapeimg from "../design/assets/shape.svg";
import searchimg from "../design/assets/icons/search.svg";
import checkimg from "../design/assets/icons/check.svg";
import addressimg from "../design/assets/icons/address.svg";
import profileimg from "../design/assets/icons/profile.svg";
import Navbar from "../components/navbar";
import { useSearchParams } from "react-router-dom";

function Profile() {
  const [isClaimed, setIsClaimed] = useState(false);

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

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

  
  function truncateString(str) {
    return str.slice(0, 5) + "..." + str.slice(str.length - 10, str.length);
  }

  return (
    <>
      <Navbar />
      <article>
        <div className="container">
            <div className="row">
              <div className="col-12 df jc">
                <div className="row claim-up df aic">
                  <div className="col df aic">
                    <div className="row df aic gap-1 pointer" id="profile">
                      <div className="col p-0">
                        <div className="profile-icon">
                          <img src={profileimg} alt="Profile" />
                        </div>
                      </div>
                      <div className="col p-0">
                        <div className="text-24b white-t">Profile</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 df jc mt-3">
                <div className="row profile-claim">
                  <div className="col-12 js df aic inner-container">
                    <div className="text-48 units_green mt-2">{name}.units</div>
                  </div>
                  <div className="col-12 d-grid jc mt-4">
                    <div className="row">
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
                                  {truncateString(
                                    sessionStorage.getItem("address")
                                  )}
                                </div>
                                <div className="col-auto p-0 df je">
                                  <div className="address pointer">
                                    <img src={addressimg} alt="icon" />
                                  </div>
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
                                <div className="col df je">25 June 2025</div>
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
      </article>
    </>
  );
}

export default Profile;
