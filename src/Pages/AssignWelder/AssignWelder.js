import { View, Text, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { BRAND } from '../../constants/color';
import Header from '../../components/Header';
import { MyStatusBar } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK } from '../../utils/Network'; // Assuming you have this utility function
import { BAS_URL } from '../../constants/url';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker

const AssignWelder = ({ navigation }) => {
    // State to store the welder list
    const [welderList, setWelderList] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedWelder, setSelectedWelder] = useState(null); // State for selected welder
    const [availableWelders, setAvailableWelders] = useState([]); // State for available welders from API
    const [open, setOpen] = useState(false); // State for dropdown open status
    const [items, setItems] = useState([]); // State for dropdown items
    const [selectedJob, setselectedJob] = useState(''); // State for alert message

    useEffect(() => {
        fetchWelderList();
        fetchAvailableWelders(); // Fetch available welders to assign
    }, []);

    // Function to fetch welder list
    const fetchWelderList = () => {
        setLoading(true); // Show loading while fetching
        const url = `${BAS_URL}welding/welderassign/list/`;
        GETNETWORK(url, true).then(
            (response) => {
                if (response.status === 'success') {
                    console.log('Welder List:', response.data);
                    setWelderList(response.data || []); // Update the state with the fetched list or an empty array if null
                } else {
                    console.log('Error:', response.message);
                }
            },
        ).catch(error => {
            console.error('Error fetching welder list:', error);
        }).finally(() => {
            setLoading(false); // Hide loading once the request is complete
        });
    };

    // Function to fetch available welders
    const fetchAvailableWelders = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Token cf78dfb39e185f7d1951dd55bf6897cff95d1ab6");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${BAS_URL}welding/api/v1/welder-list/`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log('Available Welders:', result.data);
                // Format welders data for dropdown
                const formattedWelders = result.data.map(welder => ({
                    label: welder.welder_name,
                    value: welder.weldersl
                }));
                setItems(formattedWelders); // Update dropdown items
            })
            .catch((error) => console.error('Error fetching available welders:', error));
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
                borderWidth: 1,
                borderColor: '#ddd',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
            }}
            onPress={() => {


                setselectedJob(item.sl)
                setModalVisible(true)
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

    // Function to handle assigning welder
    const handleAssignWelder = () => {
        console.log('sl', selectedJob, 'selectedWelder', selectedWelder)
        if (selectedWelder) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Token cf78dfb39e185f7d1951dd55bf6897cff95d1ab6");
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                sl: parseInt(selectedJob), // Converts selectedJob to an integer
                weldersl: selectedWelder,
            });


            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${BAS_URL}welding/welderassign/`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log('Assignment Response:', result);
                    // Close modal after assigning
                    setModalVisible(false);
                })
                .catch((error) => console.error('Error assigning welder:', error));
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
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '80%',
                        }}>
                            <Text style={{ fontSize: 18, marginBottom: 10 }}>Assign Welder</Text>

                            {/* DropDownPicker for welder selection */}
                            <DropDownPicker
                                open={open}
                                value={selectedWelder}
                                items={items}
                                setOpen={setOpen}
                                setValue={setSelectedWelder}
                                setItems={setItems}
                                placeholder="Select Welder"
                            />

                            <Button title="Assign Welder" onPress={handleAssignWelder} />
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </Fragment>
    );
};

export default AssignWelder;
