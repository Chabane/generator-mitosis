build:
	@docker-compose -p mitosis build 
run:
	@docker-compose -p mitosis up -d nginx jenkinsmaster sonar artifactory
stop:
	@docker-compose -p mitosis stop
clean:	stop
	@docker-compose -p mitosis rm jenkinsmaster nginx sonar artifactory
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`