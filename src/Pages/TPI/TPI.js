import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { BRAND, GRAY, WHITE } from "../../constants/color";
import Header from "../../components/Header";
import { HEIGHT, MyStatusBar } from "../../constants/config";
import { appStyles } from "../../styles/AppStyles";
import { GETNETWORK } from "../../utils/Network";
import { BAS_URL } from "../../constants/url";
import DropDownPicker from "react-native-dropdown-picker";
import { Calendar } from "react-native-calendars";
import { Icon } from "react-native-elements";

const TPI = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [reportNumber, setReportNumber] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [reportTime, setReportTime] = useState('');

    const [filterCriteria, setFilterCriteria] = useState('');

    const [filtermodalVisible, setfilterModalVisible] = useState(false); // State for modal visibility






    const [startDate, setStartDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [showModal, setShowModal] = useState(false);


    const handleDateSelect = day => {
        setStartDate(day.dateString);

        setReportDate(day.dateString);

        setShowModal(false);
    };


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





    const [selectedFile, setSelectedFile] = useState(null);

    const handleFilePick = async () => {
        try {
            // const [pickResult] = await pick()
            const [pickResult] = await pick({ mode: 'import' }) // equivalent
            console.log('picked one', pickResult)
            setSelectedFile(pickResult)
            // do something with the picked file
        } catch (err) {
            // see error handling
        }
    };
    const handleApiCall = async () => {
        if (selectedFile) {
            // Simulating an API call with the selected file data
            try {
                const response = await fetch('https://your-api-endpoint.com/upload', {
                    method: 'POST',
                    body: JSON.stringify({
                        fileName: selectedFile.name,
                        fileUri: selectedFile.uri,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                console.log('API Response:', result);
            } catch (error) {
                console.error('Error in API call:', error);
            }
        }
    };





    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const url = `${BAS_URL}welding/api/v1/to-be-tpiinspection-list/`;
            GETNETWORK(url, true).then(
                (response) => {
                    if (response.status === 'success') {
                        setData(response.data)
                        console.log('data', response);
                        setLoading(false);
                        // SetJobList(response.data);
                    } else {
                        setLoading(false);
                        console.log('Error:', response.message);
                    }
                }
            );
        };

        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <View
            style={{
                padding: 15,
                marginVertical: 8,
                marginHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
                elevation: 5,
                backgroundColor: 'white'
            }}
        >
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
                Description Number: {item.job_desc_number || 'N/A'}
            </Text>

            <TouchableOpacity

                onPress={() => {
                    // setSelectedJob(item.sl);
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
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={"light-content"} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps={"handled"}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                    >
                        <Header
                            onMenuPress={() => {
                                navigation.toggleDrawer();
                            }}
                            title="TPI"
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color={BRAND} />
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
                                    data={data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <Text style={styles.emptyListText}>
                                                No data available
                                            </Text>

                                        </View>
                                    }
                                />
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Verify Report</Text>

                        {/* Input for Report Number */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Number:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Number"
                                value={reportNumber} // State value for report number
                                onChangeText={(text) => setReportNumber(text)} // Update state
                            />
                        </View>

                        {/* Input for Report Date */}
                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(true);
                            }}
                            style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Date:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Date (YYYY-MM-DD)"
                                value={reportDate} // State value for report date
                                onChangeText={(text) => setReportDate(text)} // Update state
                                editable={false}
                            />
                        </TouchableOpacity>

                        {/* Input for Report Time */}



                        <TouchableOpacity
                            style={{
                                backgroundColor: GRAY,
                                padding: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}

                            onPress={handleFilePick}
                        >
                            <Text style={{
                                color: WHITE,
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>Attach File</Text>

                            <Icon
                                name="attachment"
                                size={25}
                                style={{
                                    marginLeft: 10,
                                }}
                            />

                        </TouchableOpacity>

                        {selectedFile && (
                            <View style={styles.previewContainer}>
                                <Text style={styles.previewText}>Selected File:</Text>
                                <Text style={styles.previewText}>Name: {selectedFile.name}</Text>
                                { }

                                {/* <TouchableOpacity onPress={handleApiCall} style={styles.apiCallButton}>
                                    <Text style={styles.emptyListText}>Send to API</Text>
                                </TouchableOpacity> */}
                            </View>
                        )}

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
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.submitButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

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

            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalContainer}>
                    <Calendar
                        style={styles.calendar}
                        onDayPress={handleDateSelect} // Handle date selection
                    />
                </View>
            </Modal>

        </Fragment>
    );
};

export default TPI;

export const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    submitButton: {
        backgroundColor: '#4CAF50',  // Green
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    filterContainer: {
        width: '100%',
        height: HEIGHT * 0.07,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    // Left content (70% width)
    leftContent: {
        flex: 0.7,
        justifyContent: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterTextInput: {
        width: '95%', // Full width inside the TouchableOpacity
        padding: 10,
        fontSize: 16,
        color: '#333', // Text color
        backgroundColor: '#F0F0F0', // Light background color for input
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    filterText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    // Right side buttons (30% width)
    rightButtons: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // Select Filter button
    selectButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginRight: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        padding: 10,
        backgroundColor: '#FF6347', // Different color for clear action
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // buttonText: {
    // color: '#fff',
    // fontSize: 12,
    // fontWeight: 'bold',
    // },
    dropdown: {
        width: '100%',
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownContainer: {
        borderColor: '#ccc',
    },
    previewContainer: {
        width: '100%',
        height: 70,
        borderRadius: 8,
        elevation: 10,
        backgroundColor: WHITE,
        marginTop: 20,
        alignItems: 'center',
    },
    previewText: {
        fontSize: 14,
        color: 'black',
        marginTop: 5,
    },
    apiCallButton: {
        backgroundColor: 'cyan',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginTop: 15,
        alignSelf: 'center',
    },
});



