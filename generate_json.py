import json
import os
import re
from openpyxl import load_workbook
from tkinter import Tk
from tkinter.filedialog import askopenfilename

# Hide Tkinter window
Tk().withdraw()

# Select Excel file
file_path = askopenfilename(
    title="Select Patient on Therapy Excel File",
    filetypes=[("Excel Files", "*.xlsx")]
)

if not file_path:
    print("No file selected.")
    exit()

# Open workbook
wb = load_workbook(file_path, data_only=True)

# Open Helper sheet
ws = wb["Helper"]

# Read KPI row (Row 8)

kpi = {
    "totalPatients": ws["B8"].value,
    "connected": ws["C8"].value,
    "notConnected": ws["D8"].value,
    "inactive": ws["E8"].value,
    "denied": ws["F8"].value,
    "pending": ws["G8"].value,
    "callableLeads": ws["H8"].value,
    "connectivity": ws["I8"].value
}

print("\nKPI DATA\n")
for key, value in kpi.items():
    print(f"{key}: {value}")

print("\nAGENT DATA\n")

agents = {}

for row in range(2, 8):

    agent_name = ws[f"A{row}"].value

    agents[agent_name.lower()] = {
    "connected": ws[f"C{row}"].value,
    "notConnected": ws[f"D{row}"].value,
    "inactive": ws[f"E{row}"].value,
    "denied": ws[f"F{row}"].value,
    "pending": ws[f"G{row}"].value,
    "callableLeads": ws[f"H{row}"].value,
    "connectivity": round((ws[f"C{row}"].value / ws[f"H{row}"].value) * 100, 2)
}

for agent, data in agents.items():
    print(agent, data)

    print("\nTREND DATA\n")

trend = {}

for row in range(2, 8):

    agent_name = ws[f"A{row}"].value

    trend[agent_name.lower()] = round(
        ws[f"I{row}"].value * 100,
        2
    )

print(trend)

print("\nDAILY PERFORMANCE\n")

daily_performance = {
    "connected": [],
    "notConnected": []
}

for row in range(2, 8):

    daily_performance["connected"].append(
        ws[f"M{row}"].value
    )

    daily_performance["notConnected"].append(
        ws[f"N{row}"].value
    )

print(daily_performance)

print("\nITP DATA\n")

itp = {
    "connected": [],
    "pending": []
}

for row in range(2, 8):

    itp["connected"].append(
        ws[f"S{row}"].value
    )

    itp["pending"].append(
        ws[f"U{row}"].value
    )

print(itp)

dashboard_data = {
    "totalPatients": kpi["totalPatients"],
    "connected": kpi["connected"],
    "notConnected": kpi["notConnected"],
    "inactive": kpi["inactive"],
    "denied": kpi["denied"],
    "pending": kpi["pending"],
    "callableLeads": kpi["callableLeads"],
    "connectivity": kpi["connectivity"],

    "agents": agents,

    "trend": trend,

    "dailyPerformance": daily_performance,

    "itp": itp
}

print("\nDASHBOARD JSON\n")
print(dashboard_data)

# Get filename

excel_name = os.path.basename(file_path)

# Extract Jun'26

match = re.search(r"([A-Za-z]{3})'(\d{2})", excel_name)

if match:

    month_name = match.group(1)
    year = match.group(2)

    json_file_name = f"{month_name}{year}.json"

    output_path = os.path.join(
        "data",
        json_file_name
    )

    with open(output_path, "w") as f:

        json.dump(
            dashboard_data,
            f,
            indent=4
        )

    print(f"\nJSON Created: {output_path}")

else:

    print(
        "Could not determine month from filename."
    )