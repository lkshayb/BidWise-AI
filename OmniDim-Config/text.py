import requests

url = "http://localhost:5001"  # use localhost if running locally
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "input": "What's the latest bid on the PS5 Slim?",
    "user_id": "user123"
}

response = requests.post(url, headers=headers, json=data)
print("🤖 Agent says:", response.json())
