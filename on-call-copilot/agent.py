import os
import json
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Load environment variables from .env file
load_dotenv()

class ResilientHindsight:
    def __init__(self):
        self.api_key = os.getenv("HINDSIGHT_API_KEY")
        self.bank_id = os.getenv("HINDSIGHT_BANK_ID", "on_call_copilot_bank")
        self.base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
        self.use_fallback = False
        self.client = None
        
        is_placeholder = lambda x: not x or "your_" in x.lower() or x == ""
        
        if is_placeholder(self.api_key) or is_placeholder(self.bank_id):
            logging.warning("Hindsight credentials not configured. Using local JSON fallback database.")
            self.use_fallback = True
        else:
            try:
                # Try importing from hindsight_sdk first, then fallback to hindsight / hindsight_client
                try:
                    from hindsight_sdk import HindsightClient
                    self.client = HindsightClient(base_url=self.base_url, api_key=self.api_key)
                except ImportError:
                    try:
                        from hindsight import HindsightClient
                        self.client = HindsightClient(base_url=self.base_url, api_key=self.api_key)
                    except ImportError:
                        from hindsight_client import Hindsight
                        self.client = Hindsight(base_url=self.base_url, api_key=self.api_key)
                logging.info("Hindsight SDK initialized successfully.")
            except Exception as e:
                logging.error(f"Failed to initialize Hindsight SDK: {e}. Using local JSON fallback database.")
                self.use_fallback = True

        self.fallback_file = ".local_memories.json"
        if self.use_fallback:
            if not os.path.exists(self.fallback_file):
                with open(self.fallback_file, "w") as f:
                    json.dump([], f)

    def retain(self, content):
        # Always write to fallback as a local record, then write to Hindsight if configured
        try:
            memories = self._load_fallback()
            if content not in memories:
                memories.append(content)
                self._save_fallback(memories)
        except Exception as e:
            logging.error(f"Failed writing to local fallback cache: {e}")

        if self.use_fallback or not self.client:
            return True
        
        try:
            self.client.retain(bank_id=self.bank_id, content=content)
            return True
        except Exception as e:
            logging.error(f"Hindsight retain failed: {e}")
            return False

    def recall(self, query):
        if self.use_fallback or not self.client:
            return self._recall_fallback(query)
        
        try:
            results = self.client.recall(bank_id=self.bank_id, query=query)
            return results
        except Exception as e:
            logging.error(f"Hindsight recall failed: {e}. Falling back to local search.")
            return self._recall_fallback(query)

    def list_memories(self):
        memories = []
        if not self.use_fallback and self.client:
            try:
                if hasattr(self.client, "memories") and hasattr(self.client.memories, "list"):
                    res = self.client.memories.list(bank_id=self.bank_id)
                    for m in res:
                        text = getattr(m, "text", getattr(m, "content", str(m)))
                        memories.append(text)
                elif hasattr(self.client, "list_memories"):
                    res = self.client.list_memories(bank_id=self.bank_id)
                    for m in res:
                        text = getattr(m, "text", getattr(m, "content", str(m)))
                        memories.append(text)
            except Exception as e:
                logging.error(f"Hindsight list failed: {e}")
                
        # Merge with local fallback memories to guarantee we show cached and seeded data
        try:
            fallback_mems = self._load_fallback()
            for fm in fallback_mems:
                if fm not in memories:
                    memories.append(fm)
        except Exception as e:
            logging.error(f"Failed loading fallback memories: {e}")
            
        return memories

    def _recall_fallback(self, query):
        memories = self._load_fallback()
        scored = []
        query_terms = set(query.lower().split())
        for m in memories:
            m_lower = m.lower()
            matches = sum(2 if term in m_lower else 0 for term in query_terms)
            # Add substring matches
            for term in query_terms:
                if len(term) > 3 and term in m_lower:
                    matches += 1
            if matches > 0:
                scored.append((matches, m))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        
        class MockResult:
            def __init__(self, text):
                self.text = text
        class MockRecallResponse:
            def __init__(self, results):
                self.results = results
        
        return MockRecallResponse([MockResult(text) for _, text in scored[:3]])

    def _load_fallback(self):
        if not os.path.exists(self.fallback_file):
            return []
        try:
            with open(self.fallback_file, "r") as f:
                return json.load(f)
        except Exception as e:
            logging.error(f"Failed to read local fallback cache: {e}")
            return []

    def _save_fallback(self, memories):
        try:
            with open(self.fallback_file, "w") as f:
                json.dump(memories, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to save local fallback cache: {e}")


class ResilientGroq:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.use_mock = False
        self.client = None
        
        is_placeholder = lambda x: not x or "your_" in x.lower() or x == ""
        if is_placeholder(self.api_key):
            logging.warning("Groq API key not configured. Using mock responder.")
            self.use_mock = True
        else:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logging.error(f"Failed to initialize Groq client: {e}. Using mock responder.")
                self.use_mock = True

    def generate(self, system_prompt, user_prompt, model="openai/gpt-oss-120b"):
        if self.use_mock or not self.client:
            return self._mock_response(system_prompt, user_prompt)
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=model,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logging.error(f"Groq API call failed: {e}. Using mock responder.")
            return f"⚠️ **Note: Groq API call failed ({e}). Displaying local simulation response:**\n\n" + self._mock_response(system_prompt, user_prompt)

    def _mock_response(self, system_prompt, user_prompt):
        prompt_lower = user_prompt.lower()
        has_context = "context" in prompt_lower or "past incident" in prompt_lower or "matched" in prompt_lower
        
        if not has_context:
            if "pool" in prompt_lower or "connection" in prompt_lower or "exhaustion" in prompt_lower:
                return (
                    "### 🛠️ Generic Troubleshooting Steps (No Memory)\n\n"
                    "1. **Analyze Database Pool Metrics**: Check active/idle connections and maximum connection pool configurations.\n"
                    "2. **Check for Database CPU spikes**: Look at database performance charts or running processes.\n"
                    "3. **Investigate slow queries**: Enable slow query logs to trace unoptimized queries that consume active connections.\n"
                    "4. **Increase Connection Timeout**: Tweak pool settings (e.g. increase HikariCP connection timeout) to prevent abrupt thread terminations."
                )
            elif "dns" in prompt_lower or "resolution" in prompt_lower or "coredns" in prompt_lower:
                return (
                    "### 🛠️ Generic Troubleshooting Steps (No Memory)\n\n"
                    "1. **Verify internal DNS server health**: Run metrics checks on DNS pods (e.g. CoreDNS).\n"
                    "2. **Inspect resolver configuration**: Check host resolver configurations such as `/etc/resolv.conf`.\n"
                    "3. **Run local DNS lookups**: Use `dig` or `nslookup` inside target hosts to trace connection/resolution drop-offs.\n"
                    "4. **Analyze external forwarding**: Confirm if upstream DNS providers are accessible or blocked by security policies."
                )
            elif "disk" in prompt_lower or "full" in prompt_lower or "elasticsearch" in prompt_lower:
                return (
                    "### 🛠️ Generic Troubleshooting Steps (No Memory)\n\n"
                    "1. **Check server disk metrics**: Execute `df -h` to verify the partition state.\n"
                    "2. **Identify heavy folders**: Trace large storage consumers using `du -sh` in logging/data folders.\n"
                    "3. **Verify service write watermarks**: Check if the database/logging tool (e.g., Elasticsearch) has blocked indexing due to low space limits.\n"
                    "4. **Free storage or resize volume**: Clean logs, clear old archives, or trigger volume enlargement."
                )
            else:
                return (
                    "### 🛠️ Generic Troubleshooting Steps (No Memory)\n\n"
                    "1. **Inspect application logs**: Examine system stderr and stack traces to isolate exceptions.\n"
                    "2. **Verify resource utilization**: Check CPU, memory, and networking levels on the instance.\n"
                    "3. **Confirm port availability**: Check if target services are listening on designated ports.\n"
                    "4. **Examine recent deployments**: Review deployment logs to see if a recent roll-out introduced bugs."
                )
        else:
            # Context-based matching simulation
            if "connection pool" in prompt_lower or "hikaricp" in prompt_lower or "timeout" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: HikariCP Connection Pool Exhaustion (INC-001)\n\n"
                    "**Root Cause:**\n"
                    "HikariCP connection pool size was set to default 10, which was too low for 100+ concurrent requests. Active connections were held too long due to unoptimized queries.\n\n"
                    "**Fix That Worked:**\n"
                    "Increased pool size to 50, added database read replica, and optimized query indexes on the users table.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not increase database CPU/RAM without changing the connection pool size; it will not resolve the connection exhaustion.\n\n"
                    "**Customer Message:**\n"
                    "\"We experienced a temporary database slowdown due to connection limits. We have increased capacity and optimized configuration. Services are now fully recovered.\""
                )
            elif "oauth" in prompt_lower or "callback" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: OAuth Client Secret Expiration (INC-002)\n\n"
                    "**Root Cause:**\n"
                    "The OAuth client secret registered on the GitHub developer portal expired after 180 days. There was no alert configured for expiration.\n\n"
                    "**Fix That Worked:**\n"
                    "Generated a new client secret in GitHub Console, updated the AWS Secrets Manager entry, and performed a rolling restart of auth-service.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not clear browser cookies or restart frontend servers; the issue is on the backend credential authorization.\n\n"
                    "**Customer Message:**\n"
                    "\"An expired authentication credential prevented login services from working. We have updated the credentials and login is now fully functional.\""
                )
            elif "elasticsearch" in prompt_lower or "disk full" in prompt_lower or "watermark" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: Elasticsearch Disk Watermark Block (INC-003)\n\n"
                    "**Root Cause:**\n"
                    "Elasticsearch node disk usage reached the low disk watermark (85%) and then crossed the flood stage watermark (95%), blocking all index writes.\n\n"
                    "**Fix That Worked:**\n"
                    "Cleaned up old indices older than 14 days, increased the volume size on AWS EBS from 100GB to 250GB, and reset the write block on the blocked indices.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not restart Elasticsearch service without clearing disk space or resetting the write block rules; it will remain read-only.\n\n"
                    "**Customer Message:**\n"
                    "\"Our log ingestion system temporarily paused due to disk space limits. Storage capacity has been expanded, and all system logs are indexable again.\""
                )
            elif "stripe" in prompt_lower or "502" in prompt_lower or "env var" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: Missing Stripe API Endpoint Environment Variable (INC-004)\n\n"
                    "**Root Cause:**\n"
                    "Deployment yaml was updated with payment gateways but missed setting the STRIPE_API_ENDPOINT environment variable. The app crashed on initialization trying to read this variable.\n\n"
                    "**Fix That Worked:**\n"
                    "Added the missing env variable STRIPE_API_ENDPOINT to the Helm charts, verified in staging, and redeployed the service.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not increase replica count or rollback load balancer configuration; the app requires the missing environment configuration to boot.\n\n"
                    "**Customer Message:**\n"
                    "\"A configuration mismatch in the payment service caused connection failures. The missing config has been applied and payment services are fully operational.\""
                )
            elif "redis" in prompt_lower or "oom" in prompt_lower or "noeviction" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: Redis Cache Out of Memory (INC-005)\n\n"
                    "**Root Cause:**\n"
                    "Redis maxmemory policy was set to 'noeviction' instead of 'allkeys-lru'. Old expired sessions were not evicted, leading to full memory usage.\n\n"
                    "**Fix That Worked:**\n"
                    "Changed maxmemory-policy to 'allkeys-lru' in redis.conf, ran MEMORY PURGE, and restarted redis.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not scale up memory limits without changing the eviction policy; the system will simply exhaust the new memory boundaries later.\n\n"
                    "**Customer Message:**\n"
                    "\"Our session cache database reached its memory limit. We have updated the eviction policy to automatically discard stale data. Session persistence is back to normal.\""
                )
            elif "dns" in prompt_lower or "coredns" in prompt_lower or "loop" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: CoreDNS Loop Resolution Failure (INC-006)\n\n"
                    "**Root Cause:**\n"
                    "CoreDNS loop detected. The resolve.conf on the node was pointing to localhost, causing CoreDNS to route queries to itself recursively.\n\n"
                    "**Fix That Worked:**\n"
                    "Updated Node's systemd-resolved configuration to use 8.8.8.8 and restarted CoreDNS pods.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not restart individual application pods; it will not resolve system-wide DNS name resolution loops.\n\n"
                    "**Customer Message:**\n"
                    "\"An internal DNS routing loop prevented outward network requests. The routing configuration has been corrected and connections are fully restored.\""
                )
            elif "nginx" in prompt_lower or "connections" in prompt_lower or "exhaustion" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: Nginx Worker Connection Exhaustion (INC-007)\n\n"
                    "**Root Cause:**\n"
                    "Sudden spike in API traffic exceeded Nginx's default limit of 768 worker connections per process.\n\n"
                    "**Fix That Worked:**\n"
                    "Increased worker_connections to 4096 in nginx.conf, adjusted system ulimit -n to 8192, and reloaded Nginx.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not scale backend application servers; Nginx is dropping packets before they reach your app layers.\n\n"
                    "**Customer Message:**\n"
                    "\"Our gateway server experienced connection exhaustion due to a high volume of requests. We have increased capacity and Nginx is handling traffic smoothly now.\""
                )
            elif "ssl" in prompt_lower or "expired" in prompt_lower or "certbot" in prompt_lower:
                return (
                    "### 🔍 Matched Incident: SSL Certificate Expiry (INC-008)\n\n"
                    "**Root Cause:**\n"
                    "The Let's Encrypt SSL certificate automatic renewal cron job failed because the webroot verification path was blocked by a recent router configuration change.\n\n"
                    "**Fix That Worked:**\n"
                    "Manually ran certbot certonly using DNS-01 verification challenge, updated nginx config, reloaded nginx, and fixed the HTTP verification path.\n\n"
                    "**What NOT to Try:**\n"
                    "Do not add more Nginx instances or use a different domain alias; the expired certificate must be renewed.\n\n"
                    "**Customer Message:**\n"
                    "\"An expired SSL certificate triggered security warnings for some users. We have renewed the certificate and security checks are now passing.\""
                )
            else:
                return (
                    "### 🔍 Hindsight Search Result\n\n"
                    "No direct match was found in the memory database. Here is a generic summary of past incidents that might relate:\n\n"
                    "Check the database pool settings or environment variables, as configuring correct connection watermarks and variables has resolved most gateway and backend incidents historically."
                )

