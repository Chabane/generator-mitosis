
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const uuidV1 = require('uuid/v1');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
require('date-util');

class gen extends Generator {
    initializing() {

    }

    prompting() {
        // eslint-disable-line no-use-before-define
        const name =
      '\n' +
      '\n                                                  .:                                   ."            ' +
      '\n                                                 +++                                  +++           ' +
      '\n                     ,;;;`                      .+++  +++                             +++           ' +
      '\n            `;;`    :;;;;;,                      ++`  +++                             ++`           ' +
      '\n           ;;;;;;   ;;;;;;;                           +++                                           ' +
      '\n          :;;;;;;: :;;;;;;;`    "++++  ++++"     ++"  ++++++      `.        .++++++   +++    "+++++`' +
      '\n   .:.    ;;;;;;;; :;;;;;;;`   ++++++++++++++    ++"  ++++++    :;;;;;`    ++++++++   +++  .+++++++`' +
      '\n `;;;;;   ;;;;;;;;  ;;;;;;;   +++"  ++++` "+++   ++"  +++:::   :;;;;;;;   ;++"    .   +++  +++.   ``' +
      '\n ;;;;;;;  ;;;;;;;;  :;;;;;,   +++   .++,   +++   ++"  +++      ;;;;;;;;;  +++,        +++  +++      ' +
      '\n,;;;;;;;  :;;;;;;.   ,;;;`    +++   `++`   +++   ++"  +++     :;;;;;;;;;  `++++++:    +++  +++++++` ' +
      '\n:;;;;;;;.  ;;;;;;      .`     +++   `++`   +++   ++"  +++     ;;;;;;;;;;`  `+++++++   +++   ;+++++++' +
      '\n.;;;;;;;  ;;;;;;;;   ;;;;;    +++   `++`   +++   ++"  +++     ;;;;;;;;;;       .++++  +++       :+++' +
      '\n ;;;;;;;  ;;;;;;;;  ;;;;;;;   +++   `++`   +++   ++"  ;++:    `;;;;;;;;;         +++  +++        ;++' +
      '\n  ;;;;;   ;;;;;;;;  ;;;;;;;.  +++   `++`   +++   ++"   +++++   ;;;;;;;;.  ++";;++++,  +++  +";;"++++' +
      '\n   `,`    ;;;;;;;; .;;;;;;;:  +++   `++`   +++   ++"   ;++++    ;;;;;;,   ++++++++"   +++  ++++++++`' +
      '\n           ;;;;;;  `;;;;;;;,  +++   `++`   +++   ++"     ;+;      :;,     "+++++;     ;;;  ++++++.  ' +
      '\n            ;;;;    ;;;;;;;             ' +
      '\n                     ;;;;;`        ' +
      '\n                      .:,       ';

        this.log(name);
        this.log(`\nWelcome to the ${chalk.red('Mitosis')} generator v.1.0.0-alpha.18! (Do not use in Production) \n`);
        this.log('Documentation for creating an infrastructure: https://github.com/NirbyApp/generator-mitosis');
        this.log(`Infrastructure files will be generated in folder: ${chalk.yellow(process.cwd())}\n`);

        return this.prompt([{
            type: 'input',
            name: 'appName',
            message: '(1/8) Name of my infrastructure',
            validate: (name) => {
                if (!name) {
                    return 'Project name cannot be empty';
                }
                if (!/\w+/.test(name)) {
                    return 'Project name should only consist of 0~9, a~z, A~Z, _, .';
                }
                if (!fs.existsSync(this.destinationPath(name))) {
                    return true;
                }
                if (require('fs').statSync(this.destinationPath(name)).isDirectory()) { // eslint-disable-line
                    return 'Project already exist';
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'os',
            choices: [
                { value: 'ubuntu', name: 'Ubuntu' }
            //   ,{ value: 'centos', name:'CentOS'}
            ],
            message: '(2/8) Operating System of my infrastructure',
            default: 'ubuntu'
        },
        {
            type: 'list',
            name: 'caasMode',
            choices: [
                { value: 'swarm', name: 'Docker Swarm mode (Recommended)' },
                { value: 'k8s', name: 'Kubernetes' }
            ],
            message: '(3/8) Container cluster manager',
            default: 'swarm',
        },
        {
            type: 'checkbox',
            name: 'tools',
            choices: [
                { value: 'jenkins', name: 'Jenkins (Recommended)', checked: true },
                { value: 'artifactory', name: 'Artifactory', checked: true },
                { value: 'sonarqube', name: 'Sonarqube', checked: true },
                { value: 'viz', name: 'Viz', checked: false },
                { value: 'portainer', name: 'Portainer', checked: false },
                { value: 'elk', name: 'Elastic Stack (Elastic search, Logstash, Kibana)', checked: true },
                { value: 'traefik', name: 'Traefik', checked: true },
                { value: 'registry', name: 'Local private Docker registry', checked: false }
            ],
            message: '(4/8) I want to install',
        },
        {
            type: 'confirm',
            name: 'scheduleManager',
            message: '(5/8) Schedule the manager',
            default: true
        },
        {
            type: 'confirm',
            name: 'ownRegistry',
            message: '(6/8) Push the images to my own docker registry',
            default: false
        },
        {
            when: response => response.ownRegistry,
            type: 'input',
            name: 'docker_registry_server',
            message: 'Docker registry server',
            default: 'hub.docker.com'
        },
        {
            when: response => response.ownRegistry,
            type: 'input',
            name: 'docker_registry_username',
            message: 'Username of docker registry',
            validate: (name) => {
                if (!name) {
                    return 'Username cannot be empty';
                }
                return true;
            }
        },
        {
            when: response => response.ownRegistry,
            type: 'password',
            name: 'docker_registry_password',
            message: 'Password of docker registry',
            validate: (name) => {
                if (!name) {
                    return 'Password cannot be empty';
                }
                return true;
            }
        },
        {
            when: response => response.ownRegistry,
            type: 'input',
            name: 'docker_registry_repository_name',
            message: 'Docker repository name',
            validate: (name) => {
                if (!name) {
                    return 'Repository name cannot be empty';
                }
                return true;
            }
        },
        {
            when: response => response.tools.indexOf('jenkins') > -1,
            type: 'confirm',
            name: 'defaultMicroService',
            message: '(7/8) Deploy the defaults micro-services',
            default: true
        },
        {
            when: (response) => {
                // check if virtualbox is installed
                let virtualBoxInstalled = true;
                exec('vboxmanage --version', (err, stdout, stderr) => {
                    if (err) {
                        // this.log.error('Virtualbox is not found on your computer. Download and install : https://www.virtualbox.org/wiki/Downloads');
                        virtualBoxInstalled = false;
                    }
                });

                // check if vagrant is installed
                let vagrantInstalled = true;
                exec('vagrant --version', (err, stdout, stderr) => {
                    if (err) {
                        // this.log.error('Vagrant is not found on your computer. Download and install: https://www.vagrantup.com/docs/installation/');
                        vagrantInstalled = false;
                    }
                });

                // check if ansible is installed
                let ansibleInstalled = true;
                exec('ansible --version', (err, stdout, stderr) => {
                    if (err) {
                        // this.log.error('Ansible is not found on your computer. Download and install : http://docs.ansible.com/ansible/intro_installation.html');
                        ansibleInstalled = false;
                    }
                });

                // if all installed then suggest the question
                return virtualBoxInstalled && vagrantInstalled && ansibleInstalled;
            },
            type: 'confirm',
            name: 'initVms',
            message: '(8/8) Test my infrastructure locally in a virtual machines',
            default: false,
        },
        {
            type: 'input',
            name: 'workers',
            message: 'Number of workers',
            default: 1,
            when: response => response.initVms,
            validate: (name) => {
                if (name && !/\d+/.test(name)) {
                    return 'Worker number should only consist of 0~9';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'memoryWorkers',
            message: 'Memory of worker node (Mo)',
            default: 1024,
            when: response => response.initVms,
            validate: (name) => {
                if (name && !/\d+/.test(name)) {
                    return 'Memory should only consist of 0~9';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'memoryManager',
            message: 'Memory of cluster manager (Mo)',
            default: 2048,
            when: response => response.initVms,
            validate: (name) => {
                if (name && !/\d+/.test(name)) {
                    return 'Memory should only consist of 0~9';
                }
                return true;
            }
        }
        ]).then((answers) => {
            this.answers = answers;
            this.answers.date = new Date().format('mmm d, yyyy');
            this.obj = { answers: this.answers };
        });
    }
    configuring() {
        const done = this.async();
        fs.exists(this.destinationPath(this.answers.appName), (exists) => {
            if (exists && fs.statSync(this.destinationPath(this.answers.appName)).isDirectory()) {
                // this.log.error(`Directory [${this.answers.appName}] exists`);
                process.exit(1);
            }
            this.destinationRoot(path.join(this.destinationRoot(), this.answers.appName));
            done();
        });
    }

    writing() {
        const defaultIp = '192.168.77';
        const defaultManagerIp = '192.168.77.21';
        const workerToken = uuidV1();

        // copy vagrantfile
        this.fs.copyTpl(
            this.templatePath('_Vagrantfile'),
            this.destinationPath('Vagrantfile'),
            {
                appName: this.answers.appName,
                caasMode: this.answers.caasMode,
                memoryWorkers: this.answers.memoryWorkers ? this.answers.memoryWorkers : 1024,
                memoryManager: this.answers.memoryManager ? this.answers.memoryManager : 2048,
                os: this.answers.os,
                workers: this.answers.workers ? this.answers.workers : 2,
                ownRegistry: this.answers.ownRegistry,
                defaultIp
            }
        );

        // copy ansible hosts
        this.fs.copyTpl(
            this.templatePath('ansible/_mitosis-hosts'),
            this.destinationPath(`ansible/${this.answers.appName}-hosts`),
            {
                appName: this.answers.appName,
                os: this.answers.os,
                workers: this.answers.workers ? this.answers.workers : 2,
                defaultIp
            }
        );

        // copy ansible images
        this.fs.copyTpl(
            this.templatePath('ansible/images/_mitosis-images-playbook.yml'),
            this.destinationPath(`ansible/images/${this.answers.appName}-images-playbook.yml`),
            {
                appName: this.answers.appName,
                docker_registry_server: this.answers.docker_registry_server === 'hub.docker.com' ? '' : this.answers.docker_registry_server,
                docker_registry_username: this.answers.docker_registry_username,
                docker_registry_password: this.answers.docker_registry_password,
                docker_registry_repository_name: this.answers.docker_registry_repository_name,
                defaultMicroService: this.answers.defaultMicroService,
                defaultIp,
                ownRegistry: this.answers.ownRegistry,
                caasMode: this.answers.caasMode
            }
        );

        // copy ansible images registry
        this.fs.copyTpl(
            this.templatePath('ansible/images/_mitosis-registry-playbook.yml'),
            this.destinationPath(`ansible/images/${this.answers.appName}-registry-playbook.yml`),
            {
                appName: this.answers.appName,
                defaultMicroService: this.answers.defaultMicroService,
                defaultIp,
                caasMode: this.answers.caasMode,
                tools: this.answers.tools
            }
        );

        // copy ansible k8s
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/_mitosis-base-playbook.yml'),
            this.destinationPath(`ansible/k8s/${this.answers.appName}-base-playbook.yml`),
            {
                appName: this.answers.appName,
                os: this.answers.os,
                defaultIp
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/_mitosis-k8s-playbook.yml'),
            this.destinationPath(`ansible/k8s/${this.answers.appName}-k8s-playbook.yml`),
            {
                appName: this.answers.appName,
                defaultIp,
                workerToken
            }
        );
        // k8s roles
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-base/tasks/_main.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-base/tasks/main.yml`),
            {
                appName: this.answers.appName,
                os: this.answers.os
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-master/tasks/_main.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-master/tasks/main.yml`),
            {
                appName: this.answers.appName,
                os: this.answers.os,
                scheduleManager: this.answers.scheduleManager,
                docker_registry_repository_name: this.answers.docker_registry_repository_name,
                tools: this.answers.tools
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-worker/tasks/_main.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-worker/tasks/main.yml`),
            {
                appName: this.answers.appName
            }
        );
        // k8s networks
        this.fs.copy(
            this.templatePath('ansible/k8s/roles/mitosis-master/files/networks/_kube-flannel.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-master/files/networks/kube-flannel.yml`),
            {
                appName: this.answers.appName
            }
        );
        // k8s services
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-master/files/services/_sonarqube.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-master/files/services/sonarqube.yml`),
            {
                appName: this.answers.appName,
                docker_registry_repository_name: this.answers.docker_registry_repository_name
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-master/files/services/_traefik.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-master/files/services/traefik.yml`),
            {
                appName: this.answers.appName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-master/files/services/_artifactory.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-master/files/services/artifactory.yml`),
            {
                appName: this.answers.appName,
                docker_registry_repository_name: this.answers.docker_registry_repository_name
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-master/files/services/_jenkins.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-master/files/services/jenkins.yml`),
            {
                appName: this.answers.appName,
                docker_registry_repository_name: this.answers.docker_registry_repository_name,
                defaultMicroService: this.answers.defaultMicroService,
                defaultIp: defaultManagerIp
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/k8s/roles/mitosis-master/files/services/_namespace.yml'),
            this.destinationPath(`ansible/k8s/roles/${this.answers.appName}-master/files/services/namespace.yml`),
            {
                appName: this.answers.appName
            }
        );
        /*
        * copy ansible swarm 
        */
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/_mitosis-base-playbook.yml'),
            this.destinationPath(`ansible/swarm/${this.answers.appName}-base-playbook.yml`),
            {
                appName: this.answers.appName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/_mitosis-swarm-playbook.yml'),
            this.destinationPath(`ansible/swarm/${this.answers.appName}-swarm-playbook.yml`),
            {
                appName: this.answers.appName,
                defaultIp
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/_mitosis-services-playbook.yml'),
            this.destinationPath(`ansible/swarm/${this.answers.appName}-services-playbook.yml`),
            {
                appName: this.answers.appName,
                defaultIp
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/_mitosis-traefik-playbook.yml'),
            this.destinationPath(`ansible/swarm/${this.answers.appName}-traefik-playbook.yml`),
            {
                appName: this.answers.appName,
                defaultIp
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/_mitosis-elk-playbook.yml'),
            this.destinationPath(`ansible/swarm/${this.answers.appName}-elk-playbook.yml`),
            {
                appName: this.answers.appName,
                defaultIp
            }
        );
        /** swarm roles */
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-base/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-base/tasks/main.yml`),
            {
                appName: this.answers.appName,
                os: this.answers.os
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-common/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-common/tasks/main.yml`),
            {
                appName: this.answers.appName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-swarm-manager/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-swarm-manager/tasks/main.yml`),
            {
                appName: this.answers.appName,
                scheduleManager: this.answers.scheduleManager
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-swarm-network/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-swarm-network/tasks/main.yml`),
            {
                appName: this.answers.appName,
                tools: this.answers.tools,
                defaultMicroService: this.answers.defaultMicroService
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-services/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-services/tasks/main.yml`),
            {
                appName: this.answers.appName,
                docker_registry_repository_name: this.answers.docker_registry_repository_name,
                defaultMicroService: this.answers.defaultMicroService,
                tools: this.answers.tools
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-traefik/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-traefik/tasks/main.yml`),
            {
                appName: this.answers.appName,
                tools: this.answers.tools
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-elk/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-elk/tasks/main.yml`),
            {
                appName: this.answers.appName,
                tools: this.answers.tools
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-elk/files/elk/elasticsearch/config/_elasticsearch.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-elk/files/elk/elasticsearch/config/elasticsearch.yml`),
            {
                appName: this.answers.appName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-elk/files/elk/logstash/config/_logstash.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-elk/files/elk/logstash/config/logstash.yml`),
            {
                appName: this.answers.appName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-elk/files/elk/logstash/pipeline/_logstash.conf'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-elk/files/elk/logstash/pipeline/logstash.conf`),
            {
                appName: this.answers.appName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-elk/files/elk/kibana/config/_kibana.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-elk/files/elk/kibana/config/kibana.yml`),
            {
                appName: this.answers.appName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ansible/swarm/roles/mitosis-swarm-worker/tasks/_main.yml'),
            this.destinationPath(`ansible/swarm/roles/${this.answers.appName}-swarm-worker/tasks/main.yml`),
            {
                appName: this.answers.appName
            }
        );

        // create the vm
        if (this.answers.initVms) {
            this.spawnCommand('vagrant', ['up']);
            // vagrant dns --install
            // this.spawnCommand('vagrant', ['dns', '--install']);
            // run the DNS server:
            // this.spawnCommand('vagrant', ['dns', '--start']);
        }
    }

    end() {
        this.log.ok(`Infrastructure ${this.answers.appName} generated `);

        if (this.answers.initVms) {
            this.log.ok('Installing the virtuals machines...');
        }
    }
}

module.exports = gen;
