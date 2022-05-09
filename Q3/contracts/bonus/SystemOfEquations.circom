pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matmul.circom";

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    component matrixMultiplier = matMul(n,n,1);

    for(var i = 0;i<n;i++) {
        for (var j=0; j<n; j++) {
            matrixMultiplier.a[i][j] <== A[i][j];
        }
    }

    for(var i = 0;i<n;i++) {
            matrixMultiplier.b[i][0] <== x[i];
    }

    for(var i = 0;i<n;i++) {
        matrixMultiplier.out[i][0] === b[i];
    }

    out <== 1;
}

component main {public [A, b]} = SystemOfEquations(3);