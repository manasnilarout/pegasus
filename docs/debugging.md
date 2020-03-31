<h1 align="center">Debugging</h1>

## ❯ Purpose

This document deals with setting up workspace to help debug code in Vagrant box.

## ❯ Steps to Follow

### Step 1: Adding extension

Firstly, we need to update Visual Studio Code to latest so that it supports the required extension. Currently we are working with `1.36.0` version of Visual Studio Code.

After that install `Remote-SSH` from extensions tab in Visual Studio Code.

### Step 2: Configure SSH

Get configuration for Vagrant using `vagrant ssh-config` command. Copy the content of config and run Vagrant box using `vagrant ssh` command.
Content of configuration will look something like following.

```yml
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile /home/*/.vagrant.d/boxes/*/0.0.5/virtualbox/vagrant_private_key
  IdentitiesOnly yes
  LogLevel FATAL
```

### Step 3: Update local ssh config

Add content that you copied from Vagrant config to your local ssh config file at `home/${username}/.ssh/config`.
After that you will be able to see the connection in Remote-SSH tab in Visual Studio Code.
You can click on *Connect to Host in New Window* icon, which will load content of Vagrant in new window.

### Step 4: Debugging

After you are done with previous step, you can move to the required folder and then configure `launch.json` file to debug code.

Content of `launch.json` should look something like below.

```
{
    "type": "node",
    "request": "attach",
    "name": "Pegasus Remote Debugging",
    "processId": `${ProcessID}`,
    "protocol": "inspector"
}
```

**Note:** Process ID can be found by running this command: `ps aux | grep src/app.ts` (Inside Vagrant box after starting the app)

Voila! Now put breakpoints in your code and start debugging in the remote session.

## ❯ License

Contact [Manas](mailto:manasnilarout@gmail.com)