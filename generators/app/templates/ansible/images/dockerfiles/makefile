build:
	@docker-compose -p <%= docker_registry_repository_name %> build 
run:
	@docker-compose -p <%= docker_registry_repository_name %> up -d jenkins sonarqube artifactory
stop:
	@docker-compose -p <%= docker_registry_repository_name %> stop
clean:	stop
	@docker-compose -p <%= docker_registry_repository_name %> rm jenkins sonarqube artifactory
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`