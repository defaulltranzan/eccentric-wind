# Local Development & Ports Configuration

## Two Distinct Projects on Localhost:
1. **Himalayan Magic Adventure** (this workspace `C:\Users\00\Desktop\HimalayN_`)
   - **Port**: `8000` ONLY (`http://localhost:8000`)
   - Started via `npm start` or `node --env-file-if-exists=.env server.js`

2. **Kathmandu Photography Institute** (`C:\Users\00\Desktop\KPI`)
   - **Port**: `5100` ONLY (`http://localhost:5100`)
   - Standalone project with its own zero-dependency `server.js` located in `C:\Users\00\Desktop\KPI`
   - Started via `npm run dev` or `node server.js` inside `C:\Users\00\Desktop\KPI`

**RULE**: Never bind Himalayan Magic Adventure to port 5100, and never mix the two projects.
