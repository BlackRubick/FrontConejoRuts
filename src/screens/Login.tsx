import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre iniciar sesión y registrarse
  const transportRef = useRef<Animatable.View>(null); // Ref para la animación del transporte

  const handleToggleMode = () => {
    // Cambia el modo entre iniciar sesión y registrarse
    setIsRegistering(!isRegistering);
  };

  const handleAction = () => {
    if (isRegistering) {
      // Lógica para registrar una nueva cuenta
      console.log('Registrando cuenta con:');
      console.log('Nombre Completo:', fullName);
      console.log('Email:', email);
      console.log('Password:', password);
      // Aquí podrías agregar lógica adicional para manejar el registro de usuario

      // Por ahora, solo navegará a la pantalla Home después del registro exitoso
      navigation.replace('Home');
    } else {
      // Lógica para iniciar sesión
      console.log('Iniciando sesión con:');
      console.log('Email:', email);
      console.log('Password:', password);
      // Navega a la pantalla Home después del inicio de sesión exitoso
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="slideInDown" duration={1500} style={styles.transport}>
      </Animatable.View>
      <Text style={styles.headerText}>ConejoRuts</Text>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</Text>
        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
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
        <TouchableOpacity style={styles.button} onPress={handleAction}>
          <Text style={styles.buttonText}>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={handleToggleMode}>
          <Text style={styles.toggleButtonText}>
            {isRegistering ? '¿Ya tienes una cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
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
  transport: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
});

export default Login;
