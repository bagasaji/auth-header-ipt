const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const fs = require('fs');

const { KJUR } = require('jsrsasign');

exports.postAuthHeader = (req, res, next) => {
    const clientId = fs.readFileSync('D:/prototyping/prototype-ipt/clientId.txt', 'utf-8');
    const clientSecret = fs.readFileSync('D:/prototyping/prototype-ipt/clientSecret.txt', 'utf-8');
    const privateKey = fs.readFileSync('D:/prototyping/prototype-ipt/rsa_2048_priv.pem', 'utf-8');
    const publicKey = fs.readFileSync('D:/prototyping/prototype-ipt/rsa_2048_pub.pem', 'utf-8');
    const xTimestamp = moment().format();

    try {
        // X-SIGNATURE RS256 + Base64
        const sign = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
        sign.init(privateKey);
        sign.updateString(clientId + '|' + xTimestamp);
        const signatureAuthorization = sign.sign();
        console.log("Signature Authorization generated!");

        const sig = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
        sig.init(publicKey);
        sig.updateString(clientId + '|' + xTimestamp);
        const isValid = sig.verify(signatureAuthorization);
        if (!isValid) {
            const error = new Error("Invalid Signature Authorization!");
            console.log(error.message);
            error.statusCode = 401;
            throw error;
        }
        console.log("Signature Authorization valid!");

        //ACCESS TOKEN 
        const accessToken = jwt.sign(
            {
                "X-TIMESTAMP": xTimestamp,
                "X-CLIENT-KEY": clientId,
                "X-SIGNATURE": signatureAuthorization,
                "body": {
                    "grantType": "client_credentials"
                }
            },
            clientSecret,
            {
                expiresIn: '1h'
            }
        )
        if (!accessToken) {
            const error = new Error("Access Token not generated!");
            console.log(error.message);
            error.statusCode = 401;
            throw error;
        }
        console.log("Access Token generated!" + accessToken);

        // X-SIGNATURE HS512 + Base64
        const body = req.body;
        const bodySignature = crypto.createHash('sha256').update(body.toString()).digest('hex');

        const signatureSaldo = KJUR.jws.JWS.sign(null, { alg: "HS512" }, "POST" + ':' + "/bi/openapi/balance-inquiry" + ':' + accessToken + ':' + bodySignature.toLowerCase() + ':' + xTimestamp, { "utf8": clientSecret });
        if (!signatureSaldo) {
            const error = new Error("Signature Saldo not generated!");
            console.log(error.message);
            error.statusCode = 401;
            throw error;
        }
        console.log("Signature Saldo generated!" + signatureSaldo);

        res.status(200).json({
            signatureAuth: signatureAuthorization,
            accessToken: accessToken,
            signatureSaldo: signatureSaldo
        });
        console.log("Login success!");

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

