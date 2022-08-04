import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0xE9F54aA815fE09bBA925a626098eF6b882250982";

function App() {
 
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
	const [isMinting, setIsMinting] = useState(false);


  useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
	}, []);

  useEffect(() => {
		function initNFTContract() {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
		}
		initNFTContract();
	}, [account]);


  async function connectWallet() {
		window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setAccount(accounts[0]);
			})
			.catch((error) => {
				alert("Something went wrong");
			});
	}
 

    const data = [
        {
            url: "./assets/images/1.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmQ9xGKLwrsiBmo2mbwkstHv2mRoBKGRJJpgpujwaTrtXR')",
        },
        {
          url: "./assets/images/2.jpg",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmNNq7ajtm5qnPeH3HnrAzGuNKi9c81K794imfXGK5eEY7')",
        },
        {
          url: "./assets/images/3.jpg",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmYZ4ha8QyLkcQMm4UmswY2XvZxwK6EHcJ8MNv5Js4mSDz')",
        },
        {
          url: "./assets/images/4.JPG",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmWfjG5ZQsR8wa1Rr77gyVY7BTV4YeQr8bn1uVYxnwHWUt')",
        },
        {
          url: "./assets/images/5.jpg",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmeLJJW7kFUi1hb3haf6d6umQo8g9p2JTb2TDBkJ7JYR2d')",
        },
    ];

    async function withdrawMoney(){
        try {
 
            const response = await NFTContract.withdrawMoney();
            console.log("Received: ", response);
          } catch (err) {
              alert(err);
          }
          
    }

    async function handleMint(tokenURI) {
        setIsMinting(true);
            try {
              const options = {value: ethers.utils.parseEther("0.01")};
              const response = await NFTContract.mintNFT(tokenURI, options);
              console.log("Received: ", response);
            } catch (err) {
                alert(err);
            }
            finally {
              setIsMinting(false);
            }
    }

    if (account === null) {
      return (
        <>
         <div className="container">
           <br/>
          <h1> 🔮 metaschool</h1>
          <h2>NFT Marketplace</h2>
          <p>Buy an NFT from our marketplace.</p>
  
          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
          </div>
          </>
      );
    }

    return (
        <>
            <div className="container">
            <br/>
            <h1> 🔮 metaschool</h1>
          
             <h2>NFT Marketplace</h2>
                {data.map((item, index) => (
                    <div className="imgDiv">
                        <img
                            src={item.url}
                            key={index}
                            alt="images"
                            width={250}
                            height={250}
                        />
                        <button isLoading={isMinting}
                            onClick={() => {
                                eval(item.param);
                            }}
                        >
                            Mint - 0.01 eth
                        </button>
                    </div>
                ))}
                 <button 
                            onClick={() => {
                                withdrawMoney();
                            }}
                        >
                            Withdraw Money from Contract
                 </button>
          
        </div>

        </>
    );
}

export default App;