FROM tomcat:8-jre8
MAINTAINER Nirby

# To update, check https://bintray.com/jfrog/artifactory/artifactory/view

# Disable Tomcat's manager application.
RUN rm -rf webapps/*

# Redirect URL from / to artifactory/ using UrlRewriteFilter
COPY urlrewrite/WEB-INF/lib/urlrewritefilter.jar /
COPY urlrewrite/WEB-INF/urlrewrite.xml /
RUN \
  mkdir -p webapps/ROOT/WEB-INF/lib && \
  mv /urlrewritefilter.jar webapps/ROOT/WEB-INF/lib && \
  mv /urlrewrite.xml webapps/ROOT/WEB-INF/

# To update, check https://bintray.com/jfrog/artifactory/jfrog-artifactory-oss-zip/view
ENV ARTIFACTORY_VERSION 4.5.2
ENV ARTIFACTORY_SHA1 cad00dbc28358bc5523378808799ea523181f85e
ENV ARTIFACTORY_URL https://bintray.com/artifact/download/jfrog/artifactory/jfrog-artifactory-oss-${ARTIFACTORY_VERSION}.zip

# Fetch and install Artifactory OSS war archive.
RUN curl -k -L -o artifactory.zip $ARTIFACTORY_URL && \
  echo "$ARTIFACTORY_SHA1 artifactory.zip" | sha1sum -c - && \
  unzip -j artifactory.zip "artifactory-*/webapps/artifactory.war" -d webapps && \
  rm artifactory.zip

ADD https://jdbc.postgresql.org/download/postgresql-9.4.1208.jar /usr/local/tomcat/lib/

# Expose tomcat runtime options through the RUNTIME_OPTS environment variable.
#   Example to set the JVM's max heap size to 256MB use the flag
#   '-e RUNTIME_OPTS="-Xmx256m"' when starting a container.
RUN echo 'export CATALINA_OPTS="$RUNTIME_OPTS"' > bin/setenv.sh

# Artifactory home
RUN mkdir -p /artifactory
ENV ARTIFACTORY_HOME /artifactory

# Expose Artifactories data, log and backup directory.
VOLUME /artifactory/data
VOLUME /artifactory/logs
VOLUME /artifactory/backup

WORKDIR /artifactory

# default login : admin/password