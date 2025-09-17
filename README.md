# 🎬 CineSage - An Intelligent Movie Recommendation System

**CineSage** is a full-stack, AI-powered web application designed to provide personalized movie recommendations. It leverages a sophisticated hybrid recommendation engine, combining content-based and collaborative filtering models to deliver relevant and diverse suggestions based on user preferences.

![CineSage Application Screenshot](https://placehold.co/1200x600/2d3748/ffffff?text=CineSage%20App%20Screenshot)

---

## ✨ Core Features

* **🎬 Movie Discovery:** Browse and search for movies using the extensive TMDB API.
* **👤 User Authentication:** Secure user registration and login system powered by Firebase Authentication.
* **❤️ Favorites System:** Logged-in users can save movies to a persistent "My Favorites" list, stored in a cloud Firestore database.
* **🧠 Intelligent Recommendations:** A dedicated "For You" page that provides personalized movie recommendations based on a user's favorites.
* **🤖 Hybrid Recommendation Engine:**
  * **Cold Start Solution:** For new users with few favorites, a **Content-Based Model** provides recommendations based on movie attributes (genres, keywords, cast, etc.).
  * **Personalized Suggestions:** For established users, a **Collaborative Filtering Model** (trained with PyTorch) predicts movies liked by users with similar tastes.
* **📱 Responsive Design:** A clean, modern, and mobile-friendly user interface built with React and TypeScript.

---

## 🏛️ Architecture Overview

CineSage is built on a modern, decoupled, full-stack architecture. This separation of concerns allows for scalability and independent development of the frontend and backend services.

* **Frontend (Client):** A dynamic **Single-Page Application (SPA)** built with **React and TypeScript**. It handles all user interactions, UI rendering, and session management. It is deployed on a static hosting service like **Vercel**.
* **Backend (Server):** A powerful **Python API** built with **Flask**. Its sole purpose is to serve the machine learning models. It loads the pre-trained model artifacts and exposes a RESTful endpoint to generate recommendations. It is deployed on a service like **Hugging Face Spaces** or **Render**.
* **Database:** **Firebase Firestore** is used as a NoSQL database to store user data, specifically their list of favorite movies.
* **Authentication:** **Firebase Authentication** handles all user sign-up and login flows securely.

![Full-stack Architecture Diagram](https://placehold.co/800x300/2d3748/ffffff?text=Frontend%20%E2%86%92%20API%20Call%20%E2%86%92%20Backend%20%E2%86%92%20Firebase)

---

## 🛠️ Tech Stack & Tools

| Area                  | Technologies & Libraries                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Frontend** | React, TypeScript, Vite, React Router, Axios, Firebase SDK                                |
| **Backend** | Python, Flask, Gunicorn, Flask-CORS                                                       |
| **Machine Learning** | PyTorch (for Collaborative Model), Pandas, Scikit-learn (for Content Model), NumPy        |
| **Database** | Google Firebase Firestore (NoSQL)                                                         |
| **Authentication** | Google Firebase Authentication                                                            |
| **DevOps & Deployment** | GitHub (Version Control), Vercel (Frontend Hosting), Hugging Face Spaces / Render (Backend Hosting) |

---

## 🚀 Getting Started

To get a local copy of this project up and running, you will need to set up both the frontend and the backend separately.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16+) and npm
* [Python](https://www.python.org/) (v3.9+) and pip
* A [Firebase](https://firebase.google.com/) project with **Authentication** and **Firestore** enabled.
* A [TMDB API Key](https://www.themoviedb.org/documentation/api).

### 1. Backend Setup (backend/)

First, set up the Python API that serves the recommendations.

```bash
# Clone the repository (or navigate into the backend folder)
git clone [https://github.com/ComradeV7/CineSage.git](https://github.com/ComradeV7/CineSage.git)
cd CineSage/movie-recommendation-api

# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt

# NOTE: The pre-trained model artifacts (`.pth`, `.pkl`, `.npy`) are required
# in a `model_artifacts/` folder for the server to run.

# Run the Flask development server
python app.py
```

### 2. Frontend Setup (frontend/)
Next, set up the React user interface which acts as the client for our application.
```bash
# Navigate into the frontend folder from the project's root directory
cd ../movie-finder-app

# Install all the necessary NPM packages
npm install
```

*Make sure to have all environmental variable*
