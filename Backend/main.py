from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import traceback
from langchain_core.messages import HumanMessage, ToolMessage
from agent import agent_executor

app = FastAPI()

# Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # 1. Prepare the message
        inputs = {"messages": [HumanMessage(content=request.message)]}
        config = {"configurable": {"thread_id": "1"}}
        
        # 2. Run the AI Agent
        response = agent_executor.invoke(inputs, config)
        messages = response["messages"]
        
        # 3. Extract the final text reply
        ai_reply = messages[-1].content
        form_data = None
        
        # 4. Check if the AI used our special Form-Filling tools
        for msg in messages:
            if isinstance(msg, ToolMessage):
                try:
                    tool_data = json.loads(msg.content)
                    if isinstance(tool_data, dict) and tool_data.get("action") in ["FILL_FORM", "EDIT_FORM"]:
                        form_data = tool_data
                except:
                    pass

        return {
            "reply": ai_reply,
            "form_update": form_data 
        }

    except Exception as e:
        # 🚨 IF PYTHON CRASHES, IT WILL PRINT HERE AND SEND TO REACT 🚨
        print("\n" + "="*50)
        print("💥 BACKEND CRASH DETECTED!")
        traceback.print_exc()
        print("="*50 + "\n")
        
        # We return a successful HTTP code so CORS doesn't block the error message!
        return {
            "reply": f"SYSTEM ERROR: {str(e)}. Please check your Python terminal for the exact line number.",
            "form_update": None
        }