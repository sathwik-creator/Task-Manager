📌 Task Manager

A fully modular and object-oriented Task Management System built using Python.
This project helps users efficiently create, manage, and track their daily tasks with features like authentication, reminders, and structured storage.

🚀 Features
🔐 User Authentication System
✅ Create, Update, Delete Tasks
📅 Due Date Management
🔔 Email Reminders (optional)
📊 Task Status Tracking (Completed / Pending)
📂 JSON-based Data Storage
🧱 Modular & Object-Oriented Design
🧪 Unit Testing using pytest
🐳 Docker Support for Deployment
🛠️ Tech Stack
Language: Python
Libraries: argparse, dotenv, pytest
Database: JSON-based storage
Tools: Docker, GitHub Actions
Concepts Used:
Object-Oriented Programming
File Handling
CLI Design
Modular Architecture
📁 Project Structure
Task-Manager/
│
├── task_manager/
│   ├── models/
│   ├── services/
│   ├── storage/
│   ├── utils/
│
├── tests/
├── sample_tasks.json
├── requirements.txt
├── dockerfile
└── README.md
⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/sathwik-creator/Task-Manager.git
cd Task-Manager
2️⃣ Install Dependencies
pip install -r requirements.txt
▶️ Usage
Run the Application
python main.py
Example Commands
# Login
task-manager login --username <username>

# Add Task
task-manager add-task --title "Complete Assignment" --due 2026-04-10

# List Tasks
task-manager list-tasks

# Mark Complete
task-manager complete-task --id <task_id>
🧪 Running Tests
pytest
🐳 Docker Setup
Build Image
docker build -t task-manager .
Run Container
docker run task-manager
📌 Future Enhancements
🌐 Web Interface (React / Flask)
🗂️ Task Categories & Tags
⏱️ Time Tracking
📱 Mobile App Integration
🔔 Push Notifications
🤝 Contributing

Contributions are welcome!

Fork the repository
Create a new branch
Commit your changes
Push and create a Pull Request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Sathwik

GitHub: https://github.com/sathwik-creator
⭐ Support

If you like this project, please ⭐ the repository and share it!
