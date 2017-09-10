const ANSIBLE_SWARM_DIR = 'ansible/swarm';

const ansibleSwarm = {
    base: {
        playbook: `${ANSIBLE_SWARM_DIR}/mitosis-base-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-base/tasks/main.yml`
            }
        }
    },
    common: {
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-common/tasks/main.yml`
            }
        }
    },
    consul: {
        manager: {
            playbook: `${ANSIBLE_SWARM_DIR}/mitosis-consul-playbook.yml`,
            roles: {

                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-consult-manager/tasks/main.yml`
                }
            }
        },
        worker: {
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-consult-worker/tasks/main.yml`
                }
            }
        }
    },
    elk: {
        playbook: `${ANSIBLE_SWARM_DIR}/mitosis-elk-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-elk/tasks/main.yml`
            },
            files: {
                elasticsearch: {
                    config: `${ANSIBLE_SWARM_DIR}/roles/mitosis-elk/files/elk/elasticsearch/config/elasticsearch.yml`
                },
                kibana: {
                    config: `${ANSIBLE_SWARM_DIR}/roles/mitosis-elk/files/elk/kibana/config/kibana.yml`
                },
                logstash: {
                    config: `${ANSIBLE_SWARM_DIR}/roles/mitosis-elk/files/elk/logstash/config/logstash.yml`,
                    pipeline: `${ANSIBLE_SWARM_DIR}/roles/mitosis-elk/files/elk/logstash/pipeline/logstash.conf`
                }
            }
        }
    },
    services: {
        playbook: `${ANSIBLE_SWARM_DIR}/mitosis-services-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-services/tasks/main.yml`
            }
        }
    },
    swarm: {
        manager: {
            playbook: `${ANSIBLE_SWARM_DIR}/mitosis-swarm-playbook.yml`,
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-swarm-manager/tasks/main.yml`
                }
            }
        },
        network: {
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-swarm-network/tasks/main.yml`
                }
            }
        },
        worker: {
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-swarm-worker/tasks/main.yml`
                }
            }
        }
    },
    traefik: {
        playbook: `${ANSIBLE_SWARM_DIR}/mitosis-traefik-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/mitosis-traefik/tasks/main.yml`
            }
        }
    },
    requirements: {
        default: `${ANSIBLE_SWARM_DIR}/requirements.yml`
    }
};

module.exports = ansibleSwarm;
