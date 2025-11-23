import requests
import base64

with open("image.jpg", "rb") as img_file:
    img_base64 = "data:image/jpeg;base64," + base64.b64encode(img_file.read()).decode("utf-8")

data = { "image": img_base64 }

response = requests.post("http://127.0.0.1:5000/caption", json=data)
print(response.json())
