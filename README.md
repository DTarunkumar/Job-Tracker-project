# 💼 Job Tracker Web App

A full-stack job application tracking dashboard built with React and Firebase. This web app helps users seamlessly manage their job search process — from tracking applications and uploading resumes to analyzing progress with charts and insights.

### 🌐 Live Demo

🔗 [jobtracker.tarundoranala.me](https://jobtracker.tarundoranala.me)

---

## 📌 Features

* 🔐 **User Authentication** with Firebase Auth (Register, Login, Forgot Password)
* 📄 **Application Management**: Add, edit, delete, and view job applications
* 📁 **Resume & Cover Letter Uploads** via Firebase Storage
* 📊 **Dashboard with Visual Insights**:

  * Applications over time (Line Chart)
  * Job status by type (Stacked Bar Chart)
* 📂 **Downloadable Files**: Access resumes/cover letters anytime
* 🔎 **Filtering, Sorting & Searching** by status, type, and date
* 👤 **User Profile Page**: Manage personal and professional info with profile image
* ✅ **Mobile Responsive UI** using Tailwind CSS
* 📥 **Export to CSV** supported
* 🚀 **Hosted on Firebase with Custom Domain**

---

## 🛠 Tech Stack

| Frontend                   | Backend (BaaS)                    | DevOps / Hosting      |
| -------------------------- | --------------------------------- | --------------------- |
| React, TypeScript          | Firebase Auth, Firestore, Storage | Firebase Hosting      |
| Tailwind CSS               |                                   | GitHub + Firebase CLI |
| Chart.js, React Router DOM |                                   |                       |

---

## 📸 Screenshots

| Dashboard                                  | Applications                                    | Add Modal                               |
| ------------------------------------------ | ----------------------------------------------- | --------------------------------------- |
| ![Dashboard](assets/images/Jobtracker.png) | ![Applications](assets/images/applications.png) | ![AddModal](assets/images/addmodal.png) |

---

## 🧭 Project Structure

```
job-applications-tracker/
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── types/
│   └── firebase/
│
├── firebase.json
├── package.json
├── tailwind.config.js
└── README.md
```

## 📃 License

This project is licensed under the MIT License. See `LICENSE` for details.

---
