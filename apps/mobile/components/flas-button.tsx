import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
//@ts-ignore
import Torch from 'react-native-torch';

const FlashButton = () => {
    const [isOn, setIsOn] = useState(false);

    const toggleFlash = async () => {
        try {
            const newState = !isOn;
            await Torch.switchState(newState);
            setIsOn(newState);
        } catch (error) {
            console.error('Flaş hatası:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, isOn && styles.buttonOn]}
                onPress={toggleFlash}
            >
                <Text style={styles.text}>
                    {isOn ? '💡 Kapat' : '🔦 Aç'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    button: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
    },
    buttonOn: {
        backgroundColor: '#FFD700',
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FlashButton;