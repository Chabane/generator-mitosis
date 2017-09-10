const ANSIBLE_IMAGES_DIR = 'ansible/images';

const ansibleImages = {
    default: {
        playbook: `${ANSIBLE_IMAGES_DIR}/mitosis-images-playbook.yml`
    },
    registry: {
        playbook: `${ANSIBLE_IMAGES_DIR}/mitosis-registry-playbook.yml`,
        k8s: {
            script: `${ANSIBLE_IMAGES_DIR}/registry/port-forward.sh`,
            files: {
                daemon: `${ANSIBLE_IMAGES_DIR}/registry/k8s/registry-daemon.yml`,
                default: `${ANSIBLE_IMAGES_DIR}/registry/k8s/registry.yml`,
                pvc: `${ANSIBLE_IMAGES_DIR}/registry/k8s/registry-pvc.yml`,
                rc: `${ANSIBLE_IMAGES_DIR}/registry/k8s/registry-rc.yml`,
                svc: `${ANSIBLE_IMAGES_DIR}/rregistry/k8s/registry-svc.yml`
            }
        }
    }
};

module.exports = ansibleImages;
