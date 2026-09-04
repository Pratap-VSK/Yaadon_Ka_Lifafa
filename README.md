<div align="center">

# 💌 Yaadon Ka Lifafa (Envelope of Memories)

*A deeply personal, interactive 3D digital scrapbook and memory vault built with Django.*

![Status](https://img.shields.io/badge/System_Status-🟢_Online-success?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-🔴_Strict-red?style=for-the-badge)
![Django](https://img.shields.io/badge/Framework-Django-092E20?style=for-the-badge&logo=django)
![Python](https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python)

</div>

> **"Some memories are not preserved in words, but safely kept in envelopes."**  
> Welcome to **Yaadon Ka Lifafa**, a premium web application designed to store, cherish, and present your most precious moments through breathtaking 3D web animations and seamless backend architecture.

---

## 🚦 System Highlights (Red & Green Lights)

### 🟢 Green Lights (Core Features & UI)
*   🟢 **Butter-Smooth 3D Animations:** Features a lag-free 12-second loading screen with a continuous 3D Image Carousel.
*   🟢 **Personalized Scrapbook:** A dedicated `customization` module containing `for-you.html` and `only_for-you.html` to craft personalized visual letters.
*   🟢 **Immersive Landing Experience:** The `home` app manages a beautiful `landing-page.html` that draws users in with floating SVGs and deep gradients.
*   🟢 **Dynamic Data Processing:** A backend `data_proccess` app ensuring your uploaded memories and texts are handled efficiently.

### 🔴 Red Lights (Security & Failsafes)
*   🔴 **Encrypted Authentication:** The `account` app strictly manages who can view the memories, utilizing a secure login and a "Secret Key" unlock system via `authentication.html`[cite: 1].
*   🔴 **Active Crash Handling:** A dedicated `crash_handle` app is built-in to instantly catch, monitor, and resolve backend errors, ensuring the user experience never breaks[cite: 1].
*   🔴 **Anti-Spam Login:** Built-in rate limiting (cooldown timers) on the login interface to prevent unauthorized guessing of your secret keys.

---

## 📂 Repository Structure

The project follows a clean, scalable Django architecture[cite: 1]:

```text
yaadon_ka_lifafa/[cite: 1]
│
├── Lifafa_core/          # Main Django settings, WSGI, and ASGI configurations[cite: 1]
├── account/              # Authentication logic, models, and login/loading views[cite: 1]
├── crash_handle/         # Custom app for robust error tracking and debugging[cite: 1]
├── data_proccess/        # Data management and processing workflows[cite: 1]
├── home/                 # Root routing and landing page views[cite: 1]
│
├── static/               # Assets folder[cite: 1]
│   ├── images/           # Contains memories (e.g., cute_addy.jpg, love_tedi.jpg, etc.)[cite: 1]
│   └── logo/             # Contains brand assets (logo.jpeg, yaad.jpeg)[cite: 1]
│
├── templates/            # Frontend HTML files[cite: 1]
│   ├── accounts/         # authentication.html, loading.html[cite: 1]
│   ├── customization/    # for-you.html, only_for-you.html[cite: 1]
│   ├── home/             # landing-page.html[cite: 1]
│   └── testing/          # test.html[cite: 1]
│
├── db.sqlite3            # Pre-configured local SQLite Database[cite: 1]
├── manage.py             # Django execution script[cite: 1]
└── requirements.txt      # Python dependencies for the project[cite: 1]
```
🚀 Getting Started
Follow these steps to deploy your envelope locally:

1. Clone the Repository
```Bash
git clone [https://github.com/pratap-vsk/yaadon_ka_lifafa.git](https://github.com/pratap-vsk/yaadon_ka_lifafa.git)
cd yaadon_ka_lifafa
```
2. Install Dependencies
Make sure you have Python installed, then run:
```
Bash
pip install -r requirements.txt
```
3. Database Setup
Apply all the migrations for the account, data_proccess, and crash_handle apps[cite: 1]:
```
Bash
python manage.py makemigrations
python manage.py migrate
```
4. Ignite the Server
Start the Django development server:
```
Bash
python manage.py runserver
```
5. Open the Lifafa
```
Navigate to http://127.0.0.1:8000 in your web browser and watch the magic unfold!
```
🎨 Adding Your Own Memories
To customize the images shown in the 3D Carousel and Scrapbook:

Navigate to the static/images/ directory[cite: 1].

Replace placeholders like Panda2.jpg, catty.jpg, or penguin2.jpg with your own personal photos[cite: 1].

The HTML templates in the customization/ folder will automatically map your beautiful memories[cite: 1].


OWNERSHIP HOLD BY: ```S.P. Vishwakarma```
