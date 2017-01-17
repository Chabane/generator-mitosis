# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'getoptlong'

VAGRANTFILE_API_VERSION = "2"
MANAGERS = 1
WORKERS = 1

opts = GetoptLong.new(
  ##
  # Native Vagrant options
     [ '--force', '-f', GetoptLong::NO_ARGUMENT ],
     [ '--provision', '-p', GetoptLong::NO_ARGUMENT ],
     [ '--provision-with', GetoptLong::NO_ARGUMENT ],
     [ '--provider', GetoptLong::OPTIONAL_ARGUMENT ],
     [ '--help', '-h', GetoptLong::NO_ARGUMENT ],
     [ '--check', GetoptLong::NO_ARGUMENT ],
     [ '--logout', GetoptLong::NO_ARGUMENT ],
     [ '--token', GetoptLong::NO_ARGUMENT ],
     [ '--disable-http', GetoptLong::NO_ARGUMENT ],
     [ '--http', GetoptLong::NO_ARGUMENT ],
     [ '--https', GetoptLong::NO_ARGUMENT ],
     [ '--ssh-no-password', GetoptLong::NO_ARGUMENT ],
     [ '--ssh', GetoptLong::NO_ARGUMENT ],
     [ '--ssh-port', GetoptLong::NO_ARGUMENT ],
     [ '--ssh-once', GetoptLong::NO_ARGUMENT ],
     [ '--host', GetoptLong::NO_ARGUMENT ],
     [ '--entry-point', GetoptLong::NO_ARGUMENT ],
     [ '--plugin-source', GetoptLong::NO_ARGUMENT ],
     [ '--plugin-version', GetoptLong::NO_ARGUMENT ],
     [ '--debug', GetoptLong::NO_ARGUMENT ],

    ## custom options

    ['--caas-mode', GetoptLong::OPTIONAL_ARGUMENT],
    ['--workers', GetoptLong::OPTIONAL_ARGUMENT]
)

caasModeParameter='swarm'

opts.each do |opt, arg|
  case opt
    when '--caas-mode'
      caasModeParameter=arg
     when '--workers'
      WORKERS=arg  
  end
end



Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "ubuntu/xenial64"

  config.vm.provider 'virtualbox' do |v|
    v.linked_clone = true if Vagrant::VERSION =~ /^1.8/
  end

  config.ssh.insert_key = false

  (1..MANAGERS).each do |manager_id|
    config.vm.define "mitosis-manager#{manager_id}" do |manager|
      manager.vm.hostname = "mitosis-manager#{manager_id}"
      manager.ssh.forward_agent = true
      manager.ssh.insert_key = true
      manager.vm.network "private_network", ip: "192.168.77.#{20+manager_id}"
      manager.vm.provider "virtualbox" do |v|
        v.memory = 2048
        v.name = "mitosis-manager#{manager_id}"
      end
    end
  end

  (1..WORKERS).each do |worker_id|
    config.vm.define "mitosis-worker#{worker_id}" do |worker|
      worker.vm.hostname = "mitosis-worker#{worker_id}"
      worker.ssh.forward_agent = true
      worker.ssh.insert_key = true
      worker.vm.network "private_network", ip: "192.168.77.#{30+worker_id}"
      worker.vm.provider "virtualbox" do |v|
        v.memory = 1024
        v.name = "mitosis-worker#{worker_id}"
      end

      # Only execute once the Ansible provisioner,
      # when all the workers are up and ready.
      if worker_id == WORKERS

        # Install any ansible galaxy roles
#        system("ansible-galaxy install -r ansible/requirements.yml -p roles --ignore-errors")

        if caasModeParameter == "swarm"
            worker.vm.provision "base", type: "ansible" do |ansible|
              ansible.playbook = "ansible/swarm/mitosis-base-playbook.yml"
              ansible.raw_arguments = ["--inventory=ansible/mitosis-hosts"]
              ansible.verbose = "vv"
              ansible.limit = "all"
            end

            worker.vm.provision "swarm", type: "ansible" do |ansible|
              ansible.playbook = "ansible/swarm/mitosis-swarm-playbook.yml"
              ansible.raw_arguments = ["--inventory=ansible/mitosis-hosts"]
              ansible.verbose = "vv"
              ansible.limit = "all"
            end

            worker.vm.provision "services", type: "ansible" do |ansible|
              ansible.playbook = "ansible/swarm/mitosis-services-playbook.yml"
              ansible.raw_arguments = ["--inventory=ansible/mitosis-hosts"]
              ansible.verbose = "vv"
              ansible.limit = "all"
            end
        end

        if caasModeParameter == "k8s"
            worker.vm.provision "base", type: "ansible" do |ansible|
              ansible.playbook = "ansible/k8s/mitosis-base-playbook.yml"
              ansible.raw_arguments = ["--inventory=ansible/mitosis-hosts"]
              ansible.verbose = "vv"
              ansible.limit = "all"
            end

            worker.vm.provision "k8s", type: "ansible" do |ansible|
              ansible.playbook = "ansible/k8s/mitosis-k8s-playbook.yml"
              ansible.raw_arguments = ["--inventory=ansible/mitosis-hosts"]
              ansible.verbose = "vv"
              ansible.limit = "all"
            end

        end
      end
    end
  end
end

