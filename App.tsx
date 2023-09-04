import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import {AuthProvider, useAuth} from "./app/context/AuthContext";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./app/screens/home";
import Login from "./app/screens/login";
import {useFonts} from "expo-font";
import Welcome from "./app/screens/welcome";
import PdfGenerator from "./app/screens/estimation-generator";
import AddGuests from "./app/screens/add-guests";
import Registration from "./app/screens/registration";

const Stack = createNativeStackNavigator();

export default function App() {
  return (

   <AuthProvider>
      <Layout></Layout>
   </AuthProvider>
  );
}

export const Layout = () => {


  const {authState, onLogout} = useAuth();

  const [fontsLoaded] = useFonts({
        DMBold: require(".//assets/fonts/DMSans-Bold.ttf"),
        DMMedium: require(".//assets/fonts/DMSans-Medium.ttf"),
        DMRegular: require(".//assets/fonts/DMSans-Regular.ttf"),
    });


    if (!fontsLoaded) {
        return null;
    }
  console.log(authState);
  return(
      <>
      <StatusBar hidden/>
      <NavigationContainer>
          <Stack.Navigator>
              {!authState?.authenticated ? (
                  <Stack.Screen
                      name="Welcome"
                      component={Welcome}
                      options={{ headerShown: false }}
                  />
              ) : (
                  <>
                      <Stack.Screen
                          name="Home"
                          component={Home}
                          options={{
                              headerBackButtonMenuEnabled: false,
                              headerTitle:"",
                              headerShown:false
                          }}
                      />
                  </>
              )}
              {!authState?.authenticated && (
                  <Stack.Screen
                      name="Login"
                      component={Login}
                      options={{ headerShown: false }}
                  />
              )}
              {!authState?.authenticated && (
                  <Stack.Screen
                      name="Registration"
                      component={Registration}
                      options={{headerShown: false}}
                  />
              )}
              <Stack.Screen
                  name="PdfGenerator"
                  component={PdfGenerator}
                  options={{headerShown: false}}
              />
              <Stack.Screen
                  name="AddGuests"
                  component={AddGuests}
                  options={{headerShown: false}}
              />
          </Stack.Navigator>
      </NavigationContainer>
      </>
  )
}
