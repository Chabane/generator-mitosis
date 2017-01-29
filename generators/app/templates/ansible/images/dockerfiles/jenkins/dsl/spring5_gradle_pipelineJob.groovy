pipelineJob("spring5-gradle-pipeline") {
    definition {
        cps {
            sandbox()
            script("""
                node {
                    // Mark the code checkout 'stage'....
                    stage 'Checkout'

                    // Checkout code from repository
                    git url: 'https://github.com/microprofile/microprofile-samples.git'
                }                 
            """.stripIndent())
        }
    }
}