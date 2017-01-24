var Generator = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

class gen extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
        try {
            this.username = process.env.USER || process.env.USERPROFILE.split(require('path').sep)[2];
        } catch (e) {
            this.username = '';
        }
   }

  prompting() {

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Mitosis') + ' generator!'
    ));

    return this.prompt([{
      type    : 'input',
      name    : 'appName',
      message : 'Your project name',
      validate: name => {
                    if (!name) {
                        return 'Project name cannot be empty';
                    }
                    if (!/\w+/.test(name)) {
                        return 'Project name should only consist of 0~9, a~z, A~Z, _, .';
                    }
                    const fs = require('fs');
                    if (!fs.existsSync(this.destinationPath(name))) {
                        return true;
                    }
                    if (require('fs').statSync(this.destinationPath(name)).isDirectory()) {
                        return 'Project already exist';
                    }
                    return true;
                }
    },
    {
      type    : 'list',
      name    : 'os',
      choices : [
              { value: 'ubuntu', name:'Ubuntu'} 
           //   ,{ value: 'centos', name:'CentOS'}
          ],
      message : 'Select the OS (dev)',
      default : 'ubuntu',
    }, 
    {
      type    : 'list',
      name    : 'caasMode',
      choices : [
              { value: 'swarm', name:'Docker Swarm mode'}, 
              { value: 'k8s', name:'Kubernetes'}
          ],
      message : 'Select the container cluster manager',
      default : 'swarm',
    }, 
    {
      type    : 'confirm',
      name    : 'scheduleManager',
      message : 'Do you want to schedule the manager?',
      default : true 
    },
    {
      type    : 'input',
      name    : 'workers',
      message : 'Number of workers',
      default : 1,
      validate: name => {
                    if (name && !/\d+/.test(name)) {
                        return 'Worker number should only consist of 0~9';
                    }
                    return true;
                }
    },
    {
      type    : 'input',
      name    : 'memoryWorkers',
      message : 'Memory of worker node',
      default : 1024,
      validate: name => {
                    if (name && !/\d+/.test(name)) {
                        return 'Memory should only consist of 0~9';
                     }
                    return true;
                }
    },
    {
      type    : 'input',
      name    : 'memoryManager',
      message : 'Memory of cluster manager',
      default : 2048,
      validate: name => {
                    if (name && !/\d+/.test(name)) {
                        return 'Memory should only consist of 0~9';
                     }
                    return true;
                }
    },
    {
      type    : 'confirm',
      name    : 'ownRegistry',
      message : 'Do you want to push the images to your own docker registry?',
      default : true 
    },
    {
      when: function (response) {
        return response.ownRegistry;
      },
      type    : 'input',
      name    : 'docker_registry_server',
      message : 'Enter your docker registry server',
      default : "hub.docker.com"
    },
    {
      when: function (response) {
        return response.ownRegistry;
      },
      type    : 'input',
      name    : 'docker_registry_username',
      message : 'Enter username of docker registry',
      validate: name => {
                    if (!name) {
                        return 'Username cannot be empty';
                    }
                    return true;
                }      
    },
    {
      when: function (response) {
        return response.ownRegistry;
      },
      type    : 'password',
      name    : 'docker_registry_password',
      message : 'Enter password of docker registry',
      validate: name => {
                    if (!name) {
                        return 'Password cannot be empty';
                    }
                    return true;
                }      
    },
    {
      when: function (response) {
        return response.ownRegistry;
      },
      type    : 'input',
      name    : 'docker_registry_repository_name',
      message : 'Enter your docker repository name',
      validate: name => {
                    if (!name) {
                        return 'Repository name cannot be empty';
                    }
                    return true;
                }   
    },
    {
      type    : 'confirm',
      name    : 'replicateTools',
      message : 'Do you want to replicate Jenkins, Artifactory, Sonarqube?',
      default : true 
    },

    ]).then((answers) => {
      require('date-util');
      this.answers = answers;
      this.answers.date = new Date().format('mmm d, yyyy');
      this.obj = {answers: this.answers};
    });
  };
  
  configuring() {
        const path = require('path');
        const fs = require('fs');
        const done = this.async();
        fs.exists(this.destinationPath(this.answers.appName), exists => {
            if (exists && fs.statSync(this.destinationPath(this.answers.appName)).isDirectory()) {
                this.log.error(`Directory [${this.answers.appName}] exists`);
                process.exit(1);
            }
            this.destinationRoot(path.join(this.destinationRoot(), this.answers.appName));
            done();
        });
    }

    writing() {

      const _ = require('lodash');

      // copy vagrantfile
      this.fs.copyTpl(
        this.templatePath('Vagrantfile'),
        this.destinationPath('Vagrantfile'),
        {
          appName: this.answers.appName,
          caasMode: this.answers.caasMode,
          memoryWorkers: this.answers.memoryWorkers,
          memoryManager: this.answers.memoryManager,
          os: this.answers.os,
          workers: this.answers.workers,
          ownRegistry: this.answers.ownRegistry
        }
      );

      // copy ansible hosts
      this.fs.copyTpl(
        this.templatePath('ansible/mitosis-hosts'),
        this.destinationPath('ansible/'+this.answers.appName+'-hosts'),
        {
          appName: this.answers.appName,
          os: this.answers.os,
          workers: this.answers.workers
        }
      );

      /**
       * copy ansible images
       */
      this.fs.copyTpl(
        this.templatePath('ansible/images/mitosis-images-playbook.yml'),
        this.destinationPath('ansible/images/'+this.answers.appName+'-images-playbook.yml'),
        {
          appName: this.answers.appName,
          docker_registry_server: this.answers.docker_registry_server === 'hub.docker.com'? '': this.answers.docker_registry_server,
          docker_registry_username: this.answers.docker_registry_username,
          docker_registry_password: this.answers.docker_registry_password,
          docker_registry_repository_name: this.answers.docker_registry_repository_name,
          ownRegistry: this.answers.ownRegistry,
          replicateTools: this.answers.replicateTools
        }
      );

       this.fs.copy(
        this.templatePath('ansible/images/dockerfiles/**/*'),
        this.destinationPath('ansible/images/dockerfiles'),
        {
          appName: this.answers.appName
        }
      );

      /*
       * copy ansible k8s 
       */
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/mitosis-base-playbook.yml'),
        this.destinationPath('ansible/k8s/'+this.answers.appName+'-base-playbook.yml'),
        {
          appName: this.answers.appName,
          os: this.answers.os 
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/mitosis-k8s-playbook.yml'),
        this.destinationPath('ansible/k8s/'+this.answers.appName+'-k8s-playbook.yml'),
        {
          appName: this.answers.appName
        }
      );
      /** k8s roles */
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/roles/mitosis-base/tasks/main.yml'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-base/tasks/main.yml'),
        {
          appName: this.answers.appName,
          os: this.answers.os
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/roles/mitosis-master/tasks/main.yml'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-master/tasks/main.yml'),
        {
          appName: this.answers.appName,
          os: this.answers.os,
          scheduleManager: this.answers.scheduleManager,
          replicateTools: this.answers.replicateTools,
          ownRegistry: this.answers.ownRegistry,
          docker_registry_repository_name: this.answers.docker_registry_repository_name
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/roles/mitosis-worker/tasks/main.yml'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-worker/tasks/main.yml'),
        {
          appName: this.answers.appName
        }
      );
      /** k8s networks */
      this.fs.copy(
        this.templatePath('ansible/k8s/roles/mitosis-master/files/networks', '*'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-master/files/networks'),
        {
          appName: this.answers.appName
        }
      );
      /** k8s services*/
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/roles/mitosis-master/files/services/sonar.yml'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-master/files/services/sonar.yml'),
        {
          appName: this.answers.appName,
          ownRegistry: this.answers.ownRegistry,
          docker_registry_repository_name: this.answers.docker_registry_repository_name
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/roles/mitosis-master/files/services/artifactory.yml'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-master/files/services/artifactory.yml'),
        {
          appName: this.answers.appName,
          ownRegistry: this.answers.ownRegistry,
          docker_registry_repository_name: this.answers.docker_registry_repository_name
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/roles/mitosis-master/files/services/jenkinsmaster.yml'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-master/files/services/jenkinsmaster.yml'),
        {
          appName: this.answers.appName,
          ownRegistry: this.answers.ownRegistry,
          docker_registry_repository_name: this.answers.docker_registry_repository_name
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/roles/mitosis-master/files/services/namespace.yml'),
        this.destinationPath('ansible/k8s/roles/'+this.answers.appName+'-master/files/services/namespace.yml'),
        {
          appName: this.answers.appName
        }
      );
      /*
       * copy ansible swarm 
       */
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/mitosis-base-playbook.yml'),
        this.destinationPath('ansible/swarm/'+this.answers.appName+'-base-playbook.yml'),
        {
          appName: this.answers.appName
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/mitosis-swarm-playbook.yml'),
        this.destinationPath('ansible/swarm/'+this.answers.appName+'-swarm-playbook.yml'),
        {
          appName: this.answers.appName
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/mitosis-services-playbook.yml'),
        this.destinationPath('ansible/swarm/'+this.answers.appName+'-services-playbook.yml'),
        {
          appName: this.answers.appName
        }
      );
      /** swarm roles */
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/roles/mitosis-base/tasks/main.yml'),
        this.destinationPath('ansible/swarm/roles/'+this.answers.appName+'-base/tasks/main.yml'),
        {
          appName: this.answers.appName,
          os: this.answers.os 
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/roles/mitosis-common/tasks/main.yml'),
        this.destinationPath('ansible/swarm/roles/'+this.answers.appName+'-common/tasks/main.yml'),
        {
          appName: this.answers.appName
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/roles/mitosis-manager/tasks/main.yml'),
        this.destinationPath('ansible/swarm/roles/'+this.answers.appName+'-manager/tasks/main.yml'),
        {
          appName: this.answers.appName,
          scheduleManager: this.answers.scheduleManager
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/roles/mitosis-network/tasks/main.yml'),
        this.destinationPath('ansible/swarm/roles/'+this.answers.appName+'-network/tasks/main.yml'),
        {
          appName: this.answers.appName
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/roles/mitosis-services/tasks/main.yml'),
        this.destinationPath('ansible/swarm/roles/'+this.answers.appName+'-services/tasks/main.yml'),
        {
          appName: this.answers.appName,
          replicateTools: this.answers.replicateTools,
          ownRegistry: this.answers.ownRegistry,
          docker_registry_repository_name: this.answers.docker_registry_repository_name
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/swarm/roles/mitosis-worker/tasks/main.yml'),
        this.destinationPath('ansible/swarm/roles/'+this.answers.appName+'-worker/tasks/main.yml'),
        {
          appName: this.answers.appName
        }
      );

      // create the vm
      this.spawnCommand('vagrant', ['up']);
  };

   end() {
        this.log.ok(`Project ${this.answers.appName} generated `);
        this.log.ok(`Installing the virtuals machines...`);
    }
}

module.exports = gen;
