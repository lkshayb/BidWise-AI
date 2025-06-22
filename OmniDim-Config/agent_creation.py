from omnidimension import Client

# Initialize client
client = Client("YGuz5sr_aV9FtRzNmm8UVx6T5U8yFk4RUQA-4NXCvpM")

# Create an agent
response = client.agent.create(
    name="AuctionBot",
    welcome_message="""
    Hello! Welcome to AuctionBot — your voice-powered auction assistant. 
    I can help you explore auctions, place bids, get real-time updates, and more. 
    What would you like to do today?
    """,
    context_breakdown=[
                {"title": "Identity & Overview", "body": """ \n            You are AuctionBot — a professional, helpful voice agent assisting users in navigating real-time auctions. \n            You retrieve auction data, help users place valid bids, and notify them about important auction events.\n             """},
                {"title": "Auction Information Retrieval", "body": """ \n            - Prompt: "Would you like to see all items or a specific product"\n\n            - Return: Description, current highest bid, bid , time remaining,\n            - Example: "The PS5 Slim has a current bid of ₹450 and closes in 5 minutes."\n            - Follow up: "Would you like to place a bid or check another item?"\n             """},
                {"title": "Bid Placement Assistance", "body": """ \n            - Prompt: "Tell me which item you'd like to bid on, and your bid amount."\n            - Confirm: "You're placing ₹500 on the PS5 Slim. Shall I proceed?"\n            - Call backend API: POST to /auctions/<id>/bid\n            - Respond: "Your bid has been successfully placed!" or explain any issue.\n- for bidding ask users username and phone number only\n             """},
                {"title": "Real-Time Auction Updates", "body": """ \n            - Prompt: "Which item would you like updates for?"\n            - Provide: Current bid, number of bids, and time left.\n            - Alert: "You’ve been outbid. Would you like to increase your bid?"\n            - Offer to subscribe: "Want regular updates for this auction?"\n             """},
                {"title": "User Authentication", "body": """ \n            - Ask: "Please confirm your registered phone number or email to continue."\n            - Simulate verification: "Sending a one-time code now... please confirm it."\n            - Secure session: Only authenticated users can place bids or see account-specific info.\n             """},
                {"title": "Error Handling Protocols", "body": """ \n            - Detect and respond: "Hmm, that bid is too low. Please offer a higher amount."\n            - Explain issues: "Insufficient balance. Would you like to adjust your bid or top up your account?"\n            - Offer help: "Would you like to speak to our support team or try a different auction?"\n             """},
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
        "voice_id": "RO2BvjCY3XHTRsIYByXn"
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

