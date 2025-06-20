CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  product_name TEXT NOT NULL,
  description TEXT,
  time_remaining INTEGER,
  current_highest_bid INTEGER DEFAULT 0
);

CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER REFERENCES auctions(id),
  username TEXT UNIQUE NOT NULL,
  bid_amount INTEGER,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);