# React Native Project

## 📌 Introduction
This is a simple React Native project for mobile application development. It includes basic navigation, API integration, and UI components.

## 🛠 Installation
### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Install a package manager (npm or yarn)
- Install dependencies:

```sh
npm install  # or yarn install
```

## 🚀 Running the App
### For Android:
```sh
npx react-native run-android
```

### For iOS (Mac required):
```sh
cd ios && pod install
cd ..
npx react-native run-ios
```

## 📂 Project Structure
```
/project-root
│-- src/
│   │-- components/   # Reusable UI components
│   │-- screens/      # App screens
│   │-- navigation/   # Navigation setup
│   │-- context/      # State management
│-- assets/           # Images, fonts, etc.
│-- App.js            # Main entry point
│-- package.json      # Dependencies and scripts
```

## 🔧 Review
The App Code is placed inside the src and test cases are written inside _tests_

The constants are inside the App constants
The Context is inside context
The Screen are in screens folder.
The Components that are written inside HomeScreen can also be written inside sperate files and can be imported to the HomeScreen
The API Fetching can be improved a bit more and make it standardized for every api call
The Unit Tests are inside _tests_
