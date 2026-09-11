# Ensures a local PostgreSQL is running and fishyfinds_db exists.
# Uses a user-owned data directory because the system cluster under
# "C:\Program Files\PostgreSQL\16\data" is empty/broken on this machine.

$ErrorActionPreference = "Stop"
$PgBin = "C:\Program Files\PostgreSQL\16\bin"
$DataDir = Join-Path $env:USERPROFILE "pgdata\fishyfinds"
$LogFile = Join-Path $DataDir "server.log"
$Psql = Join-Path $PgBin "psql.exe"
$Initdb = Join-Path $PgBin "initdb.exe"
$PgCtl = Join-Path $PgBin "pg_ctl.exe"

if (-not (Test-Path $PgBin)) {
  throw "PostgreSQL 16 not found at $PgBin"
}

# Prefer already-running server on 5432
$running = $false
try {
  & $Psql -U postgres -h 127.0.0.1 -d postgres -c "SELECT 1" 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { $running = $true }
} catch {}

if (-not $running) {
  if (-not (Test-Path (Join-Path $DataDir "PG_VERSION"))) {
    New-Item -ItemType Directory -Force -Path $DataDir | Out-Null
    Write-Host "Initializing new cluster at $DataDir ..."
    & $Initdb -D $DataDir -U postgres --auth=trust --encoding=UTF8 --locale=C
    if ($LASTEXITCODE -ne 0) { throw "initdb failed" }
  }

  Write-Host "Starting PostgreSQL from $DataDir ..."
  & $PgCtl -D $DataDir -l $LogFile start
  if ($LASTEXITCODE -ne 0) {
    # maybe already started
    & $PgCtl -D $DataDir status
  }
  Start-Sleep -Seconds 2
}

$env:PGPASSWORD = ""
$exists = & $Psql -U postgres -h 127.0.0.1 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='fishyfinds_db'"
if ($exists -ne "1") {
  Write-Host "Creating database fishyfinds_db ..."
  & $Psql -U postgres -h 127.0.0.1 -d postgres -c "CREATE DATABASE fishyfinds_db;"
}

$userExists = & $Psql -U postgres -h 127.0.0.1 -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='root'"
if ($userExists -ne "1") {
  Write-Host "Creating role root / root ..."
  & $Psql -U postgres -h 127.0.0.1 -d postgres -c "CREATE USER root WITH PASSWORD 'root' SUPERUSER;"
} else {
  & $Psql -U postgres -h 127.0.0.1 -d postgres -c "ALTER USER root WITH PASSWORD 'root' SUPERUSER;"
}

& $Psql -U postgres -h 127.0.0.1 -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE fishyfinds_db TO root;"
& $Psql -U root -h 127.0.0.1 -d fishyfinds_db -c "SELECT current_database(), current_user;"

Write-Host "Ready: jdbc:postgresql://localhost:5432/fishyfinds_db (root/root)"
Write-Host "Schema+seed load on next: mvnw spring-boot:run"
