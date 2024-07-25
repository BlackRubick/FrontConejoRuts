import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type PathCoordinate = {
  latitude: number;
  longitude: number;
};

type RouteData = {
  id: number;
  title: string;
  path: PathCoordinate[];
};

type HomeProps = {
  navigation: any; // Ajusta según tu configuración de navegación
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(null);
  const [destinationModalVisible, setDestinationModalVisible] = useState(false);
  const [saveRouteModalVisible, setSaveRouteModalVisible] = useState(false);
  const [deleteRouteModalVisible, setDeleteRouteModalVisible] = useState<boolean>(false);
  const [saveRoute, setSaveRoute] = useState<RouteData[]>([]);
  const [currentRoute, setCurrentRoute] = useState<PathCoordinate[]>([]);
  const [routeName, setRouteName] = useState<string>('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [route1, setRoute1] = useState<RouteData | null>(null);
  const [route2, setRoute2] = useState<RouteData | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      if (loc.coords.latitude && loc.coords.longitude) {
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();
  }, []);

  useEffect(() => {
    axios.get('http://98.80.84.16:8000/routes')
      .then(response => setSaveRoute(response.data))
      .catch(error => console.error('Error fetching routes:', error));
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleSearchModal = () => {
    setSearchModalVisible(!searchModalVisible);
    setMenuVisible(false);
  };
  const toggleCompareModal = () => {
    setCompareModalVisible(!compareModalVisible);
    setMenuVisible(false);
  };
  const toggleDestinationModal = () => {
    setDestinationModalVisible(!destinationModalVisible);
    setMenuVisible(false);
  };

  const handleSearchSubmit = () => {
    if (selectedRouteName) {
      const route = saveRoute.find(r => r.title === selectedRouteName);
      if (route) {
        setSelectedRoute(route);
      } else {
        Alert.alert("Error", "Ruta no encontrada.");
      }
    }
    setSearchModalVisible(false);
    Keyboard.dismiss();
  };

  const handleDestinationSubmit = () => {
    setDestinationModalVisible(false);
    Keyboard.dismiss();
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
    setMenuVisible(false);
  };

  const handleAddRoute = () => {
    setCurrentRoute([]);
    Alert.alert("Agregar Ruta", "Toca el mapa para agregar puntos a la ruta.");
    setMenuVisible(false);
  };

  const handleSaveRoute = () => {
    if (currentRoute.length === 0) {
      Alert.alert("Error", "No hay puntos en la ruta para guardar.");
      return;
    }

    if (routeName.trim() === '') {
      Alert.alert("Error", "Por favor, ingresa un nombre para la ruta.");
      return;
    }

    const newRoute = {
      title: routeName,
      path: currentRoute,
    };

    fetch('http://98.80.84.16:8000/routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRoute),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar la ruta');
        }
        return response.json();
      })
      .then(data => {
        setCurrentRoute([]);
        setRouteName('');
        setSaveRoute(prevRoutes => [...prevRoutes, { id: data.id, title: routeName, path: currentRoute }]);
        Alert.alert("Ruta Guardada", `La ruta "${routeName}" se ha guardado correctamente.`);
        setSaveRouteModalVisible(false);
      })
      .catch(error => {
        Alert.alert("Error", "Hubo un problema al guardar la ruta. Verifica la conexión y vuelve a intentarlo.");
        console.error(error);
      });
  };

  const handleDeleteRoute = () => {
    if (selectedRouteName === null) {
      Alert.alert("Error", "No se ha seleccionado ninguna ruta para borrar.");
      return;
    }

    fetch(`http://98.80.84.16:8000/routes/${selectedRouteName}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al borrar la ruta');
        }
        setSaveRoute(prevRoutes => prevRoutes.filter(route => route.title !== selectedRouteName));
        Alert.alert("Ruta Eliminada", "La ruta se ha eliminado correctamente.");
        setSelectedRouteName(null);
        setDeleteRouteModalVisible(false);
      })
      .catch(error => {
        Alert.alert("Error", "Hubo un problema al eliminar la ruta. Verifica la conexión y vuelve a intentarlo.");
        console.error(error);
      });
  };

  const handleCompareSubmit = () => {
    if (!route1 || !route2) {
      Alert.alert("Error", "Por favor selecciona dos rutas para comparar.");
      return;
    }

    setCompareModalVisible(false);
    Keyboard.dismiss();
  };

  return (
    <LinearGradient colors={['#5E9CFA', '#8A2BE2']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ConejoRuts</Text>
        <TouchableOpacity onPress={navigateToLogin}>
          <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem} onPress={toggleCompareModal}>
                <Text style={styles.menuItemText}>Comparar Rutas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={toggleDestinationModal}>
                <Text style={styles.menuItemText}>Buscar Destino</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={toggleSearchModal}>
                <Text style={styles.menuItemText}>Ver Ruta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleAddRoute}>
                <Text style={styles.menuItemText}>Agregar Rutas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => setSaveRouteModalVisible(true)}>
                <Text style={styles.menuItemText}>Guardar Ruta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => setDeleteRouteModalVisible(true)}>
                <Text style={styles.menuItemText}>Borrar Ruta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        zoomEnabled={true}
        zoomControlEnabled={true}
        onPress={(e) => {
          if (currentRoute) {
            setCurrentRoute([...currentRoute, e.nativeEvent.coordinate]);
          }
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="This is your current location"
          />
        )}

        {currentRoute.length > 0 && (
          <Polyline
            coordinates={currentRoute}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}

        {selectedRoute && (
          <Polyline
            coordinates={selectedRoute.path}
            strokeColor="#00f"
            strokeWidth={3}
          />
        )}

        {route1 && (
          <Polyline
            coordinates={route1.path}
            strokeColor="#ff0"
            strokeWidth={3}
          />
        )}

        {route2 && (
          <Polyline
            coordinates={route2.path}
            strokeColor="#f00"
            strokeWidth={3}
          />
        )}
      </MapView>

      <Modal
        transparent={true}
        visible={searchModalVisible}
        animationType="fade"
        onRequestClose={toggleSearchModal}
      >
        <TouchableWithoutFeedback onPress={toggleSearchModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Ver Ruta</Text>
              <RNPickerSelect
                onValueChange={(value) => setSelectedRouteName(value)}
                items={saveRoute.map(route => ({ label: route.title, value: route.title }))}
                placeholder={{ label: "Selecciona una ruta...", value: null }}
              />
              <TouchableOpacity style={styles.button} onPress={handleSearchSubmit}>
                <Text style={styles.buttonText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={compareModalVisible}
        animationType="fade"
        onRequestClose={toggleCompareModal}
      >
        <TouchableWithoutFeedback onPress={toggleCompareModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Comparar Rutas</Text>
              <Text>Ruta 1:</Text>
              <RNPickerSelect
                onValueChange={(value) => setRoute1(saveRoute.find(route => route.title === value) || null)}
                items={saveRoute.map(route => ({ label: route.title, value: route.title }))}
                placeholder={{ label: "Selecciona la primera ruta...", value: null }}
              />
              <Text>Ruta 2:</Text>
              <RNPickerSelect
                onValueChange={(value) => setRoute2(saveRoute.find(route => route.title === value) || null)}
                items={saveRoute.map(route => ({ label: route.title, value: route.title }))}
                placeholder={{ label: "Selecciona la segunda ruta...", value: null }}
              />
              <TouchableOpacity style={styles.button} onPress={handleCompareSubmit}>
                <Text style={styles.buttonText}>Comparar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={destinationModalVisible}
        animationType="fade"
        onRequestClose={toggleDestinationModal}
      >
        <TouchableWithoutFeedback onPress={toggleDestinationModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Buscar Destino</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu destino"
                onChangeText={text => setSelectedRouteName(text)}
                value={selectedRouteName || ''}
              />
              <TouchableOpacity style={styles.button} onPress={handleDestinationSubmit}>
                <Text style={styles.buttonText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={saveRouteModalVisible}
        animationType="fade"
        onRequestClose={() => setSaveRouteModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSaveRouteModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Guardar Ruta</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la ruta"
                onChangeText={text => setRouteName(text)}
                value={routeName}
              />
              <TouchableOpacity style={styles.button} onPress={handleSaveRoute}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setSaveRouteModalVisible(false)}>
                <Text style={styles.buttonText}>Actualizar Ruta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={deleteRouteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteRouteModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDeleteRouteModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Borrar Ruta</Text>
              <RNPickerSelect
                onValueChange={(value) => setSelectedRouteName(value)}
                items={saveRoute.map(route => ({ label: route.title, value: route.title }))}
                placeholder={{ label: "Selecciona una ruta...", value: null }}
              />
              <TouchableOpacity style={styles.button} onPress={handleDeleteRoute}>
                <Text style={styles.buttonText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#5E9CFA',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  menu: {
    backgroundColor: 'white',
    width: 200,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
  },
  map: {
    flex: 1,
  },
});

export default Home;
