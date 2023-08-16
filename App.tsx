import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import {AuthProvider, useAuth} from "./app/context/AuthContext";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./app/screens/home";
import Login from "./app/screens/login";
import {useFonts} from "expo-font";
import Welcome from "./app/screens/welcome";

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
                              headerRight: () => <Button onPress={onLogout} title="Sign out" />,
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
          </Stack.Navigator>
      </NavigationContainer>
  )
}
