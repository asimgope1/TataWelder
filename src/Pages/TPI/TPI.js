import { View, Text, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Fragment, useState } from 'react'
import { BRAND, RED } from '../../constants/color'
import Header from '../../components/Header'
import { MyStatusBar } from '../../constants/config'
import { appStyles } from '../../styles/AppStyles'

const TPI = ({ navigation }) => {


    const [currentColor, setCurrentColor] = useState('red'); // Default color is red

    // Function to handle color toggle
    const toggleColor = () => {
        setCurrentColor(prevColor => (prevColor === 'red' ? 'blue' : 'red'));
    };
    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                {/* <Loader visible={loader} /> */}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>

                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            alignItems: 'center',
                            paddingBottom: 20, // Adjust padding bottom to ensure space for scrolling
                        }}>


                        <>
                            <Header
                                onMenuPress={() => {
                                    navigation.toggleDrawer()
                                    console.log('navigation', navigation)
                                }}
                                title="TPI"
                            />


                            <View style={[styles.container, { backgroundColor: currentColor }]}>
                                <Text style={styles.text}>The background color is {currentColor}</Text>
                                <TouchableOpacity style={styles.button} onPress={toggleColor}>
                                    <Text style={styles.buttonText}>Switch Color</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    )
}

export default TPI

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: 'white',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});