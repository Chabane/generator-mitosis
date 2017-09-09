'use strict';
/* global describe, beforeEach, it */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fse = require('fs-extra');

const expectedFiles = require('./utils/expected-files');

describe('Simple infrastructure', () => {
    describe('Default generation', () => {
        beforeEach((done) => {
            helpers
                .run(require.resolve('../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates/default/'), dir);
                })
                .withOptions({ skipChecks: true })
                .withPrompts({
                    appName: 'mitosis',
                    os: 'ubuntu',
                    caasMode: 'swarm',
                    tools: [
                        'jenkins',
                        'artifactory',
                        'sonarqube',
                        'elk',
                        'traefik'
                    ],
                    scheduleManager: true,
                    ownRegistry: false,
                    defaultMicroService: true,
                    initVms: false
                })
                .on('end', done);
        });

        it('creates expected files for default generation - Vagrantfile', () => {
            assert.file(expectedFiles.vagrant.default);
        });

        it('creates expected files for default generation - Ansible - Hosts', () => {
            assert.file(expectedFiles.ansible.hosts.default);
        });

        it('creates expected files for default generation - Ansible - Swarm', () => {
            // swarm - base
            assert.file(expectedFiles.ansible.swarm.base.playbook);
            assert.file(expectedFiles.ansible.swarm.base.roles.tasks.main);

            // swarm - common
            assert.file(expectedFiles.ansible.swarm.common.roles.tasks.main);

            // swarm - consul - manager
            assert.noFile(expectedFiles.ansible.swarm.consul.manager.playbook);
            assert.noFile(expectedFiles.ansible.swarm.consul.manager.roles.tasks.main);

            // swarm - consul - worker
            assert.noFile(expectedFiles.ansible.swarm.consul.worker.roles.tasks.main);

            // swarm - elk
            assert.file(expectedFiles.ansible.swarm.elk.playbook);
            assert.file(expectedFiles.ansible.swarm.elk.roles.files.elasticsearch.config);
            assert.file(expectedFiles.ansible.swarm.elk.roles.files.kibana.config);
            assert.file(expectedFiles.ansible.swarm.elk.roles.files.logstash.config);
            assert.file(expectedFiles.ansible.swarm.elk.roles.files.logstash.pipeline);

            // swarm - services
            assert.file(expectedFiles.ansible.swarm.services.playbook);
            assert.file(expectedFiles.ansible.swarm.services.roles.tasks.main);

            // swarm - default
            assert.file(expectedFiles.ansible.swarm.swarm.manager.playbook);
            assert.file(expectedFiles.ansible.swarm.swarm.manager.roles.tasks.main);
            assert.file(expectedFiles.ansible.swarm.swarm.network.roles.tasks.main);
            assert.file(expectedFiles.ansible.swarm.swarm.worker.roles.tasks.main);

            // swarm - traefik
            assert.file(expectedFiles.ansible.swarm.traefik.playbook);
            assert.file(expectedFiles.ansible.swarm.traefik.roles.tasks.main);
        });


        it('creates expected files for default generation - Ansible - K8S', () => {
            // k8S - base
            assert.file(expectedFiles.ansible.k8s.base.playbook);
            assert.file(expectedFiles.ansible.k8s.base.roles.tasks.main);

            // k8S - master
            assert.file(expectedFiles.ansible.k8s.master.playbook);
            assert.file(expectedFiles.ansible.k8s.master.roles.tasks.main);
            assert.file(expectedFiles.ansible.k8s.master.roles.files.networks.flannel);
            assert.file(expectedFiles.ansible.k8s.master.roles.files.services.artifactory);
            assert.file(expectedFiles.ansible.k8s.master.roles.files.services.jenkins);
            assert.file(expectedFiles.ansible.k8s.master.roles.files.services.namespace);
            assert.file(expectedFiles.ansible.k8s.master.roles.files.services.sonarqube);
            assert.file(expectedFiles.ansible.k8s.master.roles.files.services.traefik);

            // k8S - worker
            assert.file(expectedFiles.ansible.k8s.worker.roles.tasks.main);
        });

        it('creates expected files for default generation - Ansible - Images', () => {
            // Images
            assert.file(expectedFiles.ansible.images.default.playbook);

            // Registry
            assert.file(expectedFiles.ansible.images.registry.playbook);
            assert.noFile(expectedFiles.ansible.images.registry.k8s.script);
            assert.noFile(expectedFiles.ansible.images.registry.k8s.files.daemon);
            assert.noFile(expectedFiles.ansible.images.registry.k8s.files.default);
            assert.noFile(expectedFiles.ansible.images.registry.k8s.files.pvc);
            assert.noFile(expectedFiles.ansible.images.registry.k8s.files.rc);
            assert.noFile(expectedFiles.ansible.images.registry.k8s.files.svc);
        });
    });
});
