pipelineJob("spring5-gradle-pipeline") {
    definition {
        cps {
            sandbox()
            script("""
                node {
                      stage "checkout"
                       git url : 'https://github.com/NirbyApp/mitosis-microservice-spring-reactor.git'
                           
                      stage "test"
                       sh './gradlew test'
                      
                      stage "build"
                       sh './gradlew build'

                      stage "deploy"
                       sh 'docker build -t mitosis/microservice-spring-reactor1.0.0-alpha.0 .'
                       sh 'docker run -d -p 9991:8080 mitosis/microservice-spring-reactor:1.0.0-alpha.0'
                }                 
            """.stripIndent())
        }
    }
}