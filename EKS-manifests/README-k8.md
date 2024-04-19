```
aws eks --region <region-code> update-kubeconfig --name <cluster-name>
```


```
kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml
```

# HOW TO Deploy APP on `EKS-Cluster`

>> STEP 1: Containerize
- Update the environment variable in .env and yaml files
    - Frontend ENV : Only Update the backend URL in .env and frontend yaml deployfile 
    - Backend ENV : Update the Mongo DB URL + CORS Varialbe + Backend HOST_URL
- build the chatapp-frontend and backend conatiner (Dockerfile is present in respective directory)
- push the conatiner to dockerhub

>> STEP 2: DB Deploy
- Login to atllab mongo db account and create a mongo db cluster 
- copy user connection URI String and Update in the .env and YAML of backend 

>> STEP 3: EKS Cluster Deploy
- Create a Cluster (master-node)
- Create a Worker NODE to deploy conatiners
- Install AWS CLI and configure it in local OR USE AWS CloudShell and `aws configure` (login with CLI Creds)
- Login EKS master node with below cmd
```bash
aws eks --region <region-code> update-kubeconfig --name <cluster-name>
```
- Install the weave CNI for the connectivity between nodes
```bash
kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml
```
- Now Deploy the frontend and backend POD with their service 
- Clone the repository where yaml files are stored
```bash
kubectl apply -f <file-name>  # put the file name one by one (4 yaml files)
```
- Now Check the SVC to check that service is connected to the conatiner/pod
```bash
kubectl describe svc <service-name> # inspect the end point variable in the chart for both frontend and backend svc
```

>> STEP 4: HTTPS Certificate `ACM`
- Create a certificate in the aws acm service & update the cname of that certificate in the DNS of you domain 
```bash
# use wild card while creating the certificate
*.example.com
```

>> STEP 5: ALB 
- Create a 2 Target group (frontend and backend)
- add the node1 to frontend and node2 to backend target group
- also update the port (svc-port) number while adding the node in target group 
- now create a loadbalancer 
   - add the https lisner as 443 port
   - edit the rule of https listner
   - edit the default listner rule and forward the traffic to backend target group 100%
   - now add 1 more rule in https listener which create a rule that is if `host-header` is a frontend domain then forward the traffic to frontend target group 100% (put he frontend domain in the hostheader condition) as `chat-app.example.com`

>> STEP 6: DNS
- create a DNS record for frontend and backend domain and add the same load balancer to both of them (CNAME record is required for ALB)

>> STEP 7: DONE
- Now Visit the frontend and backend URL 
```bash
chat-app.example.com
chat-app-api.example.com
```

>> NOTE : Make Sure all the Security groups have all the required permission to access each other in the VPC 


### INFRA SETUP : (coming soon....)

- Create a ConfigMap for the env variables of manifest files
- CICD to Create a docker container and push to dockerhub when i push the code to git
- Deploy EFK Loggin solution in EKS with dashboard to check the NODE and conatainer application logs
- use AWS ALB ingress controller + auto scaling of nodes
- Deploy Mongo Db in the ECS OR Fargate instead of `ATLAS`
