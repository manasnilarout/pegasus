<h1 align="center">Vagrant Setup</h1>
<p align="center">
  <sub>Made with ❤️ by <a href="https://www.osmosys.asia">Osmosys Software Solutions</a></sub>
</p>

---

## ❯ Purpose

This document deals with setting up the development environment which helps the developer/programmer to start their respective work.

## ❯ Table of Contents

- [Hardware Requirement](#-hardware-requirement)
- [Prerequisites](#-prerequisites)
- [Steps to Follow](#-steps-to-follow)
- [Development Process](#-development-process)


## ❯ Hardware Requirement

- At least 8 GiB RAM total on your system, preferably 12 GiB (especially in case of windows) or more, in order to run both the host operating system and the VM. Do not attempt to run on a system with only 2 GiB RAM, it will eventually fail.
- Must have several gigabytes free on the primary drive (/home partition for Linux). Note in particular that the VM disk images will be stored under your home directory by default.
- Active network connection with sufficient bandwidth to download Ubuntu updates.

## ❯ Prerequisites

Following are the prerequisites needed to move forward to setup the development environment.

- Virtualbox (> v5.1)
- Vagrant

## ❯ Steps to Follow

### Step 1: Creating new folder

Create a new folder and an empty file in it named as Vagrantfile and place the below content.

**Note:** Version number fo Vagrant might change, so we need to keep latest version number in `config.vm.box_version` to get latest Vagrant.
You can get latest version of Vagrant from the following link.

[Latest vargrant](https://app.vagrantup.com/osmosys/boxes/node-dev)

Here, currently the latest version is `0.0.5`.

```yml
$msg = <<MSG
---------------------------------------------------------------------
Please refer the link for the documentation on using this Vagrant box -
URL:
 - Vagrant - https://www.vagrantup.com/intro/getting-started/

Please contact the following email if you have any doubts/suggestions
 - manasnilarout@gmail.com
---------------------------------------------------------------------
MSG


Vagrant.configure("2") do |config|
  config.vm.box = "osmosys/node-dev"
  config.vm.box_version = "0.0.5"
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 3306, host: 4000
  config.vm.post_up_message = $msg
  config.vm.provider "virtualbox" do |v|
    v.memory = 3560
    v.cpus = 2
  end
end
```

### Step 2: Starting Virtual Machine

Now, run the command `vagrant up`, which should fetch the image from the cloud and start a VM.

### Step 3: Adding files

All the folders/files which are in the root directory (in line with `Vagrantfile`) will be synced to the virtual machine and are located at `/vagrant` folder. Please get back to us, if you do not see this happening.

### Step 4: Login to Virtual Machine

Run the command `vagrant ssh` to login to the VM.

## ❯ Development process

Now that we have a VM running with all the software required for development, the developer doesn't have to install anything on their machines, which saves a lot of time while on-boarding anyone.

Here is the process we follow to work with API / Front-end

### Step 1: Adding `code` folder

Create a folder in the root folder (where `Vagrantfile` is located.) and name it as `code`

### Step 2: Clone Repository

Clone the repository in `code` folder and start editing the file using VS Code.

### Step 3: Running code

Login to virtual machine using `vagrant ssh` and then move to `/vagrant/code` directory. Run it there with one of the exposed ports, after which the output will be visible on the corresponding port in the host machine.

### Step 4: Adding database credentials in `.env`
In `.env`, file you have to add your database connection information. Following is credential that is needed to be update in `.env` for MySQL database.

**Username:** dev_user

**Password:** S!mba@123

### Step 5: Debugging

For help with debugging code in Vagrant, you can check the following document.

[Debugging in remote server](debugging.md)

## ❯ License

Contact [Osmosys](https://osmosys.asia/)