const express = require('express');
const router = express.Router();

const authHeaderValidationController = require('../controllers/authHeaderValidationController')

//router.get('/', function(req, res, next) {res.send('User Deleted Successfully.')});
//biasanya 2 param di function get, param terakhir di bikin callback function mengarah ke controller
//ada 3 param, fungsi param tengah untuk validation

// router.post('/:accountId', authMiddleware, saldoController.postSaldo);
router.post('/', authHeaderValidationController.postAuthHeaderValidation);

module.exports = router;