"""The service of the LLM half, called as a client calls it, with a stand-in for the system: no model is loaded."""

from fastapi.testclient import TestClient

from reference.serve_llm import create_app


class Stand:
    """A system with one chunk and a fixed reply."""

    chunks = [("ctes", "A CTE gives one step of a query a name", "A CTE (common table expression) gives one step of a query a name.")]

    def answer(self, question):
        if "recursive" in question:
            return {"answer": None, "sources": [], "valid": True, "found": [(0.1, 0)], "prompt_tokens": 0, "completion_tokens": 0, "seconds": 0.0}
        return {"answer": "A name for one step.", "sources": [1], "valid": True, "found": [(0.9, 0)], "prompt_tokens": 120, "completion_tokens": 8, "seconds": 1.5}


def test_a_question_gets_an_answer_with_its_source():
    with TestClient(create_app(Stand)) as client:
        reply = client.post("/ask", json={"question": "What is a CTE?"}).json()
    assert reply["answer"] == "A name for one step."
    assert reply["sources"][0]["lesson"] == "ctes" and reply["refused"] is False


def test_a_question_the_corpus_cannot_answer_is_refused_not_invented():
    with TestClient(create_app(Stand)) as client:
        reply = client.post("/ask", json={"question": "How do I write a recursive query?"}).json()
    assert reply["answer"] is None and reply["refused"] is True and reply["sources"] == []


def test_a_bad_request_is_refused_at_the_door():
    with TestClient(create_app(Stand)) as client:
        assert client.post("/ask", json={"question": ""}).status_code == 422
        assert client.post("/ask", json={"question": "x" * 301}).status_code == 422
        assert client.post("/ask", json={"question": "What is a CTE?", "model": "big"}).status_code == 422


def test_without_a_system_the_service_is_up_but_not_ready():
    with TestClient(create_app(lambda: None)) as client:
        assert client.get("/health").status_code == 503
        assert client.post("/ask", json={"question": "What is a CTE?"}).status_code == 503
