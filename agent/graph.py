from dotenv import load_dotenv
from langchain_core.globals import set_verbose, set_debug
from langchain_groq.chat_models import ChatGroq
from langgraph.constants import END
from langgraph.graph import StateGraph
from langgraph.prebuilt import create_react_agent

from agent.prompts import *
from agent.states import *
from agent.tools import write_file, read_file, get_current_directory, list_files

_ = load_dotenv()

set_debug(True)
set_verbose(True)

from langchain_nvidia_ai_endpoints import ChatNVIDIA

llm  = ChatNVIDIA(
  model="z-ai/glm4.7",
  api_key="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", 
  temperature=0.5,
  top_p=1,
  max_tokens=16384,
  #extra_body={"chat_template_kwargs":{"enable_thinking":False,"clear_thinking":False}},
)
#llm = ChatGroq(model="openai/gpt-oss-120b")


def planner_agent(state: dict) -> dict:
    """Converts user prompt into a structured Plan."""
    user_prompt = state["user_prompt"]
    resp = llm.with_structured_output(Plan).invoke(
        planner_prompt(user_prompt)
    )
    if resp is None:
        raise ValueError("Planner did not return a valid response.")
    return {"plan": resp}


def scaffold_agent(state: dict) -> dict:
    """Detects and runs scaffold_command from the Planner if it exists."""
    plan: Plan = state["plan"]
    
    from agent.tools import PROJECT_ROOT, run_cmd
    import shutil
    import os

    # Empy project root if it exists to avoid npx conflict
    if PROJECT_ROOT.exists():
        for item in os.listdir(PROJECT_ROOT):
            item_path = PROJECT_ROOT / item
            if item_path.is_file() or item_path.is_symlink():
                os.remove(item_path)
            elif item_path.is_dir():
                shutil.rmtree(item_path)
    PROJECT_ROOT.mkdir(parents=True, exist_ok=True)

    if plan.scaffold_command:
        print(f"🚀 Running scaffold command: {plan.scaffold_command}")
        code, out, err = run_cmd.invoke({"cmd": plan.scaffold_command, "cwd": str(PROJECT_ROOT), "timeout": 120})
        if code != 0:
            print(f"⚠️ Scaffold command failed with exit code {code}.")
            print(f"Error output: {err}")
        else:
            print("✅ Scaffold command completed successfully.")
    
    return state


def architect_agent(state: dict) -> dict:
    """Creates TaskPlan from Plan."""
    plan: Plan = state["plan"]
    resp = llm.with_structured_output(TaskPlan).invoke(
        architect_prompt(plan=plan.model_dump_json())
    )
    if resp is None:
        raise ValueError("Planner did not return a valid response.")

    resp.plan = plan
    print(resp.model_dump_json())
    return {"task_plan": resp}


def coder_agent(state: dict) -> dict:
    """LangGraph direct coder agent."""
    coder_state: CoderState = state.get("coder_state")
    if coder_state is None:
        coder_state = CoderState(task_plan=state["task_plan"], current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx >= len(steps):
        return {"coder_state": coder_state, "status": "DONE"}

    current_task = steps[coder_state.current_step_idx]
    
    # Check if the file already has some content
    existing_content = read_file.invoke({"path": current_task.filepath})

    from agent.tools import PROJECT_ROOT

    # Gather the context of ALL files generated so far
    project_context = ""
    if PROJECT_ROOT.exists():
        for file_path in PROJECT_ROOT.rglob("*"):
            if file_path.is_file():
                try:
                    content = file_path.read_text(encoding="utf-8")
                    rel_path = file_path.relative_to(PROJECT_ROOT)
                    project_context += f"\n--- {rel_path} ---\n{content}\n"
                except Exception:
                    pass

    system_prompt = coder_system_prompt()
    user_prompt = (
        f"You are writing code for this specific task:\n"
        f"Task: {current_task.task_description}\n"
        f"File to write: {current_task.filepath}\n\n"
        f"Context of files already generated in the project:\n"
        f"{project_context}\n\n"
        "Provide ONE final complete file content matching exactly what belongs in the specified file. DO NOT include markdown code blocks or explanations."
    )

    print(f"-> Generating complete code for {current_task.filepath}...")
    try:
        resp = llm.with_structured_output(FileContent).invoke(
            [("system", system_prompt), ("user", user_prompt)]
        )

        
        if resp and resp.content:
            write_file.invoke({"path": current_task.filepath, "content": resp.content})
            print(f"✅ Successfully wrote to {current_task.filepath}")
        else:
            print(f"⚠️ Failed to generate content for {current_task.filepath}")
            
    except Exception as e:
        print(f"❌ Error during generation for {current_task.filepath}: {e}")

    coder_state.current_step_idx += 1
    return {"coder_state": coder_state}


graph = StateGraph(dict)

graph.add_node("planner", planner_agent)
graph.add_node("scaffold", scaffold_agent)
graph.add_node("architect", architect_agent)
graph.add_node("coder", coder_agent)

graph.add_edge("planner", "scaffold")
graph.add_edge("scaffold", "architect")
graph.add_edge("architect", "coder")
graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.get("status") == "DONE" else "coder",
    {"END": END, "coder": "coder"}
)

graph.set_entry_point("planner")
agent = graph.compile()

if __name__ == "__main__":
    prompt = input("Describe the app you want to create: ")
    result = agent.invoke({"user_prompt": prompt},
                          {"recursion_limit": 100})
    print("Final State:", result)