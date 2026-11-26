"""The language-model half of the capstone as a service: one endpoint that answers a question from the corpus with its sources, and one that says
whether the models are loaded.

    uv run uvicorn reference.serve_llm:app --port 8020        (from the llm/ folder)

`create_app` takes the function that loads the system, so a test can pass a small stand-in and never load a model.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field


class Question(BaseModel):
    """One question: a short text, and nothing else."""

    model_config = ConfigDict(extra="forbid")

    question: str = Field(min_length=3, max_length=300)


class Source(BaseModel):
    lesson: str
    section: str
    text: str


class Reply(BaseModel):
    answer: str | None
    refused: bool
    sources: list[Source]
    prompt_tokens: int
    completion_tokens: int
    seconds: float


def create_app(load):
    """The service around a system that has `answer(question)` and `chunks`; `load()` builds it once, when the service starts."""

    @asynccontextmanager
    async def lifespan(app):
        app.state.system = load()
        yield

    app = FastAPI(title="sql-answerer", lifespan=lifespan)

    def ready_system(request: Request):
        if request.app.state.system is None:
            raise HTTPException(status_code=503, detail="system not loaded")
        return request.app.state.system

    @app.get("/health")
    def health(request: Request):
        ready_system(request)
        return {"status": "ok"}

    @app.post("/ask", response_model=Reply)
    def ask(body: Question, request: Request):
        system = ready_system(request)
        result = system.answer(body.question)
        cited = [Source(lesson=system.chunks[result["found"][n - 1][1]][0], section=system.chunks[result["found"][n - 1][1]][1],
                        text=system.chunks[result["found"][n - 1][1]][2]) for n in result["sources"] if result["valid"]]
        return Reply(answer=result["answer"], refused=result["answer"] is None, sources=cited, prompt_tokens=result["prompt_tokens"],
                     completion_tokens=result["completion_tokens"], seconds=result["seconds"])

    return app


def load_real_system():
    from rag import System  # imported here, so that a test of the service never imports torch

    return System()


app = create_app(load_real_system)
