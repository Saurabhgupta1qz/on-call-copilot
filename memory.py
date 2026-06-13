from hindsight_client import Hindsight
from dotenv import load_dotenv
import os

load_dotenv()

client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

def store_incident(content):
    client.retain(
        bank_id=os.getenv("BANK_ID"),
        content=content
    )