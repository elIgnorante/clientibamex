import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Button, View } from 'react-native';
// import { useAuth } from '@/hooks/useAuth'; // Asume que tienes un hook de autenticación

const SignInScreen = () => {
  const navigation = useNavigation();
//   const { signIn, user } = useAuth();

//   useEffect(() => {
//     if (user && user.role === 'admin') {
//       navigation.navigate('(admin)/dashboard');
//     }
//   }, [user]);

//   const handleSignIn = async () => {
//     await signIn();
//     if (user && user.role === 'admin') {
//       navigation.navigate('(admin)/dashboard');
//     }
//   };

  return (
    <View>
      {/* <Button title="Sign In" onPress={handleSignIn} /> */}
    </View>
  );
};

export default SignInScreen;