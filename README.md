# 🧠 AI-Powered Code Review Platform (MERN Stack)

An AI-driven **Code Review Web Application** built using the **MERN stack**, designed to help developers analyze code efficiently. Users can submit source code and receive intelligent feedback such as error detection, optimization suggestions, and relevant corrections.

The backend leverages the **Google Gemini API** to perform contextual code analysis and generate meaningful, developer-friendly reviews.

---

## 🚀 Features

- 🔍 Automated detection of syntax and logical errors  
- ⚡ Performance and readability optimization suggestions  
- ✨ AI-powered code analysis using Google Gemini  
- 🖥️ Clean, responsive, and intuitive React UI  
- 🌐 RESTful backend architecture  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- HTML5, CSS3, JavaScript  
- Axios  

### Backend
- Node.js  
- Express.js  
- Google Gemini API  

### Tools & Utilities
- Git & GitHub  
- Postman  

---

## 📂 Project Structure

```text
code-review-project/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── app.js
│   └── server.js
│
└── README.md
```

⚙️ How It Works
The user submits source code through the React frontend

The code is sent to the Node.js + Express backend

The backend forwards the code to the Google Gemini API

Gemini analyzes the code and returns:

Identified errors

Optimization suggestions

Relevant corrections

The processed feedback is displayed to the user in the UI

🔑 Environment Variables
Create a .env file inside the backend directory and configure the following:

env
Copy code
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
▶️ Installation & Setup
Step 1: Clone the Repository
bash
Copy code
git clone https://github.com/your-username/code-review-mern.git
cd code-review-mern
Step 2: Backend Setup
bash
Copy code
cd backend
npm install
npm start
Step 3: Frontend Setup
bash
Copy code
cd frontend
npm install
npm start


🧪 API Overview
Endpoint
POST /api/review

Request Body

json
Copy code
{
  "code": "your source code here",
  "language": "javascript"
}
Response

json
Copy code
{
  "errors": [],
  "optimizations": [],
  "suggestions": []
}
🎯 Future Enhancements
Multi-language code support

User authentication and review history

Integrated syntax-highlighted code editor

Downloadable code review reports

Cloud deployment

🤝 Contributing
Contributions are welcome.
Feel free to fork the repository and submit a pull request.

📜 License
This project is licensed under the MIT License.

👨‍💻 Author
Rohit Tiwari
Full Stack Developer | MERN | AI Enthusiast
