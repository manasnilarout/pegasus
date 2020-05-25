module.exports = {
    apps: [{
        name: 'pegasus-server',
        script: 'index.js',
        watch: '.'
    }],

    deploy: {
        production: {
            user: 'manas',
            host: 'SSH_HOSTMACHINE',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy': 'yarn install && pm2 reload ecosystem.config.js,
      'pre-setup': ''
        }
    }
};
