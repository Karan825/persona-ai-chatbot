from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from langchain_groq import ChatGroq
from typing import List
from langchain_core.messages import HumanMessage, AIMessage, ChatMessage
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate,ChatPromptTemplate, FewShotChatMessagePromptTemplate
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from helper import ChatBot, PERSONAS  # put ChatBot + PERSONAS here

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

CHAT_SESSIONS = {}

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


class ChatRequest(BaseModel):
    persona_id: str
    message: str


@app.post("/chat")
async def chat(req: ChatRequest):
    persona_id = req.persona_id

    if persona_id not in PERSONAS:
        return {"reply": "Persona not found", "persona_name": "System"}

    # create chatbot if not exists
    if persona_id not in CHAT_SESSIONS:
        CHAT_SESSIONS[persona_id] = ChatBot(PERSONAS[persona_id])

    bot = CHAT_SESSIONS[persona_id]

    reply = bot.invoke(req.message)

    return {
        "reply": reply,
        "persona_name": bot.name
    }
