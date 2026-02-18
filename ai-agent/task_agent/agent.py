import os
from dotenv import load_dotenv

from google.adk.agents.llm_agent import Agent


# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))
# Load the .env from the same directory as agent.py
load_dotenv(os.path.join(current_dir, ".env"))


root_agent = Agent(
    model="gemini-2.5-flash",
    name="project_planner",
    description="Breaks down a task into subtasks",
    instruction=(
        "You are an expert project planner. Given a task title and description, "
        "break it down into 3-5 logical, actionable sub-tasks. "
        "Return ONLY a JSON object with a 'subtasks' key containing the list of sub-tasks. "
        "Example: {'subtasks': [{'title': 'Subtask 1', 'description': 'desc'}, ...]}"
    )
)
