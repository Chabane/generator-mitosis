const ansible_swarm = require('./ansible-swarm');
const ansible_k8s = require('./ansible-k8s');
const ansible_images = require('./ansible-images');
const ANSIBLE_DIR = 'ansible';

const expectedFiles = {
    ansible: {
        images: ansible_images,
        k8s: ansible_k8s,
        swarm: ansible_swarm,
        hosts: {
            default: `${ANSIBLE_DIR}/mitosis-hosts`
        }
    },
    vagrant: {
        default: 'Vagrantfile'
    }
};

module.exports = expectedFiles;
