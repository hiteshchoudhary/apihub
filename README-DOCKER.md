
### 📦 Using Docker (recommended)

To run the FreeAPI project, follow these steps:

1. Install [Docker] & [Docker-Compose](https://www.docker.com/) on your machine.
2. Clone the project repository.
3. Navigate to the project directory.
4. Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials. (Do same in chat-app and todo-app dir)
5. Run the Docker Compose command:

```bash
docker-compose -f docker-compose-full.yaml up # run conatiner in foreground
docker-compose -f docker-compose-full.yaml up -d # run conatainer in background
```
>> NOTE - if you dont want any of the container in the docker-compose file feel free to comment the whole section of that conatiner.
 

6. Access the project APIs at the specified endpoints. (ports are mentioned in the docker-compose.yaml file for all the applications)