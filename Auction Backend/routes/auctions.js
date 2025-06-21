const express = require('express');
const router = express.Router();
const db = require("../db");

//gets all the products
router.get('/',async (req,res) => {
    const result = await db.query(`SELECT * FROM auctions`);
    res.json(result.rows);
})

//fetch product using id
router.get('/:id',async (req,res) => {
    const {id} = req.params;
    const result = await db.query(`SELECT * FROM auctions where id = $1`,[id]);
    res.json(result.rows[0]);
})

//post bid
router.post('/:id/bid',async (req,res) => {
    try{
        const {id} = req.params;
        const {username,bid_amount} = req.body;
        console.log("Incoming auction details --> ID :",id,"Username:",username,"Bid Amount:",bid_amount)
        const auction = await db.query("SELECT * FROM auctions WHERE id=$1",[id]);
        if(!auction.rows.length) {
            console.log("Auction Not Found for ID :",id)
            return res.status(404).send("---Auction Not Found ---Please Check product ID");
        }
        const current_bid = auction.rows[0].current_highest_bid;
        console.log("Current Highest Bid:",current_bid)

        if(current_bid >= bid_amount){
            console.log("Bid too low:",bid_amount,"current bid is ",current_bid)
            return res.status(400).send("Bid Amount should be greater than the current highest bid on this product");
        }

        const insertResult = await db.query(
            "INSERT INTO bids (auction_id, username, bid_amount) VALUES($1,$2,$3)",[id,username,bid_amount]
        )
        console.log("Insert Result:",insertResult.rowCount);
        const updateResult = await db.query(
            "UPDATE auctions SET current_highest_bid = $1 WHERE id = $2",[bid_amount,id]
        );
        console.log("Update Result:",updateResult.rowCount)

        res.send("!!! BID PLACED SUCCESSFULLY !!!");

    } catch(err){
        console.log("Internal Server Error during Bid Placement:",err);
        res.status(500).send("Internal Server Error while placing the bid")
    }
})


module.exports = router