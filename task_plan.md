# Task Plan

## Phases
- [x] Phase 1: Initialization & Planning
- [x] Phase 2: Architecture & Setup
    - [x] Initialize Python environment (venv)
    - [x] Install dependencies (flask, ollama)
    - [x] Create directory structure (app/static, app/templates, tests)
- [x] Phase 3: Implementation - Core Logic (Backend)
    - [x] Implement `ollama_client.py` wrapper
    - [x] Create `prompt_templates.py`
    - [x] Build Flask API endpoint `/generate`
- [x] Phase 4: Implementation - UI (Frontend)
    - [x] Create `index.html` (Chat Layout)
    - [x] Implement `script.js` (Fetch API logic)
    - [x] Style with `style.css` (Premium aesthetics)
- [x] Phase 5: Testing & Refinement
    - [x] Validate standard outputs
    - [x] Edge case handling (Ollama not running)

## Goals
- Build a local LLM Testcase generator using Ollama.
- Ensure deterministic and reliable output.
