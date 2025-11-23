from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Load the pretrained BLIP model (auto downloads)
MODEL_NAME = "Salesforce/blip-image-captioning-base"
processor = BlipProcessor.from_pretrained(MODEL_NAME)
model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME)

@app.route('/caption', methods=['POST'])
def caption_image():
    try:
        data = request.json
        base64_img = data['image']
        image_bytes = base64.b64decode(base64_img.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        inputs = processor(image, return_tensors='pt')
        output = model.generate(**inputs)
        caption = processor.decode(output[0], skip_special_tokens=True)

        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
