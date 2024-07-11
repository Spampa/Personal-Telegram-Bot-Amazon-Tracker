const { Router } = require('express');

const router = Router();
const userProductService = require('../services/userProductService');

router.post('/v1/products', async (req, res) => {
    const obj = req.body;
    
    if(!obj.link || !(obj.link.includes('https://amzn.eu/d') || obj.link.includes('https://www.amazon'))){
        return res.status(400).json({
            code: 400,
            error: "Bad request"
        });
    }
    try{
        const result = await userProductService.addUserProduct(obj);
        if(result?.error){
            res.status(result.code).json(result);
            return;
        }
        res.status(201).json(result);
    }
    catch(e){
        console.error(e);
        res.status(500).send('Error');
    }
});

module.exports = router;