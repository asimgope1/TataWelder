import { View, Text, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, FlatList, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { BRAND } from '../../constants/color';
import Header from '../../components/Header';
import { MyStatusBar } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK, POSTNETWORK } from '../../utils/Network'; // Assuming you have this utility function
import { BAS_URL } from '../../constants/url';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker
import { useFocusEffect } from '@react-navigation/native';

const AssignWelder = ({ navigation }) => {
    // State to store the welder list
    const [welderList, setWelderList] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedWelder, setSelectedWelder] = useState(null); // State for selected welder
    const [availableWelders, setAvailableWelders] = useState([]); // State for available welders from API
    const [open, setOpen] = useState(false); // State for dropdown open status
    const [items, setItems] = useState([]); // State for dropdown items
    const [selectedJob, setSelectedJob] = useState(''); // State for selected job


    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            fetchWelderList()
            return () => {
                // Do something when the screen is unfocused or closed
            };
        }, [navigation])

    )

    useEffect(() => {
        fetchWelderList();
        fetchAvailableWelders(); // Fetch available welders to assign
    }, []);

    // Function to fetch welder list using GETNETWORK
    const fetchWelderList = async () => {
        setLoading(true); // Show loading while fetching
        try {
            const url = `${BAS_URL}welding/welderassign/list/`;
            const response = await GETNETWORK(url, true);

            if (response.status === 'success') {
                console.log('Welder List:', response.data);
                setWelderList(response.data || []); // Update the state with the fetched list or an empty array if null
            } else {
                console.log('Error:', response.message);
            }
        } catch (error) {
            console.error('Error fetching welder list:', error);
        } finally {
            setLoading(false); // Hide loading once the request is complete
        }
    };

    // Function to fetch available welders using GETNETWORK
    const fetchAvailableWelders = async () => {
        try {
            const url = `${BAS_URL}welding/api/v1/welder-list/`;
            const response = await GETNETWORK(url, true);

            if (response.status === 'success') {
                console.log('Available Welders:', response.data);
                // Format welders data for dropdown
                const formattedWelders = response.data.map(welder => ({
                    label: welder.welder_name,
                    value: welder.weldersl
                }));
                setItems(formattedWelders); // Update dropdown items
            } else {
                console.log('Error:', response.message);
            }
        } catch (error) {
            console.error('Error fetching available welders:', error);
        }
    };

    // Function to render each item in the FlatList
    const renderWelderItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                padding: 15,
                marginVertical: 8,
                marginHorizontal: 10,
                borderLeftWidth: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
                borderLeftColor: 'orange',

            }}
            onPress={() => {
                setSelectedJob(item.sl);
                setModalVisible(true);
            }} // Show modal on tap
        >
            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                    Job Number: {item.job_number}
                </Text>
                <Text style={{ fontSize: 14, color: '#555' }}>
                    Component Name: {item.component_name}
                </Text>
                <Text style={{ fontSize: 14, color: '#555' }}>
                    Unit Number: {item.unit_number}
                </Text>
                <Text style={{ fontSize: 14, color: '#555' }}>
                    Joint Number: {item.joint_number}
                </Text>
                <Text style={{ fontSize: 12, color: '#888' }}>
                    Job Description Number: {item.job_desc_number}
                </Text>
                <Text style={{ fontSize: 12, color: '#888' }}>
                    Job Offer Date: {item.job_offer_date}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Function to render when the list is empty
    const renderEmptyComponent = () => (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#999' }}>No welders assigned yet.</Text>
        </View>
    );

    // Function to handle assigning welder using POSTNETWORK
    const handleAssignWelder = async () => {
        console.log('sl', selectedJob, 'selectedWelder', selectedWelder);

        if (selectedWelder) {
            try {
                // Create the payload object
                const payload = {
                    sl: parseInt(selectedJob), // Converts selectedJob to an integer
                    weldersl: selectedWelder,
                };

                // Use POSTNETWORK to send the POST request
                const response = await POSTNETWORK(
                    `${BAS_URL}welding/welderassign/`,
                    payload,
                    true // Pass true if you need the token for authorization
                );

                // Log the response
                console.log('Assignment Response:', response);
                fetchWelderList()

                // Close the modal after successful assignment
                setModalVisible(false);
            } catch (error) {
                console.error('Error assigning welder:', error);
            }
        } else {
            console.log("No welder selected.");
        }
    };

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            alignItems: 'center',
                            paddingBottom: 20,
                        }}
                    >
                        <Header
                            onMenuPress={() => {
                                navigation.toggleDrawer();
                            }}
                            title="Assign-Welder"
                        />

                        {/* Welder List Display */}
                        <View style={{ width: '100%', paddingHorizontal: 10, marginTop: 20 }}>
                            {loading ? (
                                <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 }}>
                                    Loading welders...
                                </Text>
                            ) : (
                                <FlatList
                                    data={welderList}
                                    renderItem={renderWelderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={renderEmptyComponent} // Component to show when the list is empty
                                />
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Modal for welder assignment */}
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Assign Welder</Text>

                            {/* DropDownPicker for welder selection */}
                            <DropDownPicker
                                open={open}
                                value={selectedWelder}
                                items={items}
                                setOpen={setOpen}
                                setValue={setSelectedWelder}
                                setItems={setItems}
                                placeholder="Select Welder"
                                style={styles.dropdownStyle}
                                textStyle={styles.dropdownTextStyle}
                                dropDownStyle={styles.dropdownListStyle}
                            />

                            <View style={styles.buttonContainer}>

                                <TouchableOpacity style={styles.assignButton} onPress={handleAssignWelder}>
                                    <Text style={styles.buttonText}>Assign Welder</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </Fragment>
    );
};

export default AssignWelder;

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    dropdownStyle: {
        width: '100%',
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    dropdownTextStyle: {
        fontSize: 16,
        color: '#333',
    },
    dropdownListStyle: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderRadius: 8,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    assignButton: {
        backgroundColor: '#4CAF50',  // Green
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',  // Red
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});


