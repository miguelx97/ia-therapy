# IA Therapy

A modern web application built with Ionic and Angular, featuring Firebase integration for backend services.

## 🚀 Features

- Built with Ionic 8 and Angular 19
- Firebase integration for backend services
- Capacitor support for native mobile capabilities
- Modern UI with Ionic components
- Firebase Functions support
- Firebase Hosting deployment

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- Firebase CLI (`npm install -g firebase-tools`)
- Angular CLI (`npm install -g @angular/cli`)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/miguelx97/ia-therapy
cd ia-therapy
```

2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:

```bash
firebase login
firebase init
```

## 🚀 Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`.

## 🏗️ Building

To build the application for production:

```bash
npm run build
```

## 📱 Mobile Development

This project uses Capacitor for mobile development. To add mobile platforms:

```bash
npx cap add android
npx cap add ios
```

## 🚀 Deployment

To deploy to Firebase:

```bash
# Deploy Firebase Functions
npm run deploy:functions

# Deploy to Firebase Hosting
npm run deploy:hosting
```

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run deploy:functions` - Deploy Firebase Functions
- `npm run deploy:hosting` - Deploy to Firebase Hosting

## 🛠️ Tech Stack

- [Ionic](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Firebase](https://firebase.google.com/)
- [Capacitor](https://capacitorjs.com/)

## 📄 License

This project is private and proprietary.

## 👤 Author

Miguel Martin
