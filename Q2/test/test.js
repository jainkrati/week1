const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing

        // invoke fullProve command on groth16 library with input json and path of witness and path of prover key to generate proof and public signals
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        // print the 1st value of the public signal, which represents the output signal
        console.log('1x2 =',publicSignals[0]);

        // convert public signals into big int values 
        const editedPublicSignals = unstringifyBigInts(publicSignals);

        // convert proof string into big int
        const editedProof = unstringifyBigInts(proof);

        // prepare callData for calling solidity verify function
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // extract individual input signal parameters into array
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // prepare a from x and y values extracted from calldata
        const a = [argv[0], argv[1]];
        // prepare b from 4 points extracted from calldata
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // prepare c from x and y values extracted from calldata
        const c = [argv[6], argv[7]];
        // prepare Input as array sliced from 8th index of argv array
        const Input = argv.slice(8);

        // invoke verifier to verify the proof and expect it to be true for the test to pass
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // invoke fullProve command on groth16 library with input json and path of witness and path of prover key to generate proof and public signals
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"},
        "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
        "contracts/circuits/Multiplier3/circuit_final.zkey");

        // print the 1st value of the public signal, which represents the output signal
        console.log('1x2x3 =',publicSignals[0]);

        // convert public signals into big int values 
        const editedPublicSignals = unstringifyBigInts(publicSignals);

        // convert proof string into big int
        const editedProof = unstringifyBigInts(proof);

        // prepare callData for calling solidity verify function
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // extract individual input signal parameters into array
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // prepare a from x and y values extracted from calldata
        const a = [argv[0], argv[1]];
        // prepare b from values extracted from calldata
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // prepare c from x and y values extracted from calldata
        const c = [argv[6], argv[7]];
        // prepare Input as array sliced from 8th index of argv array
        const Input = argv.slice(8);

        // invoke verifier to verify the proof and expect it to be true for the test to pass
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here

        // invoke fullProve command on groth16 library with input json and path of witness and path of prover key to generate proof and public signals
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2","c":"3"},
         "contracts/circuits/_plonkMultiplier3/Multiplier3_js/Multiplier3.wasm",
         "contracts/circuits/_plonkMultiplier3/circuit_final.zkey");

        // print the 1st value of the public signal, which represents the output signal
        console.log('1x2x3 =',publicSignals[0]);

        // convert public signals into big int values 
        const editedPublicSignals = unstringifyBigInts(publicSignals);

        // convert proof string into big int
        const editedProof = unstringifyBigInts(proof);

        // prepare callData for calling solidity verify function
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // extract individual input signal parameters into array
        const argv = calldata.replace(/["[\]\s]/g, "").split(',');
    
        // prepare a from x and y values extracted from calldata
        const a = argv[0];
        // prepare Input as array sliced from 8th index of argv array
        const Input = [argv[1]];

        // invoke verifier to verify the proof and expect it to be true for the test to pass
        expect(await verifier.verifyProof(a, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = 0;
        let b = [0];
        expect(await verifier.verifyProof(a, b)).to.be.false;
    });
});