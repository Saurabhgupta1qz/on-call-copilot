from groq import Groq
from hindsight_client import Hindsight
from dotenv import load_dotenv
import os

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

memory_client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=os.getenv("HINDSIGHT_API_KEY")
)


def analyze_incident(incident):

    memories = memory_client.recall(
        bank_id=os.getenv("BANK_ID"),
        query=incident
    )

    prompt = f"""
You are a Senior Site Reliability Engineer.

Current Incident:
{incident}

Historical Incident Knowledge:
{memories}

Using the historical incident knowledge, provide ONLY the following sections.

## Root Cause
- Maximum 2 sentences

## Recommended Fix
- Exactly 3 bullet points

## Avoid
- Exactly 2 bullet points

## Customer Update
- Maximum 50 words
- Plain English
- No technical jargon

Keep the response concise and suitable for an incident dashboard.
"""

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content