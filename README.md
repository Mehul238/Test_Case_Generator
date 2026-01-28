
# Magic Testcase Generator

## Overview
A local, privacy-focused tool that uses a local LLM (Ollama + Llama 3.2) to generate comprehensive QA test cases from feature descriptions or code snippets.

## Features
- **Local AI**: 100% private, runs offline using Ollama.
- **Magic UI**: Premium dark mode with nebula animations and glassmorphism.
- **Session Management**: Save and switch between multiple test generation sessions.
- **Smart Logic**: Conversational awareness (responds to "Hi") vs. strict table generation for testing tasks.
- **Export**: Generates clean Markdown tables ready for copy-pasting.

## Prerequisites
1. **Ollama**: Download and install from [ollama.com](https://ollama.com).
2. **Model**: Pull the model:
   ```bash
   ollama pull llama3.2
   ```
3. **Python 3.10+**

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mehul238/Test_Case_Generator.git
   ```
2. Navigate to directory:
   ```bash
   cd Test_Case_Generator
   ```
3. Set up environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   pip install flask ollama
   ```

## Usage

Run the easy start script:
```bash
.\run_app.bat
```

Or manually:
```bash
python -m app.main
```

Open your browser at `http://localhost:5000`.

## License
MIT
