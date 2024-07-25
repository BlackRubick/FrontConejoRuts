import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUser } from '../contexts/UserContext'; // Importa el hook de contexto de usuario

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const { setUserName } = useUser(); // Usa el hook de contexto de usuario

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro
  const [fullName, setFullName] = useState(''); // Estado para el nombre completo en el registro

  const apiUrl = 'http://98.80.84.16:8000';

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password,
      });
      Alert.alert('Inicio de sesión exitoso', 'Has iniciado sesión correctamente');

      // Guarda el nombre del usuario en el contexto de usuario
      setUserName(response.data.full_name); // Ajusta según la estructura de tu respuesta

      navigation.navigate('Home'); // Navega a la pantalla 'Home'
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ha ocurrido un error, por favor intenta de nuevo');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        full_name: fullName,
        email: email,
        password: password,
      });
      Alert.alert('Registro exitoso', 'Te has registrado correctamente');

      // Guarda el nombre del usuario en el contexto de usuario
      setUserName(response.data.full_name); // Ajusta según la estructura de tu respuesta

      navigation.navigate('Home'); // Navega a la pantalla 'Home'
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ha ocurrido un error, por favor intenta de nuevo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>ConejoRuts</Text>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={fullName}
            onChangeText={setFullName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleRegister}>
          <Text style={styles.buttonText}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleButtonText}>
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#008001',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleButtonText: {
    color: '#008001',
    fontSize: 16,
  },
});

export default Login;
