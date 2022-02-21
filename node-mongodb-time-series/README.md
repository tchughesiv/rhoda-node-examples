# node-mongodb-time-series

To run:

    npm install
    SERVICE_BINDING_ROOT=~/bindings npm start

## Put it in a container

Build a Docker image:

    docker build -t node-mongodb-time-series .

## Put it in OpenShift

```bash
oc new-app https://github.com/tchughesiv/rhoda-node-examples --context-dir=node-mongodb-time-series --name=node-mongodb-time-series --strategy=docker
```
