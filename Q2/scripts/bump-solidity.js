const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

bumpVersion("HelloWorldVerifier");
bumpVersion("Multiplier3Verifier");
bumpVersion("_plonkMultiplier3Verifier");

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment


function bumpVersion(fileName){
    let filePath = "./contracts/" + fileName +".sol";
    let content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
    bumped = bumped.replace(verifierRegex, "contract " + fileName);

    fs.writeFileSync(filePath, bumped);
}