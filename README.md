# 🏭 OEE Command Center 

Hey there! Welcome to the **OEE Command Center** — a digital manufacturing observation system I built from the ground up during my internship at **Ramco Steels Pvt. Ltd.** 

## 💡 The Story Behind the Project

Before this project, tracking machine efficiency across multiple massive manufacturing sectors (like Sector 25, Sector 69, and various individual units) involved a lot of disconnected spreadsheets, delayed reporting, and manual data entry. It worked, but it wasn't *fast*, and it definitely wasn't easy to look at.

I was tasked with solving this problem. The goal? Build a centralized digital nervous system for the factory floor. 

The result is this application. It completely digitizes the tracking of **Overall Equipment Effectiveness (OEE)** — which breaks down into Availability, Performance, and Quality. Instead of waiting for weekly Excel roll-ups, plant managers and executives can now log in and instantly see exactly how their CNC machines, VMC units, and massive Forging presses are performing in real-time.

## 🚀 What Makes It Awesome?

I didn't just want to build another boring corporate dashboard with a white background and some bar charts. I wanted it to feel like you were stepping into a mission control room. 

- **Interactive 3D Factory Floor:** Built with React Three Fiber, you can physically see 3D representations of the machines running right in your browser. (We even made sure you never see the back of the machines as they gently oscillate!)
- **Completely Serverless:** We completely ditched heavy, traditional databases. The entire app is powered by **Firebase Firestore**, meaning it scales infinitely, costs essentially nothing to host, and is lightning fast.
- **Role-Based Security:** Floor managers can securely log in via Google Authentication to input daily machine downtime and production metrics, while executives can log in as Viewers to safely observe the data without accidentally changing anything.
- **Industrial Dark Aesthetics:** A bespoke, highly-polished dark mode interface that uses custom animations and color-coded metrics to make manufacturing data actually look *cool*.

It solves the very real industrial problem of data visibility, and it does it with zero lag and an incredibly premium user experience.

---

## 🛠️ How to Set It Up

If you're a developer looking to run this locally, here is exactly how to get it spinning on your own machine.

### 1. Clone & Install
First, clone the repository and install all the dependencies.
```bash
git clone https://github.com/your-username/oee-command-center.git
cd oee-command-center
npm install
```

### 2. Configure Firebase
Because this app is entirely serverless, you don't need to spin up a local database or Prisma schema! You just need a free Firebase project.
1. Head over to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database** and **Google Authentication**.
3. Create a `.env.local` file in the root of your project folder.
4. Drop in your Firebase web configuration keys like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```
*(Note: If you don't do this, the app won't crash—it will just politely show you a beautifully designed warning page!)*

### 3. Run the Development Server
Fire up the Next.js Turbopack compiler:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the command center in action.

### 4. (Optional) Seed the Database
If you want to populate your fresh database with the factory structures and zeroed-out starting metrics, you can run the built-in seeder:
```bash
npx tsx scripts/seedFirestore.ts
```

---

*Designed and developed with caffeine and Next.js during an incredible internship experience at Ramco Steels Pvt. Ltd.* ⚙️
