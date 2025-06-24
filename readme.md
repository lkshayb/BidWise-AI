# 🎙️ Voice Agent for Real-Time Auction Participation , Bidding & Listing .

An AI-powered voice assistant built using OmniDimension that enables users to interact with a real-time online auction system via web call or a phone call. Users can query product details, monitor bids, and place new bids using their voice. Also the user can list their own product to the auction system.
### Backend Auction System Deployed on => https://auction-agent.onrender.com/auctions
### Frontend Deployed on => https://auction-agent.vercel.app
### PostgresDB for auction system => postgresql://auctionDB_owner:npg_gQRz3asb0iKY@ep-dark-sky-a8vh5bl5-pooler.eastus2.azure.neon.tech/auctionDB?sslmode=require

##  Features

-  Voice agent via OmniDimension
-  Real-time product listing
-  Highest bid tracking
-  Full bid history 
-  Bids per product summary
-  Accepts new bids only if they exceed the current highest
-  REST API integration (GET/POST endpoints)

---

## ScreenShots
### HomePage
![image](https://github.com/user-attachments/assets/be15de39-7f5f-4a41-968d-043144b79697)
### Web Call
![image](https://github.com/user-attachments/assets/4f9176bb-0f8e-4ab5-94a1-9a8c4d1fa46e)



##  Tech Stack

- **Backend:** Node.js, Express.js , Python (for agent creation)
- **Database:** PostgreSQL
- **Voice Agent:** OmniDimension
- **Deployment:** Render.com (for backend) & vercel (for frontend)

---

##  API Endpoints

### Get All Products
```
GET /auctions
body : {
  "id" : {product_id} // product_id = 1 for all products retrieval
}
```
```
GET /auctions/bidhistory
body : {
  "id" : {product_id}
}
```
```
POST /auctions/bid
body : {
  "username" : {username},
  "bid_amount" : {bid amount to be placed},
  "id" : {product id}
}
```
```
POST /auctions/add
body : {
  "product_name" : {name of the product},
  "desc" : {description of the product},
  "time_for_auction" : {time for the auction},
  "initial bid" : {bid amount to start with}


