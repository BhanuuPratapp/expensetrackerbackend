const express = require('express');
const purchase=require("../controllers/purchase")
const purchaseController = require('../controllers/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)
router.post("/is_premium",authenticatemiddleware.authenticate,purchaseController.is_premium)

router.get("/leaderboard", authenticatemiddleware.authenticate,purchaseController.leaderboard)
router.get("/report",authenticatemiddleware.authenticate,purchaseController.report)
router.get("/downloadreport",authenticatemiddleware.authenticate,purchaseController.reportdownload)
router.get("/filecontents",authenticatemiddleware.authenticate,purchaseController.fileURL)

module.exports = router;