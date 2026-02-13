# PawWalks

Dog walking management system.

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [SQL Server LocalDB](https://learn.microsoft.com/sql/database-engine/configure-windows/sql-server-express-localdb) or SQL Server

## Initial Setup

### 1. Clone the repository

```bash
git clone https://github.com/edelCustodio/PawWalks.git
cd PawWalks
```

### 2. Configure the Database

The application is configured to use SQL Server LocalDB by default. The connection string is located in `PawWalks.Api/appsettings.json`:

```json
"ConnectionStrings": {
  "PawWalksDb": "Server=(localdb)\\mssqllocaldb;Database=PawWalksDb;Trusted_Connection=true;TrustServerCertificate=true;"
}
```

**Note:** Migrations are applied automatically when the application starts, no additional commands needed.

### 3. Install Frontend Dependencies

```bash
cd PawWalks.ClientApp
npm install
```

## Running the Application

### Backend (.NET API)

From the project root:

```bash
cd PawWalks.Api
dotnet run
```

The API will be available at: **https://localhost:7025**

Swagger UI: **https://localhost:7025/swagger**

### Frontend (Angular)

In another terminal, from the project root:

```bash
cd PawWalks.ClientApp
npm start
```

The web application will be available at: **http://localhost:4210**

## Accessing the Application

Once both servers are running:

1. Open your browser at **http://localhost:4210**
2. The application will automatically connect to the backend on port 7025

## Troubleshooting

### Database connection error

If you have issues with LocalDB, you can verify it's installed:

```bash
sqllocaldb info
```

To create a LocalDB instance:

```bash
sqllocaldb create MSSQLLocalDB
sqllocaldb start MSSQLLocalDB
```

### Port in use

If port 7025 or 4210 is already in use, you can change them:

- **Backend**: Modify the `--urls` parameter when running `dotnet run`
- **Frontend**: Modify the port in `PawWalks.ClientApp/angular.json` (look for `"port": 4210`)

### Migrations not applying

If migrations don't apply automatically, you can run them manually:

```bash
cd PawWalks.Api
dotnet ef database update
```
