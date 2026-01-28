# Project Constitution

## Data Schemas

### Payload: Test Case Generation
**Input (Frontend -> Backend)**
```json
{
  "prompt": "User's description of feature or code snippet",
  "model": "llama3.2",
  "template_type": "default" // Optional, for future use
}
```

**Output (Backend -> Frontend)**
```json
{
  "status": "success", 
  "data": {
    "test_cases": "Markdown formatted test cases...",
    "raw_response": "Full response from Ollama"
  },
  "metadata": {
    "model_used": "llama3.2",
    "generation_time_ms": 1200
  }
}
```

## Behavioral Rules
- **Reliability First**: Ensure the LLM connection is checked before generation.
- **Deterministic Output**: Use specific prompt templates to ensure consistent test case formats.
- **User Feedback**: Immediate visual feedback in UI when generation is in progress.

## Maintenance Log
- **Version 1.0.0**: Initial Release
    - Local LLM Integration (Ollama)
    - Session Management (Local Storage)
    - Nebula Theme UI
    - Test Case Table Formatting
    - GitHub Repo Linked: `https://github.com/Mehul238/Test_Case_Generator.git`
