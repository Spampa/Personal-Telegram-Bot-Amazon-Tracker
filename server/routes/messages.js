const { Router } = require('express');

const router = Router();
const messageService = require('../services/messageService');

router.get('/v1/messages/:id', async (req, res) => {
    const id = req.params.id;
    const m = await messageService.getMessage(id);
    if(m){
        return res.status(200).json(m);
    }
    res.status(404).json({code: 404, error: "Not found"})
});

router.post('/v1/messages', async (req, res) => {
    const m = req.body;
    try{
        await messageService.addMessage(m);
        res.status(201).json(m);
    }
    catch(e){
        console.log(e);
        res.status(500).json({code: 500, message: "Server error"});
    }
});

router.put('/v1/messages/:id', async (req, res) => {
    const id = req.params.id;
    const m = req.body;
    try{
        await messageService.updateMessage(m, id);
        res.status(201).json(m);
    }
    catch(e){
        res.status(500).json({code: 500, message: "Server error"});
    }
});

module.exports = router;