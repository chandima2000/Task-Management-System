import json
import re
import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from task_agent.agent import root_agent

app = FastAPI(title="Task Intelligence Agent")

# Add CORS Middleware to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Session Service
session_service = InMemorySessionService()
APP_NAME = "task_intelligence_agent"

print("--- AI Agent Starting on port 8080 ---")

class TaskInput(BaseModel):
    title: str
    description: Optional[str] = None

class SubTask(BaseModel):
    title: str
    description: Optional[str] = None

class BreakdownResponse(BaseModel):
    subtasks: List[SubTask]

import time

@app.post("/breakdown", response_model=BreakdownResponse)
async def breakdown_task(task: TaskInput):
    print(f"\n--- NEW BREAKDOWN REQUEST: {task.title} ---")
    prompt = f"Objective: {task.title}\nContext: {task.description or 'No extra context.'}"
    user_id = "default_user"
    # Create a unique session ID for every request to avoid state conflicts
    session_id = f"session_{int(time.time())}"
    
    try:
        # 1. Create/Retrieve Session
        print(f"Creating session: {session_id}")
        await session_service.create_session(app_name=APP_NAME, user_id=user_id, session_id=session_id)
        
        # 2. Initialize Runner
        print("Initializing Runner...")
        runner = Runner(agent=root_agent, app_name=APP_NAME, session_service=session_service)
        
        # 3. Create Content
        new_message = types.Content(role="user", parts=[types.Part(text=prompt)])
        
        # 4. Run Agent
        print("Running agent async...")
        events = runner.run_async(user_id=user_id, session_id=session_id, new_message=new_message)
        
        final_response = ""
        async for event in events:
            # print(f"Event received: {type(event).__name__}") # Debugging
            if hasattr(event, "is_final_response") and event.is_final_response():
                final_response = event.content.parts[0].text
                print("Final response captured!")
        
        if not final_response:
            print("WARNING: No final response found in stream.")
            raise Exception("Agent did not return a final response")

        # 5. Parse and Clean response
        content = final_response.strip()
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            content = json_match.group()
        else:
            print("No JSON found in agent response, attempting direct parse...")
            
        return json.loads(content)
            
    except Exception as e:
        print(f"Agent logic failed: {e}")
        
        # Return a fallback list if logic fails
        return {
            "subtasks": [
                {"title": "Step 1: Planning", "description": "Define requirements"},
                {"title": "Step 2: Execution", "description": "Start working"}
            ]
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    print(f"--- AI Agent Starting on port {port} ---")
    uvicorn.run(app, host="0.0.0.0", port=port)