# Initialize resilient managers
hindsight_manager = ResilientHindsight()
groq_manager = ResilientGroq()


def generic_response(incident_text):
    """
    Calls Groq model 'openai/gpt-oss-120b' for generic troubleshooting advice, no memory.
    """
    system_prompt = (
        "You are an expert On-Call Reliability Engineer. Provide generic, logical, "
        "step-by-step troubleshooting advice based on the incident description. Do not use past memory."
    )
    user_prompt = f"Provide generic troubleshooting advice for this incident description:\n\n{incident_text}"
    return groq_manager.generate(system_prompt, user_prompt)


def memory_response(incident_text):
    """
    Uses Hindsight recall() to find similar past incidents from the bank,
    then asks Groq to respond using that context.
    Must name: matched incident, root cause, fix that worked, what NOT to try, and a customer message.
    """
    # 1. Recall similar incidents from memory bank
    recall_res = hindsight_manager.recall(incident_text)
    
    # 2. Extract matched texts
    contexts = []
    if hasattr(recall_res, "results") and recall_res.results:
        for r in recall_res.results:
            text = getattr(r, "text", getattr(r, "content", str(r)))
            contexts.append(text)
    elif isinstance(recall_res, list):
        for r in recall_res:
            text = getattr(r, "text", getattr(r, "content", str(r))) if not isinstance(r, str) else r
            contexts.append(text)
            
    # Combine retrieved incidents into a structured context block
    if contexts:
        context_block = "\n---\n".join(contexts)
    else:
        context_block = "No similar past incidents were found in Hindsight memory."

    # 3. Create LLM prompts
    system_prompt = (
        "You are an expert On-Call Reliability Engineer. You are given a new incident description and "
        "relevant past incident memory context retrieved from Hindsight. Your goal is to map the new incident "
        "to a matching past incident in the context. If a match is found, you MUST respond in a clean, structured "
        "format containing exactly:\n"
        "1. Matched Incident Name (Name and ID)\n"
        "2. Root Cause\n"
        "3. Fix That Worked\n"
        "4. What NOT to Try (What didn't work previously)\n"
        "5. Customer Message\n\n"
        "If the past context does not contain any relevant match, clearly state that no match was found in memory."
    )
    
    user_prompt = (
        f"New Incident Description:\n{incident_text}\n\n"
        f"Retrieved Past Incident Context from Hindsight:\n{context_block}\n\n"
        f"Synthesize the incident mapping. Output using the structured fields."
    )
    
    return groq_manager.generate(system_prompt, user_prompt)


def save_incident(incident_id, root_cause, fix, what_didnt_work, customer_message, raw_text):
    """
    Uses Hindsight retain() to store a new incident postmortem.
    """
    # Create structured incident text content to retain in memory
    content = f"""Incident Postmortem:
Incident ID: {incident_id}
Raw Incident Description: {raw_text}
Root Cause: {root_cause}
Fix That Worked: {fix}
What Didn't Work / What NOT to Try: {what_didnt_work}
Customer Message: {customer_message}"""

    return hindsight_manager.retain(content)


def list_all_memories():
    """
    Returns all stored memories from the bank.
    """
    return hindsight_manager.list_memories()
