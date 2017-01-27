# mitosis
A micro services yeoman generator via an "as code" infrastructure. Mitosis is inspired from CAAS solutions like EC2 and GKE.

[Demonstartion](https://github.com/NirbyApp/generator-mitosis/tree/demo)

It allows developers to load, organize, execute, evolve, administrate and stop micro-services using few mitosis commands lines.

And It takes advantage of the following solutions/technologies :

- `Vagrant` development mode 
- `Ansible provisionning
- `Kubernetes/docker` swarm to orchestrate and replicate docker containers
- `ELK Stack` log analytics
- `Traefik` HTTP reverse proxy
- `Jenkins 2` CI/CD of micro-services using Job DSL and Pipeline Job
- `Consul/etcd` registering/unregistering the micro-services
- `Aritfactory` artefacts deployment
- `Sonarqube` quality

To prove it efficiency, mitosis generates 2 default micro-services, connected to an event's bus using kafka and drived by spark streaming

2 consumers & 2 producers

- Spring 5/Apache Tomcat/Gradle/MongoDB
- NodeJS express/Redis
- Angular2 - Material 2
- iOT - Akka Actors - Raspberry Pi

<h3>Infrastructure </h3> 
<img src="https://avatars2.githubusercontent.com/u/1714870?v=3&s=200" height="40" />
<img src="https://www.vagrantup.com/assets/images/logo-header-53d0bd25.png" height="40" />
<img src="https://upload.wikimedia.org/wikipedia/fr/thumb/4/4b/Ansible_logo.png/120px-Ansible_logo.png" height="40" />
<img src="https://www.docker.com/sites/default/files/moby.svg" height="40" />
<img src="https://jenkins.io/images/226px-Jenkins_logo.svg.png" height="40" />
<img src="https://www.docker.com/sites/default/files/docker-swarm-hero2.png" height="40" />
<img src="https://opencredo.com/wp-content/uploads/2015/12/kubernetes.png" height="40" />
<img src="https://traefik.io/traefik.logo.png" height="40"/>
<img src="https://blog.osones.com/images/docker/etcd.png" height="40"/>
<img src="http://blog.soat.fr/wp-content/uploads/2016/06/consul.png" height="40"/>
<img src="https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/05/1462437187elk-logo.png" height="40"/>
<br/>
<h3>OS </h3> 
<img src="https://blog.osones.com/images/docker/coreos.png" height="40"/>
<img src="http://design.ubuntu.com/wp-content/uploads/ubuntu-logo112.png" height="40"/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Centos-logo-light.svg/2000px-Centos-logo-light.svg.png" height="40"/>
<br/>
<h3>Micro services </h3>  
<img src="http://airisdata.com/wp-content/uploads/2016/01/kafka-logo-600x390.jpg" height="40"/>
<img src="http://spark.apache.org/images/spark-logo-trademark.png" height="40"/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Tomcat-logo.svg/2000px-Tomcat-logo.svg.png" height="40"/>
<img src="https://nodeblog.files.wordpress.com/2011/07/nodejs.png" height="40"/>
<img src="https://jaxenter.de/wp-content/uploads/2015/02/spring-by-pivotal-logo.png" height="40"/>
<img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Redis_Logo.svg/1280px-Redis_Logo.svg.png" height="40"/>
<img src="https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg" height="40"/>
<img src="https://angular.io/resources/images/logos/angular2/angular.svg" height="40"/>
<img src="http://akka.io/resources/images/akka_full_color.svg" height="40"/>
<img src="http://www.geektouch.fr/wp-content/uploads/2013/05/media_raspberry_pi.jpg" height="40"/>
</br>
<h3>Tools </h3>  
<img src="https://www.sonarqube.org/assets/logo-31ad3115b1b4b120f3d1efd63e6b13ac9f1f89437f0cf6881cc4d8b5603a52b4.svg" height="40"/>
<img src="https://www.jfrog.com/wp-content/uploads/2015/09/Artifactory_HEX1.png" height="40"/>
<img src="https://s3.amazonaws.com/satisfaction-production/s3_images/592380/gradle_logo.gif" height="40"/>



