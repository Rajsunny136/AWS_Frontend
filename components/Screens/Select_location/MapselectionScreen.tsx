import React, { useState } from 'react';
import { View, Button, StyleSheet, Platform, Text } from 'react-native';
import MapView, { Marker, MapEvent } from 'react-native-maps'; // Assuming you use react-native-maps
import { StackScreenProps } from '@react-navigation/stack'; // For typed navigation


// Define the types for route and navigation
type MapSelectionScreenProps = StackScreenProps<RootStackParamList, 'MapSelection'>;

const MapSelectionScreen = ({ route, navigation }: MapSelectionScreenProps) => {
    const { type } = route.params; // 'type' could be 'pickup' or 'drop'

    // Define the state for selected location
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    

    // Event handler for map press (set latitude/longitude)
    const handleMapPress = (event: MapEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    // Function to handle confirm button press
    const handleConfirmLocation = () => {
        if (selectedLocation) {
            // Send the selected location back to the previous screen
            navigation.navigate('PickupDropScreen', {
                type,
                location: selectedLocation,
            });
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                onPress={handleMapPress} // Event handler for map press
            >
                {selectedLocation && (
                    <Marker
                        coordinate={{
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                        }}
                    />
                )}
            </MapView>

            <View style={styles.confirmButton}>
                <Button
                    title="Confirm Location"
                    onPress={handleConfirmLocation}
                    disabled={!selectedLocation} // Disable button if no location is selected
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    confirmButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});

export default MapSelectionScreen;
