# node-mongodb-change-stream

To run:

    npm install
    SERVICE_BINDING_ROOT=~/bindings npm start

## Put it in a container

Build a Docker image:

    docker build -t node-mongodb-change-stream .

## Put it in OpenShift

```bash
oc new-app https://github.com/tchughesiv/rhoda-node-examples --context-dir=node-mongodb-change-stream --name=node-mongodb-change-stream --strategy=docker
```
