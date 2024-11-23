import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    Modal,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { BRAND, WHITE, GRAY } from '../../constants/color';
import Header from '../../components/Header';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK, POSTNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { CheckBox } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

const NewJob = ({ navigation }) => {
    const resetForm = () => {
        setFormData({
            unit_number: '',
            component_name: '',
            area: '',
            hanger_number: '',
            coil_number: '',
            panel_number: '',
            row_number: '',
            tube_number: '',
            joint_number: '',
            rt_required: false,
            paut_required: false,
            job_details: "",
            tube_joints: '',
            job_desc_number: "",
            offer_date: new Date().toISOString().slice(0, 10), // Reset to current date
        });
        setUnitItems([]);
        setcomponentItems([]);
        setAreaItems([]);
        setHangerItems([]);
        setCoilItems([]);
        setPanelItems([]);
        setRowItems([]);
        setTubeItems([]);
        setJointItems([]);
        setDropdownStates({ unitOpen: false });
        setcomponentStates({ componentOpen: false });
        setAreaStates({ areaOpen: false });
        setHangerStates({ hangerOpen: false });
        setCoilStates({ coilOpen: false });
        setPanelStates({ panelOpen: false });
        setRowStates({ rowOpen: false });
        setTubeStates({ tubeOpen: false });
        setJointStates({ jointOpen: false });
    };
    const [formData, setFormData] = useState({
        unit_number: '',
        component_name: '',
        area: '',
        hanger_number: '',
        coil_number: '',
        panel_number: '',
        row_number: '',
        tube_number: '',
        joint_number: '',
        rt_required: false,
        paut_required: false,
        job_details: "",
        tube_joints: "",
        job_desc_number: "",
        offer_date: startDate,
    });
    const [startDate, setStartDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            tube_joints: `${prevData.tube_number} ${prevData.joint_number}`,
            job_desc_number: `${prevData.area} ${prevData.hanger_number} ${prevData.coil_number} ${prevData.panel_number} ${prevData.row_number}`,
        }));
    }, [
        formData.tube_number,
        formData.joint_number,
        formData.area,
        formData.hanger_number,
        formData.panel_number,
        formData.row_number,
        formData.coil_number,

    ]);

    const [showModal, setShowModal] = useState(false);


    const handleDateSelect = day => {
        setStartDate(day.dateString);

        setFormData(prevState => ({
            ...prevState,
            offer_date: day.dateString, // Sets the current date
        }));

        setShowModal(false);
    };

    const [loading, setLoading] = useState(true);

    const [unitItems, setUnitItems] = useState([]);
    const [dropdownStates, setDropdownStates] = useState({
        unitOpen: false,
    });
    const [componentItems, setcomponentItems] = useState([]);
    const [componentStates, setcomponentStates] = useState({
        componentOpen: false,
    });

    const [areaItems, setAreaItems] = useState([]);
    const [areaStates, setAreaStates] = useState({
        areaOpen: false,
    });
    const [hangerItems, setHangerItems] = useState([]);
    const [hangerStates, setHangerStates] = useState({
        hangerOpen: false,
    });
    const [coilItems, setCoilItems] = useState([]);
    const [coilStates, setCoilStates] = useState({
        coilOpen: false,
    });
    const [panelItems, setPanelItems] = useState([]);
    const [panelStates, setPanelStates] = useState({
        panelOpen: false,
    });
    const [rowItems, setRowItems] = useState([]);
    const [rowStates, setRowStates] = useState({
        rowOpen: false,
    });
    const [tubeItems, setTubeItems] = useState([]);
    const [tubeStates, setTubeStates] = useState({
        tubeOpen: false,
    });
    const [jointItems, setJointItems] = useState([]);
    const [jointStates, setJointStates] = useState({
        jointOpen: false,
    });




    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const response = await GETNETWORK(
                    `${BAS_URL}welding/jobmaster/create-job/`,
                    true,
                );

                if (response.status === 'success') {
                    setUnitItems(
                        response.data.unit_number.map(item => ({ label: item, value: item })),
                    );
                    setcomponentItems([]);
                    setAreaItems([]);
                    setHangerItems([]);
                    setCoilItems([]);
                    setPanelItems([]);
                    setRowItems([]);
                    setTubeItems([]);
                    setJointItems([]);


                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDropdownData();
    }, [navigation]);

    const handleInputChange = (field, value) => {
        setFormData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validate the required fields before form submission
        if (
            !formData.area &&
            !formData.hanger_number &&
            !formData.coil_number &&
            !formData.panel_number
        ) {
            Alert.alert('Validation Error', 'Please fill at least one of the following: Area, Hanger Number, Coil Number, or Panel Number.');
            return;
        }
        if (!formData.tube_number && !formData.joint_number) {
            Alert.alert('Validation Error', 'Please fill at least one of the following: Tube Number or Joint Number.');
            return;
        }


        try {
            console.log('Form submit', formData);

            const url = `${BAS_URL}welding/jobmaster/create-job/`;
            const response = await POSTNETWORK(url, formData, true, false);

            console.log('Response:', response);

            if (response && response.status === 'success') {
                resetForm(); // Reset all states if the submission is successful
                Alert.alert('Success', 'Job created successfully');
                navigation.navigate('DashBoard');
            } else {
                Alert.alert('Error', response?.errors?.error || 'Failed to create job');
                resetForm()
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };


    useFocusEffect(
        React.useCallback(() => {
            resetForm()
        }, [navigation]
        ))

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: WHITE,
                }}>
                <ActivityIndicator size="large" color={BRAND} />
            </View>
        );
    }



    const areaSelect = async value => {
        // console.log('value-areaSelect', value);

        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${value}`,
                true,
            );

            if (response.status === 'success') {
                // console.log('for areaSelect', response);
                // setHangerItems(
                //     response.data.hanger_number.map(item => ({ label: item, value: item })),
                // );
                // setCoilItems(
                //     response.data.coil_number.map(item => ({ label: item, value: item })),
                // );
                // setPanelItems(
                //     response.data.panel_number.map(item => ({ label: item, value: item })),
                // );
                // setRowItems(
                //     response.data.row_number.map(item => ({ label: item, value: item })),
                // )
                // setTubeItems(
                //     response.data.tube_number.map(item => ({ label: item, value: item })),
                // );
                // setJointItems(
                //     response.data.joint_number.map(item => ({ label: item, value: item })),
                // );


            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };



    const hangerSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&hanger_number=${value}`,
                true,
            );

            if (response.status === 'success') {

                setHangerItems(
                    response.data.hanger_number.map(item => ({ label: item, value: item })),
                );
                setCoilItems(
                    response.data.coil_number.map(item => ({ label: item, value: item })),
                );
                setPanelItems(
                    response.data.panel_number.map(item => ({ label: item, value: item })),
                );
                setRowItems(
                    response.data.row_number.map(item => ({ label: item, value: item })),
                );
                setTubeItems(
                    response.data.tube_number.map(item => ({ label: item, value: item })),
                );
                setJointItems(
                    response.data.joint_number.map(item => ({ label: item, value: item })),
                );
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const coilSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${value}`,
                true,
            );
            if (response.status === 'success') {

                setHangerItems(
                    response.data.hanger_number.map(item => ({ label: item, value: item })),
                );
                setPanelItems(
                    response.data.panel_number.map(item => ({ label: item, value: item })),
                );
                setRowItems(
                    response.data.row_number.map(item => ({ label: item, value: item })),
                );
                setTubeItems(
                    response.data.tube_number.map(item => ({ label: item, value: item })),
                );
                setJointItems(
                    response.data.joint_number.map(item => ({ label: item, value: item })),
                );
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };





    const UnitSelect = async value => {
        console.log('here')

        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?unit_number=${value}`,
                true,
            );

            if (response.status === 'success') {
                // console.log('UnitSelect ', response);

                setcomponentItems(
                    response.data.component_name.map(item => ({ label: item, value: item })),
                );
                setAreaItems([]);
                setHangerItems([]);
                setCoilItems([]);
                setPanelItems([]);
                setRowItems([]);
                setTubeItems([]);
                setJointItems([]);



            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }

    }


    const componentSelect = async value => {
        console.log('value-componentSelect', formData.unit_number);

        try {
            // Fetching data from API based on selected unit_number and component_name
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?unit_number=${formData.unit_number}&component_name=${value}`,
                true,
            );

            if (response.status === 'success') {
                console.log('componentSelect', response);

                // Setting state for each dropdown item based on the API response
                setAreaItems(
                    response.data.area.map(item => ({ label: item, value: item }))
                );
                setHangerItems(
                    response.data.hanger_number.map(item => ({ label: item, value: item }))
                );
                setCoilItems(
                    response.data.coil_number.map(item => ({ label: item, value: item }))
                );
                setPanelItems(
                    response.data.panel_number.map(item => ({ label: item, value: item }))
                );
                setRowItems(
                    response.data.row_number.map(item => ({ label: item, value: item }))
                );
                setTubeItems(
                    response.data.tube_number.map(item => ({ label: item, value: item }))
                );
                setJointItems(
                    response.data.joint_number.map(item => ({ label: item, value: item }))
                );
            } else {
                console.error('Failed to fetch data:', response.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    console.log('form', formData)



    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}> {/* Light gray background */}
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <Header onMenuPress={() => navigation.toggleDrawer()} title="New Job" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 25,
                            paddingHorizontal: 20,
                        }}>
                        <View style={{ flex: 1, width: WIDTH, alignItems: 'center', alignSelf: 'center', paddingHorizontal: 10, elevation: 10, backgroundColor: WHITE }}>

                            <View
                                style={{
                                    flex: 1,
                                    width: WIDTH * 0.96, // Make sure you have a valid WIDTH value (e.g., `Dimensions.get('window').width`)
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    paddingHorizontal: 10,
                                    elevation: 10, // Adds shadow for Android
                                    backgroundColor: WHITE,
                                    borderRadius: 10, // Rounded corners for the card
                                    shadowColor: '#000', // Shadow color
                                    shadowOffset: { width: 0, height: 5 }, // Shadow offset
                                    shadowOpacity: 0.2, // Shadow opacity
                                    shadowRadius: 10, // Shadow spread radius
                                    marginTop: 5

                                }}
                            >


                                {/* Card Section for Date and Unit */}
                                <View style={{ ...styles.cardContainer, zIndex: 1100 }}>
                                    <Text style={styles.sectionTitle}>Job Details</Text>
                                    <View style={styles.row}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowModal(true);
                                            }}
                                            style={styles.inputContainer}>
                                            <Text style={{ ...styles.dropdownHeader, marginTop: 5 }}>Date</Text>
                                            <View style={styles.dateContainer}>
                                                <Text style={appStyles.dateText}>Date: {startDate}</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Unit</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={dropdownStates.unitOpen}
                                                value={formData.unit_number}
                                                items={unitItems}
                                                setOpen={open =>
                                                    setDropdownStates(prevState => ({
                                                        ...prevState,
                                                        unitOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('unit_number', value);
                                                }}
                                                onSelectItem={item => {
                                                    // console.log('item', item);
                                                    UnitSelect(item?.value);
                                                }}
                                                placeholder="Select Unit"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Card Section for Component and Area */}
                                <View style={{ ...styles.cardContainer, zIndex: 1000 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Component</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={componentStates.componentOpen}
                                                value={formData.component_name}
                                                items={componentItems}
                                                setOpen={open =>
                                                    setcomponentStates(prevState => ({
                                                        ...prevState,
                                                        componentOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('component_name', value);
                                                }}
                                                onSelectItem={item => {
                                                    componentSelect(item?.value);
                                                }}
                                                placeholder="Component"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Area</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={areaStates.areaOpen}
                                                value={formData.area}
                                                items={areaItems}
                                                setOpen={open =>
                                                    setAreaStates(prevState => ({
                                                        ...prevState,
                                                        areaOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('area', value);
                                                }}
                                                onSelectItem={item => {
                                                    areaSelect(item?.value);
                                                }}
                                                placeholder="Select Area"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Additional Card Sections for Other Fields */}
                                <View style={{ ...styles.cardContainer, zIndex: 900 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Hanger Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={hangerStates.hangerOpen}
                                                value={formData.hanger_number}
                                                items={hangerItems}
                                                setOpen={open =>
                                                    setHangerStates(prevState => ({
                                                        ...prevState,
                                                        hangerOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('hanger_number', value);
                                                }}
                                                onSelectItem={
                                                    item => hangerSelect(item?.value)
                                                }
                                                placeholder="Hanger Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Coil Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={coilStates.coilOpen}
                                                value={formData.coil_number} // Ensure formData.coil_number is a valid value
                                                items={coilItems} // Ensure coilItems has a structure like [{ label: 'Item 1', value: 'item1' }]
                                                setOpen={open =>
                                                    setCoilStates(prevState => ({ ...prevState, coilOpen: open }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('coil_number', value); // Ensure the correct field is updated
                                                }}
                                                onSelectItem={item => coilSelect(item?.value)}
                                                placeholder="Select Coil Number" // Improved placeholder for clarity
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ ...styles.cardContainer, zIndex: 800 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Panel Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={panelStates.panelOpen}
                                                value={formData.panel_number}
                                                items={panelItems}
                                                setOpen={open =>
                                                    setPanelStates(prevState => ({
                                                        ...prevState,
                                                        panelOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('panel_number', value);
                                                }}
                                                placeholder="Panel Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Row Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={rowStates.rowOpen}
                                                value={formData.row_number}
                                                items={rowItems}
                                                setOpen={open =>
                                                    setRowStates(prevState => ({ ...prevState, rowOpen: open }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('row_number', value);
                                                }}
                                                placeholder="Row Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>


                                    </View>
                                </View>
                                <View style={{ ...styles.cardContainer, zIndex: 700 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Tube Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={tubeStates.tubeOpen}
                                                value={formData.tube_number} // Should correspond to 'tube_number'
                                                items={tubeItems} // Ensure tubeItems has a correct structure
                                                setOpen={open =>
                                                    setTubeStates(prevState => ({
                                                        ...prevState,
                                                        tubeOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('tube_number', value); // Correct field updated
                                                }}
                                                placeholder="Tube Number" // Placeholder corrected
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />

                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Joint Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={jointStates.jointOpen}
                                                value={formData.joint_number} // Correct value should be 'joint_number'
                                                items={jointItems} // Ensure jointItems is structured correctly
                                                setOpen={open =>
                                                    setJointStates(prevState => ({
                                                        ...prevState,
                                                        jointOpen: open
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('joint_number', value); // Correct field updated
                                                }}
                                                placeholder="Joint Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />

                                        </View>


                                    </View>
                                </View>

                                <View style={{ ...styles.cardContainer, zIndex: 600 }}>
                                    <View style={styles.row}>



                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Tube Joints</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={`${formData.tube_number} ${formData.joint_number}`}
                                                onChangeText={text => handleInputChange('tube_joints', `${formData.tube_number} ${formData.joint_number}`)}
                                                placeholder="Enter Tube Joints"
                                                keyboardType="numeric"
                                                editable={false}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Job Description</Text>
                                            <TextInput
                                                style={[styles.textInput, styles.disabledInput]}
                                                value={`${formData.area} ${formData.hanger_number} ${formData.panel_number} ${formData.row_number}`}
                                                onChangeText={text => handleInputChange('job_desc_number', `${formData.area} ${formData.hanger_number} ${formData.panel_number} ${formData.row_number}`)}
                                                editable={false} // Disabled field
                                            />
                                        </View>

                                    </View>

                                </View>

                                <View style={{ ...styles.inputContainer, width: '95%', }}>
                                    <Text style={styles.label}>Job Details</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={formData.job_details}
                                        onChangeText={text => handleInputChange('job_details', text)}
                                        placeholder="Enter Job Details"
                                        multiline
                                    />
                                </View>




                                {/* Checkbox Section */}
                                <View style={styles.cardContainer}>
                                    <Text style={styles.sectionTitle}>Options</Text>
                                    <View style={styles.checkboxRow}>
                                        <CheckBox
                                            title="RT Required"
                                            checked={formData.rt_required}
                                            onPress={() =>
                                                handleInputChange('rt_required', !formData.rt_required)
                                            }
                                        />
                                        <CheckBox
                                            title="PAUT Required"
                                            checked={formData.paut_required}
                                            onPress={() =>
                                                handleInputChange('paut_required', !formData.paut_required)
                                            }
                                        />
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={appStyles.submitButton}
                                    onPress={handleSubmit}>
                                    <Text style={appStyles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
            </SafeAreaView>
        </View >

    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        // marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    calendar: {
        alignSelf: 'center',
        width: '80%',
        marginTop: 100,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    textInput: {
        height: 50,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        width: '48%', // Makes two fields fit side by side,
    },
    dropdownStyle: {
        width: '100%',
        marginTop: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownTextStyle: {
        fontSize: 15,
        color: '#333',
    },
    dropdownHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 12,
    },
    dateContainer: {
        height: 50,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
});


export default NewJob;
