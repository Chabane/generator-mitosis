const ANSIBLE_K8S_DIR = 'ansible/k8s';

const ansible_k8s = {
    base: {
        playbook: `${ANSIBLE_K8S_DIR}/mitosis-base-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_K8S_DIR}/roles/mitosis-base/tasks/main.yml`
            }
        }
    },
    master: {
        playbook: `${ANSIBLE_K8S_DIR}/mitosis-k8s-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_K8S_DIR}/roles/mitosis-master/tasks/main.yml`
            },
            files: {
                networks: {
                    flannel: `${ANSIBLE_K8S_DIR}/roles/mitosis-master/files/networks/kube-flannel.yml`
                },
                services: {
                    artifactory: `${ANSIBLE_K8S_DIR}/roles/mitosis-master/files/services/artifactory.yml`,
                    jenkins: `${ANSIBLE_K8S_DIR}/roles/mitosis-master/files/services/jenkins.yml`,
                    namespace: `${ANSIBLE_K8S_DIR}/roles/mitosis-master/files/services/namespace.yml`,
                    sonarqube: `${ANSIBLE_K8S_DIR}/roles/mitosis-master/files/services/sonarqube.yml`,
                    traefik: `${ANSIBLE_K8S_DIR}/roles/mitosis-master/files/services/traefik.yml`
                }
            }
        }
    },
    worker: {
        roles: {
            tasks: {
                main: `${ANSIBLE_K8S_DIR}/roles/mitosis-worker/tasks/main.yml`
            }
        }
    }
};

module.exports = ansible_k8s;
