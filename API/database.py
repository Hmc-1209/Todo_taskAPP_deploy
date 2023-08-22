from sshtunnel import SSHTunnelForwarder
import databases
import config

# In case someday the API and the database are in different server
server = SSHTunnelForwarder(
    ('122.116.20.182', 22),
    ssh_username=config.ssh_username,
    ssh_password=config.ssh_password,
    remote_bind_address=('localhost', 3306)
)

server.start()
DATABASE_URL = f"mysql+asyncmy://Todo_taskApp_user:{config.db_password}@localhost:{str(server.local_bind_port)}/Todo_taskAPP"

db = databases.Database(DATABASE_URL)