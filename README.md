
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

## Tech Stacks used

| **Frontend**     | **Backend**       | **Database**  |
|-------------------|-------------------|---------------|
| Vite             | Django            | PostgreSQL    |
| React            | Django Restful    |               |
| Tailwind CSS     | OpenCV            |               |

## Tech Stacks with Dependency Version
| **Frontend Dependencies**      | **Backend Dependencies**                   |
|--------------------------------|--------------------------------------------|
| emotion/react: ^11.14.0       | Django==4.2.7                              |
| emotion/styled: ^11.14.0      | djangorestframework==3.14.0                |
| mui/icons-material: ^6.4.7    | djangorestframework-simplejwt==5.3.0       |
| mui/material: ^6.4.7          | django-cors-headers==4.3.0                 |
| tailwindcss/vite: ^4.0.12     | Pillow==10.1.0                             |
| framer-motion: ^12.4.10       | python-decouple==3.8                       |
| react: ^19.0.0                | psycopg2-binary==2.9.9                     |
| react-dom: ^19.0.0            | djoser==2.2.0                              |
| react-fast-marquee: ^1.6.5    | opencv-python==4.8.1.78                    |
| react-router-dom: ^7.3.0      | setuptools                                 |
| tailwindcss: ^4.0.12          |                                            |

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
### Future Scope
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

### Screenshots
![Screenshot 2025-03-11 150547](https://github.com/user-attachments/assets/24c558a7-48f2-4c27-90d0-088dec5ed39f)

![Screenshot 2025-03-11 150707](https://github.com/user-attachments/assets/ef2c420a-0175-4ba3-aa51-317ae72a85a3)

![Screenshot 2025-03-11 151124](https://github.com/user-attachments/assets/c8b74752-ab16-4471-9199-bb27cd110f28)

![Screenshot 2025-03-11 151230](https://github.com/user-attachments/assets/b1aeaf21-f7b8-461e-a32e-8e3d27d9a7e1)

![Screenshot 2025-03-11 151658](https://github.com/user-attachments/assets/98d002d0-3203-47df-bf9e-74fdc23d9c85)


## TEAM (CHEEKY GEEKS)
| **Serial No.** | **Name**          | **Role**                                   |
|----------------|-------------------|-------------------------------------------|
| 1              | Abhishek Saxena   | Frontend & Documentation                  |
| 2              | Gajendra Pandey   | Backend & Token Creation                  |
| 3              | Arpan Bhowmick    | Designing & Frontend                      |
| 4              | Shivam            | Backend & Integration                     |
| 5              | Vikas Kumar       | Security Measures (Face Detection and Anomaly Detection) |

