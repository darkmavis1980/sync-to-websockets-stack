# Simple sync to websockets stack

This is an example on how to communicate from your server side code written in PHP, Python, other, to a websocket server via Redis.

## Docker

### Using the Dockerfile only

Build the container first:

```bash
docker build -t websockets-sample .
```

Run the container:

```bash
docker run --name websockets --rm -d -p 9100:9100 websockets-sample
```

Run the container and mount a volume:

```bash
docker run -v /host/directory:/container/directory --name websockets --rm -d -p 9100:9100 websockets-sample
```

> Note: the `--rm` flag automatically removes the container when it exits, so you just need to stop it and not to remove it manually, more info [here](https://docs.docker.com/engine/reference/run/#clean-up---rm)

Use the bash shell of the container:

```bash
docker exec -t -i websockets /bin/bash
```

Stop the container:

```bash
docker stop websockets
```

#### Good to know

Get the list of the containers:

```bash
# Get the list of the containers for the current project
docker ps

# Get the list of all containers
docker ps -a

# Get only the last container created
docker ps -al
```

Remove the container for the project:

```bash
# show all the container to find the <CONTAINER ID>
docker ps -a
# use the container id <CONTAINER ID> for the pricing-ui to remove it from the active containers
docker rm <CONTAINER ID>
```

### Using docker-compose

To start the server, and it's the first run, you need to build it first with:

```bash
docker-compose build
```

And then you can simply start it with:

```bash
docker-compose up
```

To access to the console of each container, you can run this command:

```bash
// access to the web container
$ docker-compose exec web /bin/bash

// access to the mongo container
$ docker-compose exec mongo /bin/bash
```

> Be aware that before you can start the server properly, you will need to install **npm dependencies** with `npm install`, and after you start it with **docker-compose** you will need to access to the mongo instance, add a user to the database you want to use, and then update the `config/docker.json` file (if you don't have it, just copy the `config/docker.sample.json` file).

---

### PM2 commands

PM2 has some handy commands to monitoring the server status, these ones are the most common, but you can type `sudo pm2 --help` to get the full list.

- `pm2 update` - Refresh and reload the current active instances
- `pm2 status` - It shows the current status of the PM2 instances
- `pm2 logs` - It shows the last 10 lines of each logs and a live stream of the logs generated in real time.
- `pm2 start <app.js> -i 0 --name "<app name>"` - Start an app using all CPUs available + set a name
- `pm2 stop <app name>` - Stops the app passed
- `pm2 delete <app name>` - Delete the passed app from PM2
- `pm2 start <app.js> -i <number of instances>` - Create an N number of instances for the server you want to start and activate a load balancer for it

---