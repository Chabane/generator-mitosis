pipelineJob("spring5-gradle-pipeline") {
    definition {
        cps {
            sandbox()
            script("""
                node {
                      stage "checkout"

                      stage "test"

                      stage "deploy"
                }                 
            """.stripIndent())
        }
    }
}