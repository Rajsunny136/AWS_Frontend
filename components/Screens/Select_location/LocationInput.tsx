import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icons for select map and clear

interface LocationInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    onSelectMap: () => void;
    onClear: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ label, value, onChangeText, onSelectMap, onClear }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`Enter ${label}`}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={onClear}>
                        <Icon name="close-circle" size={24} color="gray" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onSelectMap}>
                    <Icon name="map-outline" size={24} color="#007bff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    input: {
        flex: 1,
        height: 40,
    },
});

export default LocationInput;
