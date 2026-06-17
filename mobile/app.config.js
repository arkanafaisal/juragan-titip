import 'dotenv/config'

export default {
  "expo": {
    "name": "Juragan Titip",
    "slug": "juragan-titip",
    "version": "1.1.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "juragantitip",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "id.my.arkanafaisal.juragantitip",
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      },
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-sqlite",
      "expo-sharing",
      "expo-notifications",
      "expo-location",
      "@react-native-community/datetimepicker",
      [
        "expo-build-properties",
        {
          android: {
            reactNativeArchitectures: ["arm64-v8a"]
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "284a8dcf-6e10-46f5-a8dd-203dee7525c3"
      }
    }
  }
}
