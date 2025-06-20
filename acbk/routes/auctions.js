const express = require('express');
const router = express.Router();
const db = require("../db");


router.get('/',async (req,res) => {
    const result = await db.query(`SELECT * FROM auctions`);
    res.json(result.rows);
})

router.get('/:id',async (req,res) => {
    const id = req.params;
    const result = await db.query(`SELECT & FROM auctions where id = $1`,[id]);
    res.json(result.rows[0]);
})