FROM sonarqube:6.2
MAINTAINER <%= appName %>

VOLUME ["$SONARQUBE_HOME/data", "$SONARQUBE_HOME/extensions"]

WORKDIR $SONARQUBE_HOME

ENTRYPOINT ["/opt/sonarqube/bin/run.sh"]