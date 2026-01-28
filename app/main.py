from flask import Flask, request, jsonify, render_template
from app.ollama_client import client
import time

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "active", "service": "Test Case Generator API"})

@app.route('/')
def index():
    """Serve the Chat UI."""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """
    Endpoint to generate test cases.
    Expected JSON payload:
    {
        "prompt": "User input description",
        "model": "llama3.2" (optional)
    }
    """
    data = request.get_json()
    
    if not data or 'prompt' not in data:
        return jsonify({"status": "error", "message": "Missing 'prompt' in payload"}), 400
    
    user_prompt = data['prompt']
    model = data.get('model', 'llama3.2')
    
    # Update client model if requested (simplification for this phase)
    if model != client.model:
        client.model = model

    start_time = time.time()
    result = client.generate_test_cases(user_prompt)
    duration = (time.time() - start_time) * 1000  # ms

    if "error" in result:
        return jsonify({
            "status": "error",
            "message": result["error"]
        }), 500

    response_payload = {
        "status": "success",
        "data": {
            "test_cases": result["content"],
            "raw_response": result["content"] # In this simple case, they are same
        },
        "metadata": {
            "model_used": result["model"],
            "generation_time_ms": round(duration, 2)
        }
    }

    return jsonify(response_payload)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
