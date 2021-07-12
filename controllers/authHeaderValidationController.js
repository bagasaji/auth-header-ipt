const jwt = require('jsonwebtoken');
const moment = require('moment');
const fs = require('fs');
const { KJUR } = require('jsrsasign');

exports.postAuthHeaderValidation = (req, res, next) => {
    const clientSecret = fs.readFileSync('D:/prototyping/prototype-ipt/clientSecret.txt', 'utf-8');
    
    // req.headers['authorization'] = '123';
    // req.headers['x-timestamp'] = '123';
    // req.headers['authorization-customer'] = '123';
    // req.headers['x-signature'] = '123';

    console.log(req.body);
    console.log(req.headers);

    //AUTHORIZATION CHECK & VALIDATION
    const authorizationHeader = req.get('Authorization');
    if (!authorizationHeader) {
        const error = new Error('Header Authorization missing!');
        console.log(error.message);
        error.statusCode = 401;
        throw error;
    }
    const token = authorizationHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, clientSecret)
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        console.log(error.message);
        error.statusCode = 401;
        throw error;
    }
    console.log("Authorization Valid")

    //AUTHORIZATION-CUSTOMER CHECK & VALIDATION
    const authorizationCustomerHeader = req.get('Authorization-Customer');
    if (!authorizationCustomerHeader) {
        const error = new Error('Header Authorization-Customer missing!');
        console.log(error.message);
        error.statusCode = 401;
        throw error;
    }
    const tokenCustomer = authorizationCustomerHeader.split(' ')[1];
    let decodedTokenCustomer;
    try {
        decodedTokenCustomer = jwt.verify(tokenCustomer, clientSecret)
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
    if (!decodedTokenCustomer) {
        const error = new Error('Not authenticated');
        console.log(error.message);
        error.statusCode = 401;
        throw error;
    }
    console.log("Authorization-Customer Valid")

    //X-TIMESTAMP CHECK & VALIDATION
    const xTimestampHeader = req.get('X-TIMESTAMP');
    if (!xTimestampHeader) {
        const error = new Error('Header X-TIMESTAMP missing!');
        console.log(error.message);
        error.statusCode = 401;
        throw error;
    }
    const iso = moment(xTimestampHeader, moment.ISO_8601, true).isValid();
    if (!iso) {
        const error = new Error('Invalid date / time format!');
        console.log(error.message);
        error.statusCode = 401;
        throw error;
    }
    console.log("X-TIMESTAMP Valid")

    //X-SIGNATURE CHECK & VALIDATION
    // const xSignatureHeader = req.get('X-SIGNATURE');
    // if (!xSignatureHeader) {
    //     const error = new Error('Header X-SIGNATURE missing!');
    //     console.log(error.message);
    //     error.statusCode = 401;
    //     throw error;
    // }
    // let isSignatureValid;
    // try {
    //     isSignatureValid = KJUR.jws.JWS.verify(xSignatureHeader, { "utf8": clientSecret });
    // } catch (error) {
    //     error.statusCode = 500;
    //     throw error;
    // }
    // if (!isSignatureValid) {
    //     const error = new Error('Not authenticated');
    //     console.log(error.message);
    //     error.statusCode = 401;
    //     throw error;
    // }
    // console.log("X-SIGNATURE Valid")

    req.isLoggedIn = true;
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    console.log("Header Authorization done!")
    next();
}

