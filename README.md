# Smart QR-Based Event Attendance Management System

A complete full-stack web application designed for colleges, seminars, workshops, hackathons, and conferences to quickly register and log student attendance via dynamic, time-bound QR codes.

---

## 🚀 Tech Stack

- **Frontend**: React.js, React Router, Axios, Tailwind CSS v4, Recharts, Lucide Icons
- **Backend**: Spring Boot 3.4.2, Spring Data JPA, Maven
- **Database**: PostgreSQL (Port `5432`)
- **Excel Processing**: Apache POI
- **QR Code Generation**: ZXing
- **Authentication**: JWT (JSON Web Tokens) for Faculty accounts

---

## 📁 Project Directory Structure

```
d:\qr attendance/
├── backend/
│   ├── src/main/java/com/eventqr/attendance/
│   │   ├── config/             # Spring Security, CORS, JWT Filters, UserDetails
│   │   ├── controller/         # Auth, Events, Attendance REST Controllers
│   │   ├── dto/                # Request & Response payload models
│   │   ├── entity/             # JPA entity mappings (Faculty, Event, Participant, Attendance)
│   │   ├── exception/          # Custom exceptions & GlobalExceptionHandler mapper
│   │   ├── repository/         # Spring Data JPA Repository interfaces
│   │   └── service/            # Core business logic services (Excel, QR, Attendance, Faculty)
│   │   └── AttendanceApplication.java  # Spring Boot entry point
│   ├── src/main/resources/
│   │   └── application.properties # PostgreSQL & JWT Configuration
│   └── pom.xml                 # Maven build file
├── frontend/
│   ├── src/
│   │   ├── assets/             # Static UI icons/assets
│   │   ├── components/         # Reusable layouts
│   │   ├── pages/              # Login, Register, Dashboard, CreateEvent, UploadExcel, ViewQR, LiveDashboard, StudentForm
│   │   ├── services/           # Axios configuration with JWT interceptor (api.js)
│   │   ├── App.jsx             # React routing & login state manager
│   │   ├── index.css           # Tailwind v4 import & custom styles
│   │   └── main.jsx            # React mounting file
│   ├── index.html              # Main HTML skeleton
│   ├── tailwind.config.js      # Tailwind configurations
│   ├── postcss.config.js       # PostCSS config
│   └── package.json            # Node dependencies
└── README.md                   # Setup guide and API docs
```

---

## 💾 Database Configuration

The application is configured to connect to PostgreSQL with the following details:
- **Database Name**: `qr_attendance`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `madhu`

Spring Boot uses `spring.jpa.hibernate.ddl-auto=update` to automatically create and sync all tables on startup. No manual SQL scripts are required!

---

## 🔌 API Documentation

### 1. Authentication
- **Register Faculty**
  - `POST /api/auth/register`
  - Payload: `{ "name": "Dr. Rajesh Kumar", "email": "rajesh@college.edu", "password": "securepassword" }`
- **Login Faculty**
  - `POST /api/auth/login`
  - Payload: `{ "email": "rajesh@college.edu", "password": "securepassword" }`
  - Response: `{ "token": "JWT_STRING_HERE", "id": 1, "name": Dr. Rajesh Kumar", "email": "rajesh@college.edu" }`

### 2. Events (Faculty Only - Protected)
- **Create Event**
  - `POST /api/faculty/events`
  - Payload: `{ "eventName": "AI Hackathon 2026", "startTime": "2026-06-07T09:00:00", "endTime": "2026-06-07T18:00:00", "attendanceMode": "REGISTERED" }` (Modes: `REGISTERED` or `OPEN`)
- **List Faculty Events**
  - `GET /api/faculty/events`
- **Upload Excel Roster (Only for REGISTERED mode)**
  - `POST /api/faculty/events/{id}/upload`
  - Multipart Form Param: `file` (Excel `.xlsx` file containing headers `Name`, `Email`, `Department`)

### 3. Student & QR Operations (Public)
- **Get Public Event Metadata**
  - `GET /api/public/events/{qrToken}` (Fetches event title, mode, status, and duration check)
- **Generate QR Code Stream**
  - `GET /api/public/events/qr/{qrToken}` (Returns raw PNG QR code image)
- **Mark Student Attendance**
  - `POST /api/public/attendance/mark/{qrToken}`
  - Payload (For Open mode): `{ "name": "Rohan", "email": "rohan@college.edu", "department": "CSE" }`
  - Payload (For Registered mode): `{ "email": "rohan@college.edu" }`

### 4. Dashboards & Reports (Faculty Only - Protected)
- **Live Attendance Dashboard Stats**
  - `GET /api/faculty/attendance/event/{id}` (Returns real-time presents, absents, check-in logs)
- **Export Attendance Excel Report**
  - `GET /api/faculty/attendance/event/{id}/export` (Downloads Excel attachment formatted sheet)

---

## 🛠️ Installation & Execution

### 1. Running the Backend
Ensure PostgreSQL is running on port 5432 and the `qr_attendance` database has been created.
Open a terminal in the `backend/` directory:
```bash
# Run the Spring Boot application using Maven:
# (If Maven is installed globally)
mvn spring-boot:run

# Or run it directly inside your IDE (IntelliJ IDEA / Eclipse / VS Code) by executing the main method in AttendanceApplication.java
```

### 2. Running the Frontend
Open a terminal in the `frontend/` directory:
```bash
# Install NPM packages
npm install

# Run the local Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📤 Push Code to GitHub

We have initialized a Git repository in the root workspace directory and linked it to your remote URL: `https://github.com/Madhu-Mitha-S25/Qr-attendance.git`.

Follow these commands in your project root folder (`d:\qr attendance`) to commit and push all code files to GitHub:

```bash
# 1. Check current status
git status

# 2. Stage all files (excluding ignored build outputs)
git add .

# 3. Create initial commit
git commit -m "Initial commit: Completed Smart QR Event Attendance System (Spring Boot + React + Tailwind v4)"

# 4. Set main as primary branch
git branch -M main

# 5. Push files to your GitHub repository
git push -u origin main
```
If prompted, authorize Git using your GitHub Personal Access Token or browser credentials to complete the upload.
