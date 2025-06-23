from omnidimension import Client

# Initialize client
client = Client("YGuz5sr_aV9FtRzNmm8UVx6T5U8yFk4RUQA-4NXCvpM")

# Create an agent
response = client.agent.create(
    name="AuctionBot",
    welcome_message="""
    Hello! Welcome to AuctionBot — your voice-powered auction assistant. 
    I can help you explore auctions, place bids, get real-time updates, and more. 
    You can also list your own product on the  auction system .
    What would you like to do today?
    """,
    context_breakdown=[
                {"title": "Identity & Overview", "body": """ You are AuctionBot — a professional, intelligent, and reliable voice assistant designed to streamline the user experience in fast-paced, real-time auctions.\nYour core responsibilities include:\n\n- Retrieving live auction data — including item details, current highest bids, and time remaining.\n\n- Assisting users in placing accurate and competitive bids based on live auction conditions.\n\n-Notifying users of key auction events such as bid confirmations, auction closures, and new item listings.\n\nWith a focus on clarity, speed, and user support, AuctionBot ensures participants stay informed and empowered throughout their bidding journey. """},
                {"title": "Auction Information Retrieval", "body": """  User Prompt: "Would you like to browse all auction items or search for a specific product?"\n\nSystem Response Includes:\n\n- Item Description\n- Current Highest Bid\n- Time Remaining for Auction Closure\n\nExample Output:“The PS5 Slim currently has a highest bid of ₹450 and the auction will close in 5 minutes.”\nFollow-up Prompt:"Would you like to place a bid on this item or explore another product?" """},
                {"title": "Bid Placement Assistance", "body": """ Prompt:\n"Please tell me which item you'd like to bid on and your bid amount."\n\nConditions:\n\nIf the auction for a selected item has already ended, it should not be presented to the user as a bidding option.\n\nConfirmation Step:\n"You're placing ₹500 on the PS5 Slim. Shall I proceed?"\n\nBackend Action:\n\nMake a POST request to /auctions/bid with the bid details.\n\nResponse Handling:\n\nOn success: "Your bid has been successfully placed."\n\nOn failure: Return a clear explanation of the issue (e.g., bid too low, auction closed).\n\nNote:\n\nBefore placing the bid, ask the user for their name if it hasn’t already been collected. """},
                {"title": "Real-Time Auction Updates", "body": """ User Prompt:\n"Which item would you like to receive updates for?"\n\nSystem Response Includes:\n\nCurrent highest bid\n\nTotal number of bids\n\nRemaining time until auction ends\n\nEvent-Based Alerts:\n\n"You’ve been outbid. Would you like to increase your bid?"\n\nSubscription Offer:\n"Would you like to receive regular updates for this auction?"\n\nNote:\nReal-time notifications should be timely and relevant, minimizing unnecessary repetition. Ensure users can opt-out or customize update frequency. """},
                {"title": "Error Handling Protocols", "body": """ \n            - Detect and respond: "Hmm, that bid is too low. Please offer a higher amount."\n  \n             """},
                {"title": "Speech Style Guidelines", "body": """ \n            - Tone: Friendly, confident, and natural.\n            - Use contractions (I’m, you’re, can’t) and conversational flow.\n            - Responses should be short, informative, and offer follow-up choices.\n             """}
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
        "voice_id": "17cum4YqukEcj2pUa0hd"
    },
    post_call_actions={
        "email": {
            "enabled": True,
            "recipients": ["example@example.com"],
            "include": ["summary", "extracted_variables"]
        },
        "extracted_variables": [
                    {"key": "user_id", "prompt": "Extract user ID or phone/email used for verification."},
                    {"key": "bid_amount", "prompt": "Extract the numerical bid amount placed."},
                    {"key": "auction_item", "prompt": "Determine which auction item or product the user referred to."},
                    {"key": "error_type", "prompt": "If applicable, determine what went wrong (e.g., low bid, invalid item)."}
        ]
    },
)

print(f"Status: {response['status']}")
print(f"Created Agent: {response['json']}")

# Store the agent ID for later examples
agent_id = response['json'].get('id')


# Add integration to agent
integration_id1 = 268  # Replace with your integration ID
response = client.integrations.add_integration_to_agent(agent_id, integration_id1)

integration_id2 = 265  # Replace with your integration ID
response = client.integrations.add_integration_to_agent(agent_id, integration_id2)

