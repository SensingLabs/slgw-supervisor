# slgw-supervisor

## Requirement

* [node](https://nodejs.org/) stable use [nvm](https://github.com/nvm-sh/nvm) for better version management
* a local [mongodb](https://www.mongodb.com/download-center/community) server

## Project setup
```
$ yarn install
```

## Project Run
Launch a local server 
```
$ node server
```
Open in browser : [http://localhost:9999](http://localhost:9999).
On first run, you need to configure a mqtt broker and topic.
Your SLGateways must be configured with the same settings, you can use "send a status" button to see the gateway on the supervisor
