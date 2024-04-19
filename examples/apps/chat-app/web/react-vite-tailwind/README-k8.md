
```
apiVersion: v1
kind: Service
metadata:
  name: chatdock-frontend-service
spec:
  selector:
    app: chatdock-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 32000  # Specify your desired static NodePort here
  type: NodePort
```
# svc 

```
apiVersion: v1
kind: Pod
metadata:
  name: chatdock-frontend
spec:
  containers:
  - name: chatdock-frontend
    image: noscopev6/chatdock:v1
    ports:
    - containerPort: 80
```




#### latest 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node-app
        image: noscopev6/node-app:v1  # Replace with your Docker image name and tag
        ports:
        - containerPort: 3000
        env:
        - name: VITE_SERVER_URI
          value: "https://chatapi.kubecloud.in.net/api/v1"
        - name: VITE_SOCKET_URI
          value: "https://chatapi.kubecloud.in.net"

          
apiVersion: v1
kind: Service
metadata:
  name: node-app-service
spec:
  selector:
    app: node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
      nodePort: 32001  # Specify your desired static NodePort here
  type: NodePort
