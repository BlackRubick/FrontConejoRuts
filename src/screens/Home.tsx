import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Polyline, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const routes = [
  { id: 1, title: "Ruta 1", path: [{ latitude: 16.7521, longitude: -93.1169 }, { latitude: 16.7597, longitude: -93.1123 }] },
];

const Home: React.FC<Props> = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [destinationModalVisible, setDestinationModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 16.7521,
    longitude: -93.1169,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const rotateValue = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      console.log('Current Location:', loc);

      if (loc.coords.latitude && loc.coords.longitude) {
        setLocation(loc);
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const togglePlusMenu = () => {
    setMenuVisible(!menuVisible);
    rotateValue.value = withTiming(menuVisible ? 0 : 45, { duration: 300 });
    scale.value = withSpring(menuVisible ? 0 : 1);
    opacity.value = withTiming(menuVisible ? 0 : 1, { duration: 300 });
    translateY.value = withSpring(menuVisible ? 50 : 0);
  };

  const toggleSearchModal = () => {
    setSearchModalVisible(!searchModalVisible);
    setMenuVisible(false);
  };

  const toggleDestinationModal = () => {
    setDestinationModalVisible(!destinationModalVisible);
    setMenuVisible(false);
  };

  const handleSearchSubmit = () => {
    setSearchModalVisible(false);
    Keyboard.dismiss();
  };

  const handleDestinationSubmit = () => {
    setDestinationModalVisible(false);
    Keyboard.dismiss();
  };

  const rotateAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <LinearGradient colors={['#5E9CFA', '#8A2BE2']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}></TouchableOpacity>
        <Text style={styles.headerText}>ConejoRuts</Text>
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
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate("Home"); }}>
                <Text style={styles.menuItemText}>Comparar Rutas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); toggleDestinationModal(); }}>
                <Text style={styles.menuItemText}>Buscar Destino</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleSearchModal(); }}>
                <Text style={styles.menuItemText}>Ver Ruta </Text>
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
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Mi Ubicación"
            description="Aquí estoy"
          />
        )}
        {routes.map(route => (
          <Polyline
            key={route.id}
            coordinates={route.path}
            strokeColor="#8A2BE2"
            strokeWidth={6}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.plusButton} onPress={togglePlusMenu}>
        <Animated.View style={rotateAnimation}>
          <FontAwesome name="plus" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={searchModalVisible}
        animationType="fade"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSearchModalVisible(false)}>
          <View style={styles.searchModalOverlay}>
            <View style={styles.searchModal}>
              <TextInput
                style={styles.searchInput}
                placeholder="Ruta 33"
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                onSubmitEditing={handleSearchSubmit}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={destinationModalVisible}
        animationType="fade"
        onRequestClose={() => setDestinationModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDestinationModalVisible(false)}>
          <View style={styles.searchModalOverlay}>
            <View style={styles.searchModal}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar destino"
                onChangeText={(text) => setDestinationText(text)}
                value={destinationText}
                onSubmitEditing={handleDestinationSubmit}
              />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: '#487DE0',
  },
  headerText: {
    fontFamily: "K2D",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    right: 120,
  },
  map: {
    flex: 1,
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#008001',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModal: {
    backgroundColor: 'transparent', 
    padding: 20,
    borderRadius: 8,
    width: 250,
  },
  menu: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginTop: 50,
    marginLeft: 10,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: "K2D",
    fontSize: 18,
    color: 'black',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: "K2D",
    backgroundColor: 'white',
  },
});

export default Home;
