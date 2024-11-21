import { View, Text, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, FlatList, TouchableOpacity, Modal, Button, StyleSheet, TextInput } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { BLACK, BRAND, WHITE } from '../../constants/color';
import Header from '../../components/Header';
import { MyStatusBar } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK, POSTNETWORK } from '../../utils/Network'; // Assuming you have this utility function
import { BAS_URL } from '../../constants/url';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../TPI/TPI';
import { Icon } from 'react-native-elements';

const AssignWelder = ({ navigation }) => {
    // State to store the welder list
    const [welderList, setWelderList] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedWelderr, setSelectedWelderr] = useState(null); // State for selected welder
    const [availableWelders, setAvailableWelders] = useState([]); // State for available welders from API
    const [open, setOpen] = useState(false); // State for dropdown open status
    const [items, setItems] = useState([]); // State for dropdown items
    const [selectedJob, setSelectedJob] = useState(''); // State for selected job






    const [filterCriteria, setFilterCriteria] = useState('');

    const [filtermodalVisible, setfilterModalVisible] = useState(false); // State for modal visibility





    const handleFilter = (type) => {
        if (type === 'select') {
            setfilterModalVisible(!filtermodalVisible);; // Open the modal when "Select Filter" is tapped
        } else if (type === 'clear') {
            // Handle filter clear action
            setFilterCriteria('')
            setSelectedComponent(null);
            setSelectedArea(null);
            setSelectedHanger(null);
            setSelectedCoil(null)
            setSelectedPanel(null)
            setSelectedRow(null)
            console.log('Filter cleared');
        }
    };



    const [unitItems, setUnitItems] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [unitOpen, setUnitOpen] = useState(false);

    const [componentItems, setComponentItems] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [componentOpen, setComponentOpen] = useState(false);

    const [areaItems, setAreaItems] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [areaOpen, setAreaOpen] = useState(false);

    const [hangerItems, setHangerItems] = useState([]);
    const [selectedHanger, setSelectedHanger] = useState(null);
    const [hangerOpen, setHangerOpen] = useState(false);

    const [coilItems, setCoilItems] = useState([]);
    const [selectedCoil, setSelectedCoil] = useState(null);
    const [coilOpen, setCoilOpen] = useState(false);

    const [panelItems, setPanelItems] = useState([]);
    const [selectedPanel, setSelectedPanel] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);

    const [rowItems, setRowItems] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowOpen, setRowOpen] = useState(false);

    const [tubeItems, setTubeItems] = useState([]);
    const [selectedTube, setSelectedTube] = useState(null);
    const [tubeOpen, setTubeOpen] = useState(false);

    const [jointItems, setJointItems] = useState([]);
    const [selectedJoint, setSelectedJoint] = useState(null);
    const [jointOpen, setJointOpen] = useState(false);

    const [welderItems, setwelderItems] = useState([]);
    const [selectedWelder, setSelectedWelder] = useState(null);
    const [welderOpen, setWelderOpen] = useState(false);

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${BAS_URL}welding/api/v1/query/filters/`;
                const response = await GETNETWORK(url, true); // Use GETNETWORK instead of fetch

                if (response.status === "success") {
                    // Update state with API data
                    setUnitItems(response.data.unit.map(([id, label]) => ({ label, value: id })));
                    setComponentItems(response.data.components.map((component) => ({ label: component, value: component })));
                    setAreaItems(response.data.areas.map((area) => ({ label: area, value: area })));
                    setHangerItems(response.data.hangers.map((hanger) => ({ label: hanger, value: hanger })));
                    setCoilItems(response.data.coil_number.map((coil) => ({ label: coil, value: coil })));
                    setPanelItems(response.data.panel_number.map((panel) => ({ label: panel, value: panel })));
                    setRowItems(response.data.row_number.map((row) => ({ label: row, value: row })));
                    setTubeItems(response.data.tube_number.map((tube) => ({ label: tube, value: tube })));
                    setJointItems(response.data.joint_number.map((joint) => ({ label: joint, value: joint })));
                    setwelderItems(response.data.welders.map(([id, name]) => ({ label: name, value: id })));
                } else {
                    console.log("Error fetching data:", response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);



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
        <View
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
        // onPress={() => {
        //     setSelectedJob(item.sl);
        //     setModalVisible(true);
        // }} // Show modal on tap
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



                <TouchableOpacity

                    onPress={() => {
                        setSelectedJob(item.sl);
                        setModalVisible(true);
                    }}
                    style={{
                        backgroundColor: 'green',
                        paddingVertical: 10,
                        paddingHorizontal: 25,
                        borderRadius: 5,
                        marginTop: 10,
                    }}
                >
                    <Text style={styless.buttonText}>Assign Welder</Text>
                </TouchableOpacity>

            </View>
        </View>
    );

    // Function to render when the list is empty
    const renderEmptyComponent = () => (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#999' }}>No welders assigned yet.</Text>
        </View>
    );

    // Function to handle assigning welder using POSTNETWORK
    const handleAssignWelder = async () => {
        console.log('sl', selectedJob, 'selectedWelder', selectedWelderr);

        if (selectedWelderr) {
            try {
                // Create the payload object
                const payload = {
                    sl: parseInt(selectedJob), // Converts selectedJob to an integer
                    weldersl: selectedWelderr,
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
                        <View style={{ width: '100%', paddingHorizontal: 5, }}>
                            {loading ? (
                                <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 }}>
                                    Loading welders...
                                </Text>
                            ) : (
                                <>

                                    <View style={styles.filterContainer}>
                                        {/* Left side content, 70% width */}
                                        <View style={styles.leftContent}>
                                            {/* <TouchableOpacity style={styles.filterButton}> */}
                                            <TextInput
                                                style={styles.filterTextInput}
                                                placeholder="Enter Filter Criteria"
                                                placeholderTextColor="#888"
                                                value={filterCriteria}
                                                editable={false}
                                                multiline
                                            // onChangeText={(text) => setFilterCriteria(text)}
                                            />
                                            {/* </TouchableOpacity> */}
                                        </View>

                                        {/* Right side buttons, 30% width */}
                                        <View style={styles.rightButtons}>
                                            <TouchableOpacity
                                                style={styles.selectButton}
                                                onPress={() => handleFilter('select')}
                                            > <Icon
                                                    name={'filter-alt'}
                                                    type='material'
                                                    color={WHITE}
                                                    size={24}
                                                    containerStyle={{ marginBottom: 5 }}
                                                />
                                                <Text style={{
                                                    color: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                }}>Filter</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{ ...styles.clearButton, backgroundColor: filterCriteria.length > 0 ? '#FF6347' : '#4CAF50' }}
                                                onPress={() => handleFilter('clear')}
                                            >
                                                <Icon
                                                    name={'delete'}
                                                    type='material'
                                                    color={WHITE}
                                                    size={24}
                                                    containerStyle={{ marginBottom: 5 }}
                                                />
                                                <Text style={{
                                                    color: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                }}>Clear </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <FlatList
                                        data={welderList}
                                        renderItem={renderWelderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                        ListEmptyComponent={renderEmptyComponent} // Component to show when the list is empty
                                    />
                                </>
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
                    <View style={styless.modalBackdrop}>
                        <View style={styless.modalContainer}>
                            <Text style={styless.modalTitle}>Assign Welder</Text>

                            {/* DropDownPicker for welder selection */}
                            <DropDownPicker
                                searchable={true}
                                open={open}
                                value={selectedWelderr}
                                items={items}
                                setOpen={setOpen}
                                setValue={setSelectedWelderr}
                                setItems={setItems}
                                placeholder="Select Welder"
                                style={styless.dropdownStyle}
                                textStyle={styless.dropdownTextStyle}
                                dropDownStyle={styless.dropdownListStyle}
                            />

                            <View style={styless.buttonContainer}>

                                <TouchableOpacity style={styless.assignButton} onPress={handleAssignWelder}>
                                    <Text style={styless.buttonText}>Assign Welder</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styless.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styless.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
            <Modal
                visible={filtermodalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setfilterModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Filter</Text>




                        <DropDownPicker
                            searchable={true}
                            open={unitOpen}
                            value={selectedUnit}
                            items={unitItems}
                            setOpen={setUnitOpen}
                            setValue={setSelectedUnit}
                            setItems={setUnitItems}
                            placeholder="Select Unit"
                            style={{ ...styles.dropdown, zIndex: 1200 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />



                        <DropDownPicker
                            searchable={true}
                            open={componentOpen}
                            value={selectedComponent}
                            items={componentItems}
                            setOpen={setComponentOpen}
                            setValue={setSelectedComponent}
                            setItems={setComponentItems}
                            placeholder="Select Component"
                            style={{ ...styles.dropdown, zIndex: 1100 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        {/* Area Dropdown */}
                        <DropDownPicker
                            searchable={true}
                            open={areaOpen}
                            value={selectedArea}
                            items={areaItems}
                            setOpen={setAreaOpen}
                            setValue={setSelectedArea}
                            setItems={setAreaItems}
                            placeholder="Select Area"
                            style={{ ...styles.dropdown, zIndex: 1000 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        {/* Hanger Dropdown */}
                        <DropDownPicker
                            searchable={true}
                            open={hangerOpen}
                            value={selectedHanger}
                            items={hangerItems}
                            setOpen={setHangerOpen}
                            setValue={setSelectedHanger}
                            setItems={setHangerItems}
                            placeholder="Select Hanger"
                            style={{ ...styles.dropdown, zIndex: 900 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                        <DropDownPicker
                            searchable={true}
                            open={coilOpen}
                            value={selectedCoil}
                            items={coilItems}
                            setOpen={setCoilOpen}
                            setValue={setSelectedCoil}
                            setItems={setCoilItems}
                            placeholder="Select Coil"
                            style={{ ...styles.dropdown, zIndex: 800 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                        <DropDownPicker
                            searchable={true}
                            open={panelOpen}
                            value={selectedPanel}
                            items={panelItems}
                            setOpen={setPanelOpen}
                            setValue={setSelectedPanel}
                            setItems={setPanelItems}
                            placeholder="Select Panel"
                            style={{ ...styles.dropdown, zIndex: 700 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                        <DropDownPicker
                            searchable={true}
                            open={rowOpen}
                            value={selectedRow}
                            items={rowItems}
                            setOpen={setRowOpen}
                            setValue={setSelectedRow}
                            setItems={setRowItems}
                            placeholder="Select Row"
                            style={{ ...styles.dropdown, zIndex: 600 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        <DropDownPicker
                            searchable={true}
                            open={tubeOpen}
                            value={selectedTube}
                            items={tubeItems}
                            setOpen={setTubeOpen}
                            setValue={setSelectedTube}
                            setItems={setTubeItems}
                            placeholder="Select Tube"
                            style={{ ...styles.dropdown, zIndex: 500 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                        <DropDownPicker
                            searchable={true}
                            open={jointOpen}
                            value={selectedJoint}
                            items={jointItems}
                            setOpen={setJointOpen}
                            setValue={setSelectedJoint}
                            setItems={setJointItems}
                            placeholder="Select Joint"
                            style={{ ...styles.dropdown, zIndex: 400 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                        <DropDownPicker
                            searchable={true}
                            open={welderOpen}
                            value={selectedWelder}
                            items={welderItems}
                            setOpen={setWelderOpen}
                            setValue={setSelectedWelder}
                            setItems={setwelderItems}
                            placeholder="Select welder"
                            style={{ ...styles.dropdown, zIndex: 300 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        {/* Buttons */}
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-evenly',
                            }}
                        >


                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={() => setfilterModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.submitButton]}
                                    onPress={() => {
                                        const criteria = [
                                            selectedComponent,
                                            selectedArea,
                                            selectedHanger,
                                            selectedCoil,
                                            selectedPanel,
                                            selectedRow,
                                        ]
                                            .filter(Boolean) // Remove any null or undefined values
                                            .join(', '); // Join them with a comma for better readability

                                        setFilterCriteria(criteria); // Set the concatenated string
                                        setfilterModalVisible(false);
                                    }}

                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </Fragment>
    );
};

export default AssignWelder;

const styless = StyleSheet.create({
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
        fontWeight: '600',
        textAlign: 'center',
    },
});


