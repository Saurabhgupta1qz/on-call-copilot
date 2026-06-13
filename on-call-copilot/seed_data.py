from agent import save_incident

# List of 8 realistic synthetic past incidents
PAST_INCIDENTS = [
    {
        "incident_id": "INC-001",
        "raw_text": "API latency spikes to 15s. Database connections throwing timeout errors under heavy traffic. Many threads blocked waiting for connections.",
        "root_cause": "HikariCP connection pool size was set to default 10, which was too low for 100+ concurrent requests. Active connections were held too long due to unoptimized queries.",
        "fix": "Increased pool size to 50, added database read replica, and optimized query indexes on the users table.",
        "what_didnt_work": "Increasing database CPU/RAM without changing the connection pool size had no effect.",
        "customer_message": "We experienced a temporary database slowdown due to connection limits. We have increased capacity and optimized configuration. Services are now fully recovered."
    },
    {
        "incident_id": "INC-002",
        "raw_text": "User login via GitHub/Google failing with 401 unauthorized errors. OAuth callback handler throws Invalid Credentials exception.",
        "root_cause": "The OAuth client secret registered on the GitHub developer portal expired after 180 days. There was no alert configured for expiration.",
        "fix": "Generated a new client secret in GitHub Console, updated the AWS Secrets Manager entry, and performed a rolling restart of auth-service.",
        "what_didnt_work": "Clearing browser cookies or restarting the frontend servers did not resolve the auth failures.",
        "customer_message": "An expired authentication credential prevented login services from working. We have updated the credentials and login is now fully functional."
    },
    {
        "incident_id": "INC-003",
        "raw_text": "Log search dashboard is completely empty. Elasticsearch cluster health is RED. Logs show ClusterBlockException (index write block) on all indices.",
        "root_cause": "Elasticsearch node disk usage reached the low disk watermark (85%) and then crossed the flood stage watermark (95%), blocking all index writes.",
        "fix": "Cleaned up old indices older than 14 days, increased the volume size on AWS EBS from 100GB to 250GB, and reset the write block on the blocked indices.",
        "what_didnt_work": "Restarting Elasticsearch service did not unblock the writes since disk watermark rules still blocked it.",
        "customer_message": "Our log ingestion system temporarily paused due to disk space limits. Storage capacity has been expanded, and all system logs are indexable again."
    },
    {
        "incident_id": "INC-004",
        "raw_text": "Gateway is returning 502 Bad Gateway for all payments endpoints. Payment service pods are crashing on startup.",
        "root_cause": "Deployment yaml was updated with payment gateways but missed setting the STRIPE_API_ENDPOINT environment variable. The app crashed on initialization trying to read this variable.",
        "fix": "Added the missing env variable STRIPE_API_ENDPOINT to the Helm charts, verified in staging, and redeployed the service.",
        "what_didnt_work": "Increasing replica count or rollback of the load balancer configuration did not fix the startup crash.",
        "customer_message": "A configuration mismatch in the payment service caused connection failures. The missing config has been applied and payment services are fully operational."
    },
    {
        "incident_id": "INC-005",
        "raw_text": "Session storage is failing. Users are logged out repeatedly. Redis server log contains 'OOM command not allowed when used memory > maxmemory'.",
        "root_cause": "Redis maxmemory policy was set to 'noeviction' instead of 'allkeys-lru'. Old expired sessions were not evicted, leading to full memory usage.",
        "fix": "Changed maxmemory-policy to 'allkeys-lru' in redis.conf, ran MEMORY PURGE, and restarted redis.",
        "what_didnt_work": "Scaling up memory limit without changing eviction policy would only delay the OOM issue.",
        "customer_message": "Our session cache database reached its memory limit. We have updated the eviction policy to automatically discard stale data. Session persistence is back to normal."
    },
    {
        "incident_id": "INC-006",
        "raw_text": "Services inside the Kubernetes cluster cannot communicate with external APIs. Errors: 'Temporary failure in name resolution' for api.stripe.com and others.",
        "root_cause": "CoreDNS loop detected. The resolve.conf on the node was pointing to localhost, causing CoreDNS to route queries to itself recursively.",
        "fix": "Updated Node's systemd-resolved configuration to use 8.8.8.8 and restarted CoreDNS pods.",
        "what_didnt_work": "Restarting the individual application pods did not fix resolution since the DNS server itself was loop-locked.",
        "customer_message": "An internal DNS routing loop prevented outward network requests. The routing configuration has been corrected and connections are fully restored."
    },
    {
        "incident_id": "INC-007",
        "raw_text": "Load balancer health checks failing. Clients getting 504 Gateway Timeout. Nginx error logs show: '768 worker_connections are not enough'.",
        "root_cause": "Sudden spike in API traffic exceeded Nginx's default limit of 768 worker connections per process.",
        "fix": "Increased worker_connections to 4096 in nginx.conf, adjusted system ulimit -n to 8192, and reloaded Nginx.",
        "what_didnt_work": "Scaling the backend app servers did not help as Nginx was dropping the incoming requests before reaching the backend.",
        "customer_message": "Our gateway server experienced connection exhaustion due to a high volume of requests. We have increased capacity and Nginx is handling traffic smoothly now."
    },
    {
        "incident_id": "INC-008",
        "raw_text": "Users get security warnings in browser. Mobile apps show SSL handshake exception. Curl throws SSL certificate expired error.",
        "root_cause": "The Let's Encrypt SSL certificate automatic renewal cron job failed because the webroot verification path was blocked by a recent router configuration change.",
        "fix": "Manually ran certbot certonly using DNS-01 verification challenge, updated nginx config, reloaded nginx, and fixed the HTTP verification path.",
        "what_didnt_work": "Adding more Nginx instances or using a different domain alias did not resolve the browser warnings.",
        "customer_message": "An expired SSL certificate triggered security warnings for some users. We have renewed the certificate and security checks are now passing."
    }
]

def seed_all():
    """
    Seeds all 8 past incidents by calling save_incident.
    """
    success_count = 0
    for inc in PAST_INCIDENTS:
        success = save_incident(
            incident_id=inc["incident_id"],
            root_cause=inc["root_cause"],
            fix=inc["fix"],
            what_didnt_work=inc["what_didnt_work"],
            customer_message=inc["customer_message"],
            raw_text=inc["raw_text"]
        )
        if success:
            success_count += 1
    return success_count
