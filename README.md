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

If not, enable it:

```sh
$ minikube addons list
- addon-manager: enabled
- dashboard: enabled
- kube-dns: enabled
- heapster: disabled
- registry-creds: disabled

# minikube must be running for these commands to take effect
$ minikube addons enable heapster
heapster was successfully enabled

# this may take some time
$ kubectl get pod -n kube-system
NAME                          READY     STATUS              RESTARTS   AGE
heapster-2b7mt                1/1       Running             0          4m
```

```sh
kubectl autoscale deployment gateway --cpu-percent=50 --min=1 --max=10
kubectl get hpa
kubectl get hpa gateway -o yaml
ab -n 10000 -c 100 <IP>
```

HPA runs every 2 minutes by default.

### 7. Templating

Checkout [Helm](https://github.com/kubernetes/helm) and [anchor](https://github.com/RisingStack/anchor).

Install helm, then:

```sh
$ helm init
Creating /Users/foo/.helm
Creating /Users/foo/.helm/repository
Creating /Users/foo/.helm/repository/cache
Creating /Users/foo/.helm/repository/local
Creating /Users/foo/.helm/plugins
Creating /Users/foo/.helm/starters
Creating /Users/foo/.helm/cache/archive
Creating /Users/foo/.helm/repository/repositories.yaml
$HELM_HOME has been configured at /Users/foo/.helm.

# this will take a while
$ kubectl get pod -n kube-system
NAME                             READY     STATUS    RESTARTS   AGE
tiller-deploy-1936853538-3brdf   1/1       Running   0          7m
```

Backup your infrastructure:

```sh
node chart.js
```

Your templates will be saved in `gateway/templates/`

```sh
helm package gateway
```

On a fresh cluster run:

```sh
helm install gateway
```

and your infrastructure should be restored.
