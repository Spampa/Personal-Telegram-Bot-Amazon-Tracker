const { Router } = require('express');

const router = Router();

router.get('/v1/lists', (req, res) => {
    res.status(200).json({
        message: "Lists"
    });
});

module.exports = router;