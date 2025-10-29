import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./src/screens/onboardingScreen";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen"; 
import { View, Text } from "react-native";


export type RootStackParamList = {
  Onboarding: undefined;
  ProfileSetup: undefined;
  Home: { profile?: { name: string; photo?: string } } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ route }: any) {
  const profile = route?.params?.profile;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to TaskFlow!</Text>
      {profile?.name ? <Text>Hi, {profile.name} 👋</Text> : null}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} /> 
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
