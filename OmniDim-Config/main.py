import os
from omnidimension import Client

# Initialize with default production URL
api_key = os.environ.get('OMNIDIM_API_KEY', 'YGuz5sr_aV9FtRzNmm8UVx6T5U8yFk4RUQA-4NXCvpM')
client = Client("YGuz5sr_aV9FtRzNmm8UVx6T5U8yFk4RUQA-4NXCvpM")



# Get all integrations for a specific agent
agent_id = 1518  # Replace with your agent ID
response = client.integrations.get_agent_integrations(agent_id)
print(response)

# Create a custom API integration
