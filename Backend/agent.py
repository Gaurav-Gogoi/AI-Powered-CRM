import os
import json
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver 
from database import SessionLocal, Interaction


load_dotenv()


# TOOL 1: Log Interaction 
@tool
def log_interaction(hcp_name: str, sentiment: str, notes: str, interaction_type: str = "Meeting"):
    """Use this to extract details when the user logs a new interaction."""
    db = SessionLocal()
    new_log = Interaction(hcp_name=hcp_name, sentiment=sentiment, notes=notes, interaction_type=interaction_type)
    db.add(new_log)
    db.commit()
    db.close()
    
    # We return a JSON string so our FastAPI server can intercept it and send it to React
    return json.dumps({
        "action": "FILL_FORM",
        "data": {"hcp_name": hcp_name, "sentiment": sentiment, "notes": notes, "interaction_type": interaction_type}
    })

# TOOL 2: Edit Interaction 
# updates sepcific fields and tells frontend what to change
@tool
def edit_interaction(field: str, new_value: str):
    """Use this when the user corrects a mistake. field should be 'hcp_name', 'sentiment', or 'notes'."""
    return json.dumps({
        "action": "EDIT_FORM",
        "field": field,
        "value": new_value
    })

# TOOL 3: Search
@tool
def search_hcp(name: str):
    """Searches for an HCP."""
    return f"Found Dr. {name} in the database. They are a Cardiologist."

# TOOL 4: Get Product
@tool
def get_product_info(product_name: str):
    """Gets info about a medical product."""
    return f"{product_name} is highly effective with minor side effects."

# TOOL 5: Schedule
@tool
def schedule_follow_up(date: str):
    """Schedules a follow up."""
    return f"Follow up scheduled for {date}."

tools = [log_interaction, edit_interaction, search_hcp, get_product_info, schedule_follow_up]
# this is the brain llm model
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

# 2. ADDED MEMORY SAVER HERE
memory = MemorySaver()

# 3. ADDED checkpointer=memory HERE
agent_executor = create_react_agent(llm, tools, checkpointer=memory)