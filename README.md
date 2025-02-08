# Setting Up the Project with Docker

Before you start the server, **you need to set up the SQL database first.**

## Prerequisites
Make sure you have the following installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js (LTS)](https://nodejs.org/)
- MySQL (or a compatible database server)

## Setting Up the Database
Before starting the server, the database must be initialized.

1. Open MySQL and create a new database:
   ```sql
   CREATE DATABASE dtbs;
   ```
2. Import the provided SQL file (`dtbs.sql`):
   ```sh
   mysql -u root -p dtbs < dtbs.sql
   ```

## Setting Up the Environment Variables
Create a `.env` file in the root directory and add the following:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=dtbs
SESSION_SECRET=your_secret_key_here
```
Adjust the database credentials if needed.

## Running the Server
```sh
# Install dependencies
npm install

# Start the server
npm start
```
This starts the backend and serves the application.

## Accessing the Application
Once the server is running, open your browser and navigate to:
```
http://localhost:8080
```

## 🛠️ Troubleshooting
### Database Connection Issues
- Ensure MySQL is running and accessible.
- Check `.env` database credentials.
- Verify that `dtbs.sql` was imported correctly.

### Docker Issues
- Run `docker ps` to check running containers.
- If a port conflict occurs, modify the ports in `docker-compose.yml`.

### Application Not Loading
- Check the logs: `docker-compose logs -f`
- Ensure the backend server is running: `npm start`

---

## Developer Notes
### **Google Login Issue**
If login with Google is not working, it is because that email isn't registered in the database yet. Try signing up with the email before attempting to log in.


