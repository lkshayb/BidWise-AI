const express = require('express');
const router = express.Router();
const db = require("../db");


router.get('/', async (req, res) => {
    try{
        const { id } = req.query;

        if (id == -1 || !id) {
            const result = await db.query(`SELECT *,end_time - NOW() AS time_remaining FROM auctions`);

            res.send(result.rows);
        } else {
            const result = await db.query(`SELECT *,end_time - NOW() AS time_remaining FROM auctions WHERE id = $1`, [id]);
            res.send(result.rows[0]);
        }
    }
    catch(err){
        res.send("ERROR OCCURED :" ,err)
    }
 
});

router.get('/bidhistory', async (req,res) => {
    try{
        const id= req.query.id;
        console.log(id)
        const fetch = await db.query(
            "SELECT * FROM bids WHERE auction_id = $1",[id]
        )
        console.log(fetch.rows)
        res.send(fetch.rows)
    }
    catch(err){
        res.send("Error Occured:",err)
    }

})


//post bid
router.post('/bid',async (req,res) => {
    try{
        const {username,bid_amount,id} = req.body;
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

        const updatebids = await db.query(
            "UPDATE auctions SET no_of_bids = no_of_bids + 1 WHERE id = $1",[id]
        )
        res.send("!!! BID PLACED SUCCESSFULLY !!!");

    } catch(err){
        console.log("Internal Server Error during Bid Placement:",err);
        res.status(500).send("Internal Server Error while placing the bid")
    }
})

router.post('/add', async (req,res) => {
    try{
        const {product_name,desc,time_for_auction,initial_bid} = req.body;
        console.log(`INCOMING PRODUCT UPLOAD --> name:${product_name} , decription:${desc} , time for auction :${time_for_auction} , initial bid : ${initial_bid}`)
        
        const start = new Date();
        const end = new Date(start.getTime() + time_for_auction * 60000);

        const start_time = start.toISOString();
        const end_time = end.toISOString();

        console.log(start_time,end_time)
        const update = await db.query(
            "INSERT INTO auctions (product_name,description,current_highest_bid,start_time,end_time) VALUES($1,$2,$3,$4,$5)",[product_name,desc,initial_bid,start_time,end_time]
        )
        res.send("Product added successfully")
    }
    catch(err){
        res.send(err)
    }
})

module.exports = router