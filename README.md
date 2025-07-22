## DB Interactions

### Container

`podman ps`

`podman exec -it <container-id> bin/bash`

### Mongo DB

`mongosh`

`mongosh "mongodb://localhost:27017/luli"`

`use luli`

`show collections`

`db.luli.find()`

`db.luli.find().pretty()`
