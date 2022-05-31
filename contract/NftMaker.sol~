//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.13;

// We need some util functions for strings.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

contract NFTMaker is ERC721URIStorage {
  //event is like webhooks which will notify the frontend once event is emitted.
  event NewEpicNFTMinted(address sender, uint256 tokenId);

  constructor() ERC721 ("InBlocks", "SQUARE") {
    console.log("This is my NFT contract. Woah!");
  }


 
  function makeAnEpicNFT(string memory ipfsImageUrl, string memory name,string memory nftDescription ) public {
    uint256 newItemId = _tokenIds.current();
   _safeMint(msg.sender, newItemId);
  
   // Get all the JSON metadata in place and base64 encode it.
   string memory json = Base64.encode(
         
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // We set the title of our NFT as the generated word.
                    name,
                    '", "description": "',nftDescription,'", "image": "',ipfsImageUrl,'"}'
                )
            )
        )
    );
    
    //we prepend data:application/json;base64, to our data.
    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );


    // We'll be setting the tokenURI later!
    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    //Below we are emitting the our events once our nft is minted , we are passing address of the user and itemId.
    emit NewEpicNFTMinted(msg.sender, newItemId); 
  }
}
