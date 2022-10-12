const router = require('express').Router()

router.get('/api', (req, res) => res.send('Hello World!!'));

module.exports = router;