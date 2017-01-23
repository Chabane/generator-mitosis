FROM jenkins:2.19.1
MAINTAINER Nirby

USER root
# Install Docker client
ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 1.12.1
ENV DOCKER_SHA256 05ceec7fd937e1416e5dce12b0b6e1c655907d349d52574319a1e875077ccb79

RUN set -x \
	&& curl -fSL "https://${DOCKER_BUCKET}/builds/Linux/x86_64/docker-$DOCKER_VERSION.tgz" -o docker.tgz \
	&& echo "${DOCKER_SHA256} *docker.tgz" | sha256sum -c - \
	&& tar -xzvf docker.tgz \
	&& mv docker/* /usr/local/bin/ \
	&& rmdir docker \
	&& rm docker.tgz \
	&& docker -v

# Install default plugins
RUN /usr/local/bin/install-plugins.sh ansible:0.5 artifactory:2.8.2 sonar:2.5 git:3.0.1 subversion:2.7.1 matrix-auth:1.4 workflow-aggregator:2.4 docker-workflow:1.9.1 docker-commons:1.5 blueocean:1.0.0-b13 job-dsl:1.53 pipeline-maven:0.4 swarm:2.2 kubernetes:0.10

ENV JENKINS_USER admin
ENV JENKINS_PASS admin

# Skip initial setup
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

# Copy default user
COPY init/default-user.groovy /usr/share/jenkins/ref/init.groovy.d/

# The place where to put the DSL files for the Seed Job to run
RUN mkdir -p /usr/share/jenkins/ref/jobs/MitosisGeneratorJob/workspace/
# Groovy script to create the "MitosisGeneratorJob" (the standard way, not with DSL)
COPY build/create-seed-job.groovy /usr/share/jenkins/ref/init.groovy.d/
# COPY Seed Job DSL script
COPY dsl/*.groovy /usr/share/jenkins/ref/jobs/MitosisGeneratorJob/workspace/
# COPY config
COPY config/*.xml /usr/share/jenkins/ref/

