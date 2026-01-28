import urllib.request
import json

url = "http://localhost:5000/generate"
payload = {
    "prompt": "Write a login function that takes username and password."
}
data = json.dumps(payload).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={
    'Content-Type': 'application/json'
})

try:
    print("Sending request to http://localhost:5000/generate...")
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        result = json.loads(response.read().decode('utf-8'))
        print("Response:")
        print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
