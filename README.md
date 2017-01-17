# Kubernetes/Docker Swarm Playground
This project contains a `Vagrantfile` and associated `Ansible` playbook scripts
to provisioning a 2 nodes Kubernetes/Docker Swarm cluster using `VirtualBox` and `Ubuntu
16.04`.

### Prerequisites
You need the following installed to use this playground.
- `Vagrant`, version 1.8.6 or better. Earlier versions of vagrant may not work
with the Vagrant Ubuntu 16.04 box and network configuration.
- `VirtualBox`, tested with Version 5.0.26 r108824
- `Ansible`, tested with Version 2.2.0
- Internet access, this playground pulls Vagrant boxes from the Internet as well
as installs Ubuntu application packages from the Internet.

### Bringing Up The cluster
To bring up the cluster, clone this repository to a working directory.

```
git clone http://github.com/nirby/mitosis
git checkout demo
```

Change into the working directory and `vagrant --caas-mode=swarm up` or `vagrant --caas-mode=k8s up`

```
cd mitosis
vagrant --caas-mode=swarm up
```

Vagrant will start two machines. Each machine will have a NAT-ed network
interface, through which it can access the Internet, and a `private-network`
interface in the subnet 192.168.77.0/24. The private network is used for
intra-cluster communication.

The machines created are:

| NAME | IP ADDRESS | ROLE |
| --- | --- | --- |
| mitosis-manager1 | 192.168.77.21 | Cluster/Node Manager |
| mitosis-worker1 | 192.168.77.31 | Cluster/Node Worker |

After the `vagrant up` is complete, the following command and output should be
visible on the cluster/node manager (**mitosis-manager1**).

For Kubernetes
```
vagrant ssh mitosis-manager1
kubectl -n mitosis get service 

NAME             CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
artifactory      10.108.148.112   <nodes>       9999:30003/TCP   35m
jenkins-master   10.105.77.103    <nodes>       8080:30001/TCP   35m
sonar            10.102.141.79    <nodes>       9000:30002/TCP   35m
```
```
kubectl describe svc artifactory -n mitosis 

Name:                   artifactory
Namespace:              mitosis
Labels:                 name=artifactory
Selector:               name=artifactory
Type:                   NodePort
IP:                     10.108.148.112
Port:                   <unset> 8080/TCP
NodePort:               <unset> 9999/TCP
Endpoints:              <none>
Session Affinity:       None
```

For Docker-swarm
```
vagrant ssh mitosis-manager1
docker service ls 
ID            NAME            REPLICAS  IMAGE                COMMAND
18a8rdjywe8q  sonar           0/2       mitosis/sonarqube    
1idkoq92bb3x  jenkins-master  0/2       mitosis/jenkins      
3ou58zc7xlrw  artifactory     0/2       mitosis/artifactory  
```
```
docker service inspect --pretty artifactory 
ID:		3ou58zc7xlrwwegyh40xxcuq0
Name:		artifactory
Mode:		Replicated
 Replicas:	2
Placement:
UpdateConfig:
 Parallelism:	1
 On failure:	pause
ContainerSpec:
 Image:		mitosis/artifactory
Resources:
Networks: atqmyyz6jctr34t64o69tyolu
Ports:
 Protocol = tcp
 TargetPort = 8080
 PublishedPort = 9999
```

