const router = require('express').Router();


router.get('/', (req, res) => { res.render('index') });
router.use('/user', require('./user'));
router.use('/restaurant', require('./restaurant'));


module.exports = router;
