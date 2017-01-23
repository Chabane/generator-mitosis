build:
	@docker-compose -p mitosis build 
run:
	@docker-compose -p mitosis up -d jenkins sonarqube artifactory
stop:
	@docker-compose -p mitosis stop
clean:	stop
	@docker-compose -p mitosis rm jenkins sonarqube artifactory
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`