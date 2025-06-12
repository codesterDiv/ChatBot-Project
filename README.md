# 💬 Chatbot UI using OpenAI API

Live Link : - [click me](https://melodious-pastelito-518737.netlify.app/) 

Create an intelligent and sleek ChatGPT-style chatbot using your OpenAI API key. This project provides a fully functional and customizable UI with real-time responses from GPT models.

![image](https://github.com/user-attachments/assets/755b4830-5bac-42de-a98e-bbaa6742ec0e)

---

## 🚀 Features

- ✨ Beautiful and responsive chat interface  
- 🤖 Real-time conversations powered by GPT-3.5 / GPT-4  
- 🔒 API Key managed via environment variables  
- ⏳ Typing animation and loading indicator  
- 📱 Mobile-friendly design  
- ⚙️ Easy to customize and extend  

---

## 🧰 Tech Stack

- **Frontend Framework**: React / Vue / Next.js *(your choice)*  
- **Styling**: Tailwind CSS / CSS Modules / SCSS  
- **API**: OpenAI Chat Completions API  

---

## ⚡️ Quick Start

1. **Clone this repo**

    ```bash
    git clone https://github.com/AnubhavChaturvedi-GitHub/ChatBot-Project.git
    cd ChatBot-Project
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure your API key**

    Create a `.env` file in the root directory and add your OpenAI API key:

    ```env
    VITE_OPENAI_API_KEY=your-openai-api-key-here
    ```

4. **Start the dev server**

    ```bash
    npm run dev
    ```

    The chatbot UI will be running at [http://localhost:3000](http://localhost:3000) (or a similar local URL).

---

> **🚨 Security Tip:**  
> Never expose your OpenAI API key in public repos or client-side code for production.  
> Use a backend proxy or server-side code if deploying publicly.

---

🎉 That’s it! You’re ready to chat with your own AI bot.

⚠️ Security Note

⚠️ DO NOT expose your OpenAI API key directly in client-side code in production.
Use a secure backend to route requests or deploy with server-side rendering where the key is hidden.

⸻

📸 Screenshots

Add UI preview images or demo GIFs here.

⸻

🛠️ Customization Ideas
	•	Enable chat history storage (localStorage or database)
	•	Add voice-to-text and text-to-speech
	•	Integrate prompt templates or personas
	•	Add dark/light theme toggle

⸻

📄 License

This project is licensed under the MIT License.

⸻

🙋‍♂️ Questions?

If you face any issues or want to request a feature, feel free to open an issue or contribute to the repo!

Let me know if you also want a backend proxy setup for securing your API key or want the same README tailored for **Next.js**, **Vue**, or **plain HTML/CSS** setup.
