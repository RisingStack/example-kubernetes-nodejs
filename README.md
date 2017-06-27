# example-kubernetes-nodejs

Introduction to `Kubernetes` (k8s) with `Node.js`.

## Requirements

- Kubernetes (or minikube)
- kubectl
- Docker

## Helpers

- Re-using local Docker daemon with minikube: `eval $(minikube docker-env)` (run it once before Docker build)
- On OSX: To base64: `pbpaste | base64 | pbcopy` and From base64: `pbcopy | base64 --decode`
- `minikube start` and `minikube stop`

## Tasks

### 1. Build Docker image

Re-using local Docker daemon with minikube:

```sh
eval $(minikube docker-env)
```

Building Docker image:

```sh
cd src/gateway
docker build -t my-co/gateway:v1 .
```

### 2. Create Secret, Deployment and Service in Kubernetes

```sh
kubectl create -f k8s
kubectl get deployment
kubectl get deployment <deployment-name> -o yaml
kubectl edit deployment <deployment-name>
kubectl get secret
kubectl get secret <secret-name> -o yaml
kubectl get service
kubectl get service <service-name> -o yaml
```

### 3. Get running pods

```sh
kubectl get pod
kubectl describe pod <pod-name>
```

Edit replica number in gateway Deployment and get pods again.  
WARNING: Always edit `yaml` files in Kubernetes via `kubectl`, it's not synchronized with your local `k8s` folder.

### 4. Kill one pod

```sh
kubectl get pod
kubectl delete pod <pod-name>
kubectl get pod
```

### 5. Test networking

Go to inside a running pod:

```sh
kubectl get pod
kubectl exec <pod-name> -it -- sh
nslookup kubernetes gateway
curl <host>:3001
curl <ip>:3001
env | grep GATEWAY
```

From minikibe:

```
minikube service gateway
```

### 6. Set Horizontal Pod Autoscaler (HPA)

Do you have a running Heapster (collects metrics for autoscaler)?

```sh
kubectl get pod -n kube-system
```

If no, install it from here: https://github.com/kubernetes/heapster

```sh
kubectl autoscale deployment gateway --cpu-percent=50 --min=1 --max=10
kubectl get hpa
kubectl get hpa gateway -o yaml
ab -n 10000 -c 100 <IP>
```

HPA runs every 2 minutes by default.

### 7. Templating

Checkout [Helm](https://github.com/kubernetes/helm) and [anchor](https://github.com/RisingStack/anchor).
