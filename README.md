<<<<<<< HEAD

# aerocore

# Advance Airline Booking System

To start the project -
docker compose up --build

Perticular service watch -
docker compose logs -f <service_name>

Execute on container -
docker compose exec <service_name> <command>

Migrations -

1. docker compose exec auth-service npx drizzle-kit generate
2. docker compose exec auth-service npx drizzle-kit migrate

==============================================================

Verify -

1. docker compose exec auth-db psql -U postgres -d auth_db
2. \dt
   > > > > > > > 7b9a9f3 (First commit with Docker setup)
