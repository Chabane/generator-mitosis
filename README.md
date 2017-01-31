<img src="http://chabanerefes.info/prez_1/images/logo.svg" height="40" />

A micro services infrastructure yeoman generator. Mitosis is inspired from CAAS solutions like EC2 and GKE.

It allows developers to load, organize, execute, evolve, administrate and stop micro-services using few mitosis commands lines.

And It takes advantage of the following solutions/technologies (alpha):

- `Vagrant` development mode 
- `Ansible` provisionning
- `Kubernetes/docker swarm` orchestrate and replicate docker containers
- `ELK Stack` log analytics
- `Traefik` HTTP reverse proxy
- `Jenkins 2` CI/CD of micro-services using Job DSL and Pipeline Job
- `Aritfactory` artefacts deployment
- `Sonarqube` quality

### Availables soon
To prove it efficiency, mitosis generates 2 default micro-services, connected to an event's bus using kafka and drived by spark streaming

2 consumers & 2 producers

- Spring 5/Apache Tomcat/Gradle/MongoDB
- NodeJS express/Redis
- Angular - Material 
- iOT - Akka Actors - Raspberry Pi

### Prerequisites
You need the following installed to use this playground.
- [`NodeJS`](https://nodejs.org/en/download/), Node 4 or higher, together with NPM 3 or higher.
- [`VirtualBox`](https://www.virtualbox.org/wiki/Downloads), tested with Version 5.1.14 r112924.
- [`Vagrant`](https://www.vagrantup.com/docs/installation/), version 1.9.1 or better. Earlier versions of vagrant may not work.
with the Vagrant Ubuntu 16.04 box and network configuration.
- [`Ansible`](http://docs.ansible.com/ansible/intro_installation.html), tested with Version 2.2.0. 
- `Docker registry` (optional), at least a docker hub account.
- Internet access, this demonstartion pulls Vagrant boxes from the Internet as well
as installs Ubuntu application packages from the Internet.

### Generate a project
```
npm install -g yo
npm install -g generator-mitosis
yo mitosis
```

The code generated contains a `Vagrantfile` and associated `Ansible` playbook scripts
to provisioning a nodes Kubernetes/Docker Swarm cluster using `VirtualBox` and `Ubuntu
16.04` (CentOS7 & CoreOS soon).

Vagrant will start two machines. Each machine will have a NAT-ed network
interface, through which it can access the Internet, and a `private-network`
interface in the subnet 192.168.77.0/24. The private network is used for
intra-cluster communication.

The machines created are:

| NAME | IP ADDRESS | ROLE |
| --- | --- | --- |
| appname-manager1 | 192.168.77.21 | Cluster Manager |
| appname-worker1 | 192.168.77.31 | Node Worker |
| appname-workern | 192.168.77.3n | Node Worker |

After the `vagrant up` is complete, the following command and output should be
visible on the cluster manager (**appname-manager1**).

For Kubernetes
```
vagrant ssh appname-manager1
kubectl -n appname get service 

NAME             CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
artifactory      10.108.148.112   <nodes>       9999:30003/TCP   35m
jenkins-master   10.105.77.103    <nodes>       8080:30001/TCP   35m
sonar            10.102.141.79    <nodes>       9000:30002/TCP   35m
```
```
kubectl describe svc artifactory -n appname 

Name:                   artifactory
Namespace:              appname
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
18a8rdjywe8q  sonar           2/2       mitosis/sonarqube    
1idkoq92bb3x  jenkins-master  2/2       mitosis/jenkins      
3ou58zc7xlrw  artifactory     2/2       mitosis/artifactory  
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

### Switch to another orchestrator
```
vagrant destroy -f && vagrant --caas-mode=swarm up // or vagrant --caas-mode=k8s up
```