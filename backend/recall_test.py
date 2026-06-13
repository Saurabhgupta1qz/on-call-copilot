from hindsight_client import Hindsight
from dotenv import load_dotenv
import os

load_dotenv()

client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

results = client.recall(
    bank_id=os.getenv("BANK_ID"),
    query="connection pool exhausted during traffic spike"
)

print(results)