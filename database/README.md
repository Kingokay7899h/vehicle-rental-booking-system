Database Setup
This folder contains database schema, migrations, and seed data for the vehicle rental system.
Files

schema.sql - Database table structure
migrations/ - Database migration files
seeds/ - Initial data for vehicle types and models

Setup Instructions

Create database: CREATE DATABASE vehicle_rental;
Run migrations to create tables
Run seed scripts to populate initial data

Database Design

vehicle_types - Categories (hatchback, suv, sedan, cruiser, sports)
vehicles - Specific models for each type
bookings - User booking records with date validation
