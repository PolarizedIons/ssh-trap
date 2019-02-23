# SSH Trap
It is a fake ssh server that sends the bee movie script to anyone that tries running a command

## Why 
Because reasons (also it's funny)

## Installation
```bash
# Install node dependancies 
yarn install
# Generate host key for ssh server
openssl genrsa -out host.key 2048
```

Then `yarn start`. It will run on port 2222 by default, but you can pass in the `PORT` enviroment variable to change that. 

You can edit `motd.txt` or `trap.txt` if you want. 