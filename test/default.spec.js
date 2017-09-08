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
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, './templates'), dir);
                })
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
                    initVms: true,
                    workers: 1,
                    memoryWorkers: 1024,
                    memoryManager: 2048
                })
                .on('end', done);
        });
    });   

    it('creates expected files for default generation', () => {
        assert.file(expectedFiles.ansible.swarm.base.playbook);
    }); 
});
