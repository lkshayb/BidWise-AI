from omnidimension import Client    
import json
BASE_URL="http://localhost:5000"
# Initialize client with your actual API key
client = Client("YGuz5sr_aV9FtRzNmm8UVx6T5U8yFk4RUQA-4NXCvpM")

# Create the AuctionBot agent
response = client.agent.create(
    name="AuctionBot",
    welcome_message="""
    Hello! Welcome to AuctionBot — your voice-powered auction assistant. 
    I can help you explore auctions, place bids, get real-time updates, and more. 
    What would you like to do today?
    """,
    functions=[
        {
            "name": "get_auction_info",
            "description": "Retrieve details of a specific auction item",
            "url": f"{BASE_URL}/auctions/{{auction_id}}",   # e.g. /auctions/1
            "method": "GET",
            "params": {
                "auction_id": "{{auction_item}}"
            }
        },
        {
            "name": "place_bid",
            "description": "Place a bid on an auction item",
            "url": f"{BASE_URL}/auctions/{{auction_id}}/bid",
            "method": "POST",
            "params": {
                "auction_id": "{{auction_item}}"
            },
            "body": {
                "username": "{{user_id}}",
                "bid_amount": "{{bid_amount}}"
            },
            "headers": {
                "Content-Type": "application/json"
            }
        },
        {
            "name": "get_all_auctions",
            "description": "List all ongoing auction items",
            "url": f"{BASE_URL}/auctions",
            "method": "GET"
        }
    ],
    context_breakdown=[
        {
            "title": "Identity & Overview",
            "body": """
            You are AuctionBot — a professional, helpful voice agent assisting users in navigating real-time auctions. 
            You retrieve auction data, help users place valid bids, and notify them about important auction events.
            """
        },
        {
            "title": "Auction Information Retrieval",
            "body": """
            - Prompt: "Please provide the item name or auction ID you'd like information about."
            - Return: Description, current highest bid, minimum bid increment, time remaining, and auctioneer name.
            - Example: "The PS5 Slim has a current bid of ₹450 and closes in 5 minutes."
            - Follow up: "Would you like to place a bid or check another item?"
            """
        },
        {
            "title": "Bid Placement Assistance",
            "body": """
            - Prompt: "Tell me which item you'd like to bid on, and your bid amount."
            - Confirm: "You're placing ₹500 on the PS5 Slim. Shall I proceed?"
            - Call backend API: POST to /auctions/<id>/bid
            - Respond: "Your bid has been successfully placed!" or explain any issue.
            """
        },
        {
            "title": "Real-Time Auction Updates",
            "body": """
            - Prompt: "Which item would you like updates for?"
            - Provide: Current bid, number of bids, and time left.
            - Alert: "You’ve been outbid. Would you like to increase your bid?"
            - Offer to subscribe: "Want regular updates for this auction?"
            """
        },
        {
            "title": "User Authentication",
            "body": """
            - Ask: "Please confirm your registered phone number or email to continue."
            - Simulate verification: "Sending a one-time code now... please confirm it."
            - Secure session: Only authenticated users can place bids or see account-specific info.
            """
        },
        {
            "title": "Error Handling Protocols",
            "body": """
            - Detect and respond: "Hmm, that bid is too low. Please offer a higher amount."
            - Explain issues: "Insufficient balance. Would you like to adjust your bid or top up your account?"
            - Offer help: "Would you like to speak to our support team or try a different auction?"
            """
        },
        {
            "title": "Speech Style Guidelines",
            "body": """
            - Tone: Friendly, confident, and natural.
            - Use contractions (I’m, you’re, can’t) and conversational flow.
            - Responses should be short, informative, and offer follow-up choices.
            """
        }
    ],
    transcriber={
        "provider": "deepgram_stream",
        "silence_timeout_ms": 400,
        "model": "nova-3",
        "numerals": True,
        "punctuate": True,
        "smart_format": False,
        "diarize": False
    },
    model={
        "model": "gpt-4o-mini",
        "temperature": 0.7
    },
    voice={
        "provider": "eleven_labs",
        "voice_id": "RO2BvjCY3XHTRsIYByXn"
    },
    post_call_actions={
        "email": {
            "enabled": True,
            "recipients": ["you@example.com"],
            "include": ["summary", "extracted_variables"]
        },
        "extracted_variables": [
            {"key": "user_id", "prompt": "Extract user ID or phone/email used for verification."},
            {"key": "bid_amount", "prompt": "Extract the numerical bid amount placed."},
            {"key": "auction_item", "prompt": "Determine which auction item or product the user referred to."},
            {"key": "error_type", "prompt": "If applicable, determine what went wrong (e.g., low bid, invalid item)."}
        ]
    }
)

print(f"✅ Status: {response['status']}")
print(f"🤖 Created Agent ID: {response['json'].get('id')}")