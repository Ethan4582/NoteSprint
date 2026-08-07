const backend = [
  {
    id: 1,
    question: "How do you improve the API Performance?",
    answer: "1. Pagination: breaking into a smaller pages so your service stays quick 2. Async Logging: instead of looging that writes to the disk geather log data and write it to the disk now and then it cuts down on waiting time on disk operations 3. Caching : use redis like cache every time before you make a call to database check the redis 4. Payload Compression : shrink the size of the data  while sending and reciving using tool like gzip 5. Connection pool: It keep connection ready to go instead of always open and closing the connection directly"
  }, 
  {
    id:2, 
    question:"How to secure internal microservice communication in Kubernetes (service-to-service access control)?",
    answer:`Layer 1: Private networking <br><br>
Put the service, like payment, inside a private network meaning no public address in production. In Kubernetes, that means using a ClusterIP instead of a LoadBalancer.<br><br>

Problem: In production, different services in the cluster can still talk to each other. If a service that does have public exposure gets hacked, it could be used to reach this "private" payment service.<br><br>

Layer 2: Network policy <br><br>

Add rules an allow list  that only permits services with explicit permission to talk to the service we want to keep private.<br><br>

Blind spot: network policy only knows where a request came from (its IP), not who actually sent it. In Kubernetes, IPs change a lot  pods restart and get reassigned new IPs so this isn't enough on its own.<br><br>

Layer 3: Mutual TLS<br><br>

Both services verify each other's identity. Every service gets its own short-lived certificate, and both sides verify the other before any data moves.<br><br>

Who issues the certificates: we run a trusted certificate authority inside the cluster. Teams often use a service mesh like Istio or Linkerd to implement mTLS it adds a sidecar proxy to each service, and that proxy is responsible for fetching, presenting, verifying, rotating, and encrypting on behalf of the service.<br><br>

Layer 4: Authorization<br><br>

Add strict rules for which service can call which. For example, payment has no reason to talk to refund refunds are handled by the support service  and this is enforced directly by the proxy as an authorization check.`   
  },
  
];
export default backend;
