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

    print("\nHELPER SHEET DATA\n")

for row in range(1, 25):
    values = []

    for col in range(1, 10):
        values.append(ws.cell(row=row, column=col).value)

    print(values)