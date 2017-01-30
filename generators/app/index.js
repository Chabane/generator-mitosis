var Generator = require('yeoman-generator'),
 util = require('util'),
 yosay = require('yosay'),
 chalk = require('chalk'),
 exec = require('child_process').exec;

class gen extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {

      // check if virtualbox is installed
      var virtualBoxInstalled = true;
      exec('vboxmanage --version', function (err, stdout, stderr) {
        if (err) {
           this.log.error('Virtualbox is not found on your computer. Download and install : https://www.virtualbox.org/wiki/Downloads');
           virtualBoxInstalled = false;
        } 
      }.bind(this));

      // check if vagrant is installed
      var vagrantInstalled = true;
      exec('vagrant --version', function (err, stdout, stderr) {
        if (err) {
           this.log.error('Vagrant is not found on your computer. Download and install: https://www.vagrantup.com/docs/installation/');
           virtualBoxInstalled = false;
        } 
      }.bind(this));

      // check if ansible is installed
      var ansibleInstalled = true;
      exec('ansible --version', function (err, stdout, stderr) {
        if (err) {
           this.log.error('Ansible is not found on your computer. Download and install : http://docs.ansible.com/ansible/intro_installation.html');
           virtualBoxInstalled = false;
        } 
      }.bind(this));

