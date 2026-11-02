# Project Guidelines & Rules: AL-IKHLAS ASSOCIATION

## 1. Automatic GitHub Push
- **Mandatory Workflow**: Every time any file in this repository is modified, updated, or created to fulfill a user request, immediately and automatically commit the changes with a concise, descriptive commit message and push to GitHub (`git push origin main`).
- Do not wait for the user to explicitly ask to push to GitHub.

## 2. Data Integrity & Sheet Accounting
- **No Self-Modifications to Central Data**: Never add, edit, or delete data records directly from Google Sheets or `config.json` unless explicitly requested by the user.
- **Admin-Only Role Changes**: Member roles (`President`, `Cashier`, `Accountant`, `Secretary`, `Member`) can only be modified by the Admin/President. Member roles must never be changed automatically or reverted.
- **Three-Tier Accounting System**:
  - `Received`: Counted strictly towards Cleared/Received Capital.
  - `In Progress` / `Credit Inflow`: Counted strictly as In-Progress amount (not counted as Received).
  - `Due`: Counted strictly as Due amount (not counted as Received).
- **Member Photo & Modal View Integrity**:
  - All statements must display the member's own uploaded photo (`renderUserAvatar`) and assigned role badge.
  - All modal dialogs must use responsive flex containment (`max-h-[94vh] flex flex-col`) with pinned header/footer buttons so action buttons are never cut off.
