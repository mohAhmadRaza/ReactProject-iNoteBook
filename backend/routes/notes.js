const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    obj = {
        name: "Ahmad",
        number: 34
    }

    res.json(obj);
})

module.exports = router;