     // if any one not installed then exit the process
     if(!virtualBoxInstalled || !vagrantInstalled || !ansibleInstalled) {
      process.exit(1);
     }
   }

  prompting() {

    var name =
"\n"+
"\n                                                  .:                                   .'            "+
"\n                                                 +++                                  +++           "+
"\n                     ,;;;`                      .+++  +++                             +++           "+
"\n            `;;`    :;;;;;,                      ++`  +++                             ++`           "+
"\n           ;;;;;;   ;;;;;;;                           +++                                           "+
"\n          :;;;;;;: :;;;;;;;`    '++++  ++++'     ++'  ++++++      `.        .++++++   +++    '+++++`"+
"\n   .:.    ;;;;;;;; :;;;;;;;`   ++++++++++++++    ++'  ++++++    :;;;;;`    ++++++++   +++  .+++++++`"+
"\n `;;;;;   ;;;;;;;;  ;;;;;;;   +++'  ++++` '+++   ++'  +++:::   :;;;;;;;   ;++'    .   +++  +++.   ``"+
"\n ;;;;;;;  ;;;;;;;;  :;;;;;,   +++   .++,   +++   ++'  +++      ;;;;;;;;;  +++,        +++  +++      "+
"\n,;;;;;;;  :;;;;;;.   ,;;;`    +++   `++`   +++   ++'  +++     :;;;;;;;;;  `++++++:    +++  +++++++` "+
"\n:;;;;;;;.  ;;;;;;      .`     +++   `++`   +++   ++'  +++     ;;;;;;;;;;`  `+++++++   +++   ;+++++++"+
"\n.;;;;;;;  ;;;;;;;;   ;;;;;    +++   `++`   +++   ++'  +++     ;;;;;;;;;;       .++++  +++       :+++"+
"\n ;;;;;;;  ;;;;;;;;  ;;;;;;;   +++   `++`   +++   ++'  ;++:    `;;;;;;;;;         +++  +++        ;++"+
"\n  ;;;;;   ;;;;;;;;  ;;;;;;;.  +++   `++`   +++   ++'   +++++   ;;;;;;;;.  ++';;++++,  +++  +';;'++++"+
"\n   `,`    ;;;;;;;; .;;;;;;;:  +++   `++`   +++   ++'   ;++++    ;;;;;;,   ++++++++'   +++  ++++++++`"+
"\n           ;;;;;;  `;;;;;;;,  +++   `++`   +++   ++'     ;+;      :;,     '+++++;     ;;;  ++++++.  "+
"\n            ;;;;    ;;;;;;;             "+                                                            
"\n                     ;;;;;`        "+                                                                 
"\n                      .:,       ";                                                                    

    this.log(name);
  
    this.log('\nWelcome to the ' + chalk.red('Mitosis') + ' generator v.1.0.0-alpha.9! (Do not use in Production) \n');
    this.log('Documentation for creating an infrastructure: https://github.com/NirbyApp/generator-mitosis');
    this.log('Infrastructure files will be generated in folder: ' + chalk.yellow(process.cwd())+"\n");

    return this.prompt([{
      type    : 'input',
      name    : 'appName',
      message : '(1/8) Name of my infrastructure',
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
      message : '(2/8) Operating System of my infrastructure',
      default : 'ubuntu',
    }, 
    {
      type    : 'list',
      name    : 'caasMode',
      choices : [
              { value: 'swarm', name:'Docker Swarm mode'}, 
              { value: 'k8s', name:'Kubernetes'}
          ],
      message : '(3/8) Container cluster manager',
      default : 'swarm',
    }, 
    {
      type    : 'confirm',
      name    : 'scheduleManager',
      message : '(4/8) Schedule the manager',
      default : true 
    },
    {
      type    : 'confirm',
      name    : 'ownRegistry',
      message : '(5/8) Push the images to my own docker registry',
      default : true 
    },
    {
      when: function (response) {
        return response.ownRegistry;
      },
      type    : 'input',
      name    : 'docker_registry_server',
      message : 'Docker registry server',
      default : "hub.docker.com"
    },
    {
      when: function (response) {
        return response.ownRegistry;
      },
      type    : 'input',
      name    : 'docker_registry_username',
      message : 'Username of docker registry',
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
      message : 'Password of docker registry',
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
      message : 'Docker repository name',
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
      message : '(6/8) Replicate Jenkins, Artifactory, Sonarqube',
      default : true 
    },
    {
        type    : 'confirm',
        name    : 'defaultMicroService',
        message : '(7/8) Deploy the defaults micro-services',
        default : true 
    },
    {
      type    : 'confirm',
      name    : 'initVms',
      message : '(8/8) Test my infrastructure locally in a virtual machines',
      default : true,
    },
    {
      type    : 'input',
      name    : 'workers',
      message : 'Number of workers',
      default : 1,
      when: function (response) {
        return response.initVms;
      },
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
      message : 'Memory of worker node (Mo)',
      default : 1024,
      when: function (response) {
        return response.initVms;
      },
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
      message : 'Memory of cluster manager (Mo)',
      default : 2048,
      when: function (response) {
        return response.initVms;
      },
      validate: name => {
                    if (name && !/\d+/.test(name)) {
                        return 'Memory should only consist of 0~9';
                     }
                    return true;
                }
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
      const defaultIp = "192.168.77";
      const defaultManagerIp = "192.168.77.21";

      // copy vagrantfile
      this.fs.copyTpl(
        this.templatePath('Vagrantfile'),
        this.destinationPath('Vagrantfile'),
        {
          appName: this.answers.appName,
          caasMode: this.answers.caasMode,
          memoryWorkers: this.answers.memoryWorkers ? this.answers.memoryWorkers : 1024,
          memoryManager: this.answers.memoryManager ? this.answers.memoryManager : 2048,
          os: this.answers.os,
          workers: this.answers.workers ? this.answers.workers : 2,
          ownRegistry: this.answers.ownRegistry,
          defaultIp: defaultIp
        }
      );

      /**
       * copy scripts shell
       */
       this.fs.copy(
        this.templatePath('scripts/**'),
        this.destinationPath('scripts')
      );

      // copy ansible hosts
      this.fs.copyTpl(
        this.templatePath('ansible/mitosis-hosts'),
        this.destinationPath('ansible/'+this.answers.appName+'-hosts'),
        {
          appName: this.answers.appName,
          os: this.answers.os,
          workers: this.answers.workers ? this.answers.workers : 2,
          defaultIp: defaultIp
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
          replicateTools: this.answers.replicateTools,
          defaultMicroService: this.answers.defaultMicroService,
          defaultIp: defaultIp,
          caasMode: this.answers.caasMode
        }
      );

       /**
       * copy ansible images registry
       */
      this.fs.copyTpl(
        this.templatePath('ansible/images/mitosis-registry-playbook.yml'),
        this.destinationPath('ansible/images/'+this.answers.appName+'-registry-playbook.yml'),
        {
          appName: this.answers.appName,
          ownRegistry: this.answers.ownRegistry,
          replicateTools: this.answers.replicateTools,
          defaultMicroService: this.answers.defaultMicroService,
          defaultIp: defaultIp,
          caasMode: this.answers.caasMode
        }
      );

      /**
       * copy dockerfiles
       */
       this.fs.copy(
        this.templatePath('ansible/images/registry/**/*'),
        this.destinationPath('ansible/images/registry')
      );

      this.fs.copyTpl(
        this.templatePath('ansible/images/registry/k8s/registry.yml'),
        this.destinationPath('ansible/images/registry/k8s/registry.yml'),
        {
          appName: this.answers.appName
        }
      );

      /**
       * copy dockerfiles
       */
       this.fs.copy(
        this.templatePath('ansible/images/dockerfiles/**/*'),
        this.destinationPath('ansible/images/dockerfiles')
      );

      this.fs.copyTpl(
        this.templatePath('ansible/images/dockerfiles/artifactory/Dockerfile'),
        this.destinationPath('ansible/images/dockerfiles/artifactory/Dockerfile'),
        {
          appName: this.answers.appName
        }
      );

      this.fs.copyTpl(
        this.templatePath('ansible/images/dockerfiles/sonarqube/Dockerfile'),
        this.destinationPath('ansible/images/dockerfiles/sonarqube/Dockerfile'),
        {
          appName: this.answers.appName
        }
      );

      this.fs.copyTpl(
        this.templatePath('ansible/images/dockerfiles/jenkins/Dockerfile'),
        this.destinationPath('ansible/images/dockerfiles/jenkins/Dockerfile'),
        {
          appName: this.answers.appName,
          defaultMicroService: this.answers.defaultMicroService
        }
      );

      this.fs.copyTpl(
        this.templatePath('ansible/images/dockerfiles/makefile'),
        this.destinationPath('ansible/images/dockerfiles/makefile'),
        {
          docker_registry_repository_name: this.answers.docker_registry_repository_name ? this.answers.docker_registry_repository_name : 'mitosis'
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
          os: this.answers.os,
          defaultIp: defaultIp 
        }
      );
      this.fs.copyTpl(
        this.templatePath('ansible/k8s/mitosis-k8s-playbook.yml'),
        this.destinationPath('ansible/k8s/'+this.answers.appName+'-k8s-playbook.yml'),
        {
          appName: this.answers.appName,
          defaultIp: defaultIp
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
          docker_registry_repository_name: this.answers.docker_registry_repository_name,
          defaultMicroService: this.answers.defaultMicroService,
          defaultIp: defaultManagerIp
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
          appName: this.answers.appName,
          defaultIp: defaultIp
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
          docker_registry_repository_name: this.answers.docker_registry_repository_name,
          defaultMicroService: this.answers.defaultMicroService
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
      if(this.answers.initVms) {
        this.spawnCommand('vagrant', ['up']);
      }
  };

   end() {
        this.log.ok(`Infrastructure ${this.answers.appName} generated `);

        if(this.answers.initVms) {
          this.log.ok(`Installing the virtuals machines...`);
        }
    }
}

module.exports = gen;
