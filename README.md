# RHC Patient Dashboard

This dashboard shows monthly patient connectivity, agent performance, daily performance, and ITP status.

## How to update dashboard data

1. Double-click `run_dashboard_update.bat`.
2. The script automatically looks inside the current month folder, for example `Jun'26`.
3. It selects the latest Excel file with `Patient on Therapy` in the filename.
4. The script reads the `Helper` sheet and creates a JSON file inside the `data` folder.
5. The dashboard will load the latest month available in `data/months.json`.

## Important file rules

- The Excel file must contain a sheet named `Helper`.
- The Excel filename must include the month in this format: `Jun'26`.
- The monthly folder must also use this format: `Jun'26`.
- Do not manually edit JSON files unless you are correcting data.
