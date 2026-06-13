from hindsight_client import Hindsight
from dotenv import load_dotenv
import os

load_dotenv()

client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

incidents = [

"""
INC-101
Database Connection Pool Exhausted

Root Cause:
Pool size too low

Fix:
Increase pool size to 50

Failed Attempt:
Scaling Kubernetes pods

Customer Message:
Users experienced login delays.
""",

"""
INC-102
AWS Credentials Expired

Root Cause:
IAM credentials expired

Fix:
Rotate credentials

Failed Attempt:
Restart containers

Customer Message:
Authentication service disruption.
""",

"""
INC-103
Stripe Webhook Timeout

Root Cause:
Webhook timeout too low

Fix:
Increase timeout to 30 seconds

Failed Attempt:
Retrying payments

Customer Message:
Payment confirmations delayed.
""",

"""
INC-104
Redis Memory Limit Exceeded

Root Cause:
Redis maxmemory reached

Fix:
Increase memory allocation

Failed Attempt:
Restart Redis

Customer Message:
Slow page loading experienced.
""",

"""
INC-105
JWT Secret Missing

Root Cause:
Environment variable missing

Fix:
Add JWT_SECRET

Failed Attempt:
Restarting services

Customer Message:
Users unable to log in.
""",

"""
INC-106
Kubernetes CrashLoopBackOff

Root Cause:
Invalid application config

Fix:
Rollback deployment

Failed Attempt:
Adding more replicas

Customer Message:
Temporary service disruption.
""",

"""
INC-107
Kafka Consumer Lag

Root Cause:
Consumer throughput too low

Fix:
Scale consumer group

Failed Attempt:
Restart brokers

Customer Message:
Notifications delayed.
""",

"""
INC-108
DNS Resolution Failure

Root Cause:
Misconfigured DNS records

Fix:
Correct DNS entries

Failed Attempt:
Restarting applications

Customer Message:
Some services unavailable.
"""
]

for incident in incidents:
    client.retain(
        bank_id=os.getenv("BANK_ID"),
        content=incident
    )

print("All incidents stored.")