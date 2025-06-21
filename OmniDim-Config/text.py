response = client.call.create(
    agent_id="your_agent_id_here",
    phone_number="+1234567890",  # or any other identifier for the user
    metadata={}  # optional additional data
)
print(response)
