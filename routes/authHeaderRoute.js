const express = require('express');
const router = express.Router();

const authHeaderController = require('../controllers/authHeaderController')

//router.get('/', function(req, res, next) {res.send('User Deleted Successfully.')});
//biasanya 2 param di function get, param terakhir di bikin callback function mengarah ke controller
//ada 3 param, fungsi param tengah untuk validation

// router.post('/:accountId', authMiddleware, saldoController.postSaldo);
router.post('/', authHeaderController.postAuthHeader);

module.exports = router;