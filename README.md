
# PayNova

## Project Overview
Our project is designed to revolutionize financial operations by providing a secure web application that integrates advanced authentication methods with automated payroll and transaction tracking. This system enhances security, prevents fraud, and improves efficiency, making it a powerful asset for businesses of all sizes.

## Problem Solved
With increasing risks of digital fraud and inefficiencies in financial operations, our project addresses these challenges by offering secure, automated, and intelligent payment and accounting solutions.

## Key Features and Benefits
- **Advanced Security**: Multi-factor authentication, encryption, and secure API transactions.
- **Automated Payroll Processing**: Streamlined employee payments with automated tax and benefits calculations.
- **Transaction Tracking**: Real-time tracking of financial transactions for transparency.
- **User-Friendly Dashboard**: Intuitive interface for managing payments, invoices, and financial reports.
- **Integration Support**: Compatible with existing accounting software and payment gateways.

---
## OUR FLOWCHART
![image](https://github.com/user-attachments/assets/7f4bf592-f12d-4f9f-841a-a53409a920f3)

## OUR SECURITY LAYER
![image](https://github.com/user-attachments/assets/a9b6422c-be1a-4e46-8407-761818090c6a)

## Dependencies
To ensure proper functionality, the following dependencies are required:
- **Backend:** Python 3.9+, Django, Django REST Framework, PostgreSQL
- **Frontend:** React, Redux, Axios, Tailwind CSS
- **Authentication:** OAuth, JWT, Google Authenticator
- **Other:** Docker, Celery, Redis for background tasks

---

## Setup Instructions
### Step 1: Install Dependencies
Ensure Python 3.9+ is installed, then run:
```sh
pip install -r backend/requirements.txt
```
### For the frontend, navigate to the frontend directory and install dependencies:
```sh
npm install
```

### Step 2:  Configure the Environment
Create a .env file in the backend directory and configure necessary settings:
```sh
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
DEBUG=True
```
### Step 3:  Run the Application
#### Backend (Django):
```sh
python manage.py migrate
python manage.py runserver
```
#### Frontend (React):
Since npm run react command is depreciated in recent React update. So vite build tool is used.
```sh
npm run dev
```
###Future Scope
<ul>
 <li>Can be integrated with banking/payment systems for secure transactions.</li>
<li>Scalable to cloud and edge devices for real-time authentication.</li>
<li>Advanced AI-based threat detection and behavior analytics can be added.</li>
<li>Supports cross-platform and enterprise-wide deployment.</li>
<li>Potential integration with biometric wearables for multi-factor authentication.</li>
<li>Can be extended for attendance systems, smart access control, and IoT
security.</li>
<li>Modular architecture allows easy feature upgrades and customization.</li>
</ul>

### License

This project is released under the <b>MIT License</b> , allowing others to use, modify, and distribute the software under specified conditions.

### Contribution Guidelines

Contributions are welcome! To contribute:

Fork the repository.
Create a new branch ```sh(feature-branch)```.
Commit your changes.
Submit a pull request.
Ensure code quality and write tests for added features before submission.

## TEAM (CHEEKY GEEKS)
<h4>Abhishek Saxena</h4>
<h4>Gajendra Pandey</h4>
<h4>Arpan Bhowmick</h4>
<h4>Shivam</h4>
<h4>Vikas Kumar</h4>
