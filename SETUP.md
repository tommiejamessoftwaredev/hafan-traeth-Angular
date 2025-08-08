# Hafan Traeth Project Setup

## Project Structure
```
hafan-traeth-Angular/
├── frontend/hafan-traeth/    # Angular 19 frontend application
├── api/                      # Azure Functions C# backend
├── .gitignore               # Root gitignore
└── README.md
```

## Environment Setup

### Frontend Environment Files
1. Copy template files:
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
   ```

2. Update the following values:
   - `googleMapsApiKey`: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - `icalUrl`: Your Booking.com iCal URL token

### API Environment Files
1. Copy template file:
   ```bash
   cp local.settings.json.template local.settings.json
   ```

2. Update the following values:
   - `ICAL_URL`: Your Booking.com iCal URL with token

## Git Ignore Strategy

### Files Ignored for Security:
- `local.settings.json` (API secrets)
- Environment files (if they contain sensitive keys)
- All build outputs and dependencies
- IDE and system files

### Files Committed:
- Template files (`.template.ts`, `.template.json`)
- Source code
- Configuration files without secrets
- Public assets

## Development Workflow

1. **Initial Setup**: Copy template files and configure with your API keys
2. **Development**: Use actual API keys in local environment files
3. **Commit**: Only commit template files and source code
4. **Deploy**: Use production environment variables or key vaults

## Important Notes

- Never commit actual API keys or sensitive configuration
- Template files show the structure but use placeholder values
- Production should use secure key management (Azure Key Vault, etc.)
- Environment files are excluded from git if they contain real secrets