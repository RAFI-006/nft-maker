import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useState ,useEffect} from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json";
import {
    Form,
    Image,
    Button,
    ProgressBar,
    Container,
    Badge
  } from 'react-bootstrap';
const CONTRACT_ADDRESS =
  "0x2abB474B84934279CdECAC26286B40d3445558b3";
  


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
const [imagePreview, setImagePreview] = useState('');
const [image, setImage] = useState({})
const [loading, setLoading] = useState(false)
const [uploaded, setUploaded] = useState("")
const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [currentAccount, setCurrentAccount] = useState("");
const value = 1;
const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
 

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (sender, tokenId) => {
          console.log(sender, tokenId.toNumber());
             console.log(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  const askContractToMintNft = async () => {
    // const CONTRACT_ADDRESS =
    //   "0x8f7149F891e41122De516d08f7071B3960DA4973";
    setLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT(`ipfs://${uploaded}`,title,description);

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setLoading(false);
       // setupEventListener();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        setupEventListener();
      } else {
        console.log("No authorized account found");

      }
    }

    checkIfWalletIsConnected();
  }, [])


  const titleChange = (e) => {
    setTitle(e.target.value);
  };
  const descriptionChange = (e) =>
  {
      setDescription(e.target.value);
  }


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button  onClick={connectWallet}  className="cta-button connect-wallet-button">
      {currentAccount ? currentAccount.toString() :"Connect to Wallet"}
    </button>
  );

  const createPreview = (e) => {
    if (e.target.value !== '') {
       setImage(e.target.files[0])
        const src = URL.createObjectURL(e.target.files[0])
        setImagePreview(src)
    } else {
        setImagePreview('')
    }
}

const uploadFiletoIPFS = async (e) => {
    setLoading(true)
    e.preventDefault()

    try {
        const added = await ipfs.add(image);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        console.log(`${added.path}`);
       // setUrl(url)
        //setImagePreview(url)
        setUploaded(`${added.path}`);
    } catch (err) {
        console.log('Error uploading the file : ', err)
    }
    setLoading(false)
}

const titleDescriptionView = () =>
{
  return loading ? <div className='progressbar-div' >
  <CircularProgressbar 
  styles={buildStyles({
     
      

     // Rotation of path and trail, in number of turns (0-1)
     rotation: 0.25,
 
     // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
     strokeLinecap: 'butt',
 
     // Text size
     textSize: '16px',
 
     // How long animation takes to go from one percentage to another, in seconds
     pathTransitionDuration: 0.5,
 
     // Can specify path transition in more detail, or remove it entirely
     // pathTransition: 'none',
 
     // Colors
    
     textColor: '#f88',
     trailColor: '#d6d6d6',
     backgroundColor: '#3e98c7',
   })}
  />
  <p>
    Minting...Please Wait for  a while 
  </p>
</div> :   <div className='title-descriptin-div'>

<Image
    style={{ height: '100px' ,width:'100px' ,paddingBottom : "40px"}}
    className='mb-3'
    src={imagePreview}
    thumbnail
/>    
          <input 
       style={{height:'40px'}}
        id='title'
        type='text'
        name='title'
        placeholder='NFT Title'
        value={title}
        onChange={titleChange}
      />
   
   <div   style={{ height: '30px'}} ></div>

<input
         style={{height:'40px'}}
        id='messege'
        type='text'
        name='description'
        placeholder='NFT Description'
        value={description}
        onChange={descriptionChange}
      />
 <div   style={{ height: '30px'}} ></div>
<button onClick={askContractToMintNft} className="mint-nft-button">
     
     Mint NFT
   </button>


  </div>

}
const  renderView = () => {

   return uploaded? titleDescriptionView() : priviewAndUploadImageButtton()

}

const priviewAndUploadImageButtton = () =>
{

     return  loading ? <div className='progressbar-div' >
     <CircularProgressbar 
     styles={buildStyles({
        
         

        // Rotation of path and trail, in number of turns (0-1)
        rotation: 0.25,
    
        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
        strokeLinecap: 'butt',
    
        // Text size
        textSize: '16px',
    
        // How long animation takes to go from one percentage to another, in seconds
        pathTransitionDuration: 0.5,
    
        // Can specify path transition in more detail, or remove it entirely
        // pathTransition: 'none',
    
        // Colors
       
        textColor: '#f88',
        trailColor: '#d6d6d6',
        backgroundColor: '#3e98c7',
      })}
     />
     <p>
       Adding Image to IPFS  
     </p>
   </div>   : <div className="image-preview">

<Image
    style={{ height: '300px' }}
    className='mb-3'
    src={imagePreview}
    thumbnail
/>    

<button onClick={uploadFiletoIPFS} className="mint-nft-button">
     
      NEXT
    </button>

    </div>  

}
  

const walletNotConnectedView = () =>
{
return  <div className='wallet-notconnected-view-div' >

<Image
    style={{ height: '200px' }}
    className='mb-3'
    src= "https://api.byhanddelivery.com/images/blob/profiles/9f14cab2-2c45-49fc-a0b0-5e6c2d68b7a9.png"
    thumbnail
/>   


<p>Connect to Rinkeyby Wallet and Create your NFT's.</p>

<p>Make Sure you have enough balance in your account to do transactions.</p>
</div>
}

const addImageDiv = () =>
{
   return  <div className="add-image-div">
   <div>
      <Form className='form-div' >
          <Form.Control
              required
              type='file'
              accept='image/*'
              onChange={(e)=> createPreview(e)}
              className='mb-3'
          />

        
      </Form>
  </div>
     </div>

}

return (
    
    <div className="App">
   
   <div className="connectWalletDiv">
      {renderNotConnectedContainer()}
      </div>
      <div style={{height:"10%"}}></div>
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT MAKER</p>
          <p className="sub-text">
          Create your NFT's and List to OpenaSea TestNet.
          </p>
         
              {currentAccount?   addImageDiv() : walletNotConnectedView()}
       
         
            {imagePreview ?  renderView(): ""} 


        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
