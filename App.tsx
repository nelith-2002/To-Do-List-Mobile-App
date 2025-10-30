import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, loadTasksOnBoot } from "./src/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./src/screens/onboardingScreen";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen"; 
import HomeScreen from "./src/screens/HomeScreen";
import AddEditTaskScreen from "./src/screens/AddEditTaskScreen";


export type RootStackParamList = {
  Onboarding: undefined;
  ProfileSetup: undefined;
  Home: { profile?: { name: string; photo?: string } } | undefined;
  AddEdit: { task?: any } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    useEffect(() => {
    loadTasksOnBoot(store.dispatch);
  }, []);
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} /> 
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddEdit" component={AddEditTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
