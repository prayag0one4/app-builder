# 🤖 AI App Builder

An autonomous, multi-agent AI tool that plans, scaffolds, and codes entire software projects from just a single prompt. Powered by **LangGraph** and state-of-the-art **NVIDIA LLMs**, it is structured to simulate a real engineering workflow.

## 🌟 How It Works

This tool avoids the common pitfalls of standard code-generation by utilizing a specialized, multi-stage architecture:

1. **Planner Agent**: Generates an exhaustive structural file plan and tech-stack requirements based on your initial prompt.
2. **Scaffold Agent**: Halts isolated execution to natively boot up modern package boilerplates (e.g., executing `npx create-vite . --template react`) dynamically if you request a framework.
3. **Architect Agent**: Dissects the bootstrapped boilerplate and plans exact, step-by-step engineering tasks to modify and build your logic.
4. **Coder Agent**: Executes each task systematically, armed with localized file-reading and the complete context of everything generated so far, ensuring perfect variable mapping and DOM integration.

## 🚀 Setup & Installation

### Prerequisites
- Python 3.10+
- `Node.js` and `npm` (if you plan on generating heavy frontend frameworks like React/Next.js)

### 1. Install Dependencies
This project uses `uv` (or standard `pip` with `pyproject.toml`) for dependency management:
```bash
pip install -r pyproject.toml 
# OR
uv sync
```

### 2. Configure Environment Tokens
Create a `.env` file in the root of the project to hold your API keys securely. (Note: Make sure your `.env` is added to your `.gitignore`). By default, the code executes using `ChatNVIDIA`.

```env
NVIDIA_API_KEY="your_nvidia_api_key_here"
```
*(If extending for Anthropic, Groq, or OpenAI models later, you can add those variables here as well).*

## 📖 Usage

Run the main execution script from your terminal:

```bash
python main.py
```

The tool will present you with an interactive prompt CLI:
```text
Enter your project prompt: Build a colorful dark-theme Pomodoro timer using React and standard CSS...
```

### The Output
Your newly generated project code will be output securely to the `generated_project/` folder at the root of the directory.

If you generated a JavaScript/Node application, simply `cd` into the directory and launch it natively:
```bash
cd generated_project
npm install
npm start
```

## 🧠 Architecture Stack
* **Graph Orchestration:** LangGraph (StateGraph)
* **LLM Engine:** LangChain (`ChatNVIDIA` with Nemotron/GLM support)
* **Data Validations:** Pydantic `with_structured_output` for zero markdown-hallucination.

---
*Built with LangGraph & Python.*
