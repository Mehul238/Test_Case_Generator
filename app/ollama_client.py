import ollama
import logging
from app.prompt_templates import DEFAULT_TEMPLATE

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, model="llama3.2"):
        self.model = model

    def check_connection(self):
        """Checks if Ollama is reachable."""
        try:
            # Simple list command to check connectivity
            ollama.list()
            logger.info("Ollama connection successful.")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Ollama: {e}")
            return False

    def generate_test_cases(self, user_input, template_type="default"):
        """
        Generates test cases using the specified model and prompt.
        """
        if not self.check_connection():
            return {"error": "Ollama service is not reachable. Is it running?"}

        prompt = DEFAULT_TEMPLATE.format(user_input=user_input)

        try:
            logger.info(f"Sending request to Ollama with model {self.model}...")
            response = ollama.chat(model=self.model, messages=[
                {
                    'role': 'user',
                    'content': prompt,
                },
            ])
            
            content = response['message']['content']
            logger.info("Generation successful.")
            
            return {
                "content": content,
                "model": self.model
            }
            
        except Exception as e:
            logger.error(f"Error during generation: {e}")
            return {"error": str(e)}

# Singleton instance for easy import
client = OllamaClient()
