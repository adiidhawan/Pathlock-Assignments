Phase 1 README — pm-api (macOS)

Prereqs (free):
- .NET 8 SDK (download from Microsoft). Homebrew alternative also available.
- sqlite3 (usually preinstalled on macOS; optional)
- VS Code (you said it’s installed)
- Git (optional)

1) Install .NET 8 SDK (macOS)
- Direct download installer from Microsoft (.pkg). If you prefer Homebrew:
  brew install --cask dotnet-sdk
- Verify:
  dotnet --version
  (should print 8.x.x)

2) Install dotnet-ef tool (global)
  dotnet tool install --global dotnet-ef --version 8.0.0
  # if already installed, update:
  dotnet tool update --global dotnet-ef

3) Clone / create project directory
  cd ~/dev
  git clone <your-repo> pm-api || mkdir pm-api && cd pm-api
  # create files as provided

4) Configure environment variables (macOS)
  export JWT_SECRET="replace_with_a_long_random_secret_32_plus_chars"
  export ASPNETCORE_ENVIRONMENT=Development

  (You can add these to ~/.zshrc or ~/.bash_profile)

5) Restore and build
  cd pm-api
  dotnet restore
  dotnet build

6) Add EF migration and update DB
  # from project root (pm-api/)
  dotnet ef migrations add InitialCreate
  dotnet ef database update
  # This creates the SQLite file pm.db by default.

7) Run the app
  dotnet run

  By default Kestrel will run on https://localhost:7010 (port may vary). Console shows the actual url.

8) Swagger UI (development)
  Open browser: https://localhost:7010/swagger

Testing with curl (replace port if different):

1) Register
curl -k -X POST https://localhost:7010/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"email":"adi@example.com","password":"Password123","fullName":"Adi"}'

Expected: 201 created with user id/email

2) Login
curl -k -X POST https://localhost:7010/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"adi@example.com","password":"Password123"}'

Expected: 200 with JSON { "token": "..." }

3) Use token to access protected endpoint
curl -k -X GET https://localhost:7010/api/projects \
 -H "Authorization: Bearer <token-from-login>"

Expected: 200 with []

4) Unauthenticated access should be 401
curl -k -X GET https://localhost:7010/api/projects

Expected: 401 Unauthorized

Troubleshooting:
- If migration fails: ensure dotnet-ef corresponds to SDK version (8.x).
- If JWT secret missing: set JWT_SECRET env var; server prints error guidance.
- Mac firewall or TLS: `-k` in curl bypasses TLS verification for localhost if using self-signed Kestrel cert. Use browser and accept cert or run with HTTP if you prefer by changing launch settings (not shown here).
