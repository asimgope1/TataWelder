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
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { BRAND, WHITE, GRAY } from '../../constants/color';
import Header from '../../components/Header';
import { MyStatusBar } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { POSTNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { CheckBox } from 'react-native-elements';

const NewJob = ({ navigation }) => {
    // State to store form data
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
    });

    // Dropdown states
    const [loading, setLoading] = useState(true);
    const [unitItems, setUnitItems] = useState([]);
    const [componentItems, setComponentItems] = useState([]);
    const [areaItems, setAreaItems] = useState([]);
    const [hangerItems, setHangerItems] = useState([]);
    const [coilItems, setCoilItems] = useState([]);
    const [panelItems, setPanelItems] = useState([]);
    const [rowItems, setRowItems] = useState([]);
    const [tubeItems, setTubeItems] = useState([]);
    const [jointItems, setJointItems] = useState([]);

    // Dropdown controls
    const [dropdownStates, setDropdownStates] = useState({
        unitOpen: false,
        componentOpen: false,
        areaOpen: false,
        hangerOpen: false,
        coilOpen: false,
        panelOpen: false,
        rowOpen: false,
        tubeOpen: false,
        jointOpen: false,
    });

    // Fetch data on mount
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", "Token cf78dfb39e185f7d1951dd55bf6897cff95d1ab6");

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch("http://192.168.0.111:8000/welding/jobmaster/create-job/?component_name=Component-1&area=24&hanger_number=12&coil_number=12&panel_number=23&row_number=45&tube_number=32", requestOptions);
                const data = await response.json();

                if (data.status === "success") {
                    // Update dropdown items with the fetched data
                    setUnitItems(data.data.unit_numbers.map(item => ({ label: item, value: item })));
                    setComponentItems(data.data.component_names.map(item => ({ label: item, value: item })));
                    setAreaItems(data.data.areas.map(item => ({ label: item, value: item })));
                    setHangerItems(data.data.hanger_numbers.map(item => ({ label: item, value: item })));
                    setCoilItems(data.data.coil_numbers.map(item => ({ label: item, value: item })));
                    setPanelItems(data.data.panel_numbers.map(item => ({ label: item, value: item })));
                    setRowItems(data.data.row_numbers.map(item => ({ label: item, value: item })));
                    setTubeItems(data.data.tube_numbers.map(item => ({ label: item, value: item })));
                    setJointItems(data.data.joint_numbers.map(item => ({ label: item, value: item })));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    // Handler to update form fields
    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Function to submit form data
    const handleSubmit = async () => {
        const url = `${BAS_URL}welding/jobmaster/create-job/`;
        console.log('form submit', formData);

        // Use POSTNETWORK for the POST request
        const response = await POSTNETWORK(url, formData, true, false);

        // Check the response and handle success or error
        if (response && response.status === 'success') {
            Alert.alert('Success', 'Job created successfully');
            navigation.goBack(); // Navigate back after successful creation
        } else {
            Alert.alert('Error', 'Failed to create job');
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: WHITE }}>
                <ActivityIndicator size="large" color={BRAND} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: WHITE }}>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <Header
                    onMenuPress={() => navigation.toggleDrawer()}
                    title="New Job"
                />
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
                            paddingBottom: 25,
                            paddingHorizontal: 20,
                        }}
                    >
                        {/* Dropdown for Unit Number */}
                        <DropDownPicker
                            open={dropdownStates.unitOpen}
                            value={formData.unit_number}
                            items={unitItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, unitOpen: open }))}
                            setValue={(value) => handleInputChange('unit_number', value)}
                            placeholder="Select Unit"
                            style={{ marginBottom: 15, width: '100%' }}
                        />

                        {/* Dropdown for Component Name */}
                        <DropDownPicker
                            open={dropdownStates.componentOpen}
                            value={formData.component_name}
                            items={componentItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, componentOpen: open }))}
                            setValue={(value) => handleInputChange('component_name', value)}
                            placeholder="Select Component"
                            style={{ marginBottom: 15, width: '100%' }}
                        />

                        {/* Other dropdown fields for Area, Hanger, Coil, Panel, etc. */}
                        {/* Example for Area */}
                        <DropDownPicker
                            open={dropdownStates.areaOpen}
                            value={formData.area}
                            items={areaItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, areaOpen: open }))}
                            setValue={(value) => handleInputChange('area', value)}
                            placeholder="Select Area"
                            style={{ marginBottom: 15, width: '100%' }}
                        />

                        {/* Repeat for the other dropdown fields like Hanger, Coil, Panel, etc. */}
                        {/* Example for Hanger */}
                        <DropDownPicker
                            open={dropdownStates.hangerOpen}
                            value={formData.hanger_number}
                            items={hangerItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, hangerOpen: open }))}
                            setValue={(value) => handleInputChange('hanger_number', value)}
                            placeholder="Select Hanger"
                            style={{ marginBottom: 15, width: '100%' }}
                        />
                        {/* Repeat for the other dropdown fields like Coil, Panel, etc. */}
                        {/* Example for Coil */}
                        <DropDownPicker
                            open={dropdownStates.coilOpen}
                            value={formData.coil_number}
                            items={coilItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, coilOpen: open }))}
                            setValue={(value) => handleInputChange('coil_number', value)}
                            placeholder="Select Coil"
                            style={{ marginBottom: 15, width: '100%' }}
                        />
                        {/* Repeat for the other dropdown fields like Panel, etc. */}
                        {/* Example for Panel */}
                        <DropDownPicker
                            open={dropdownStates.panelOpen}
                            value={formData.panel_number}
                            items={panelItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, panelOpen: open }))}
                            setValue={(value) => handleInputChange('panel_number', value)}
                            placeholder="Select Panel"
                            style={{ marginBottom: 15, width: '100%' }}
                        />
                        {/* Repeat for the other dropdown fields like Row, Tube, etc. */}
                        {/* Example for Row */}
                        <DropDownPicker
                            open={dropdownStates.rowOpen}
                            value={formData.row_number}
                            items={rowItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, rowOpen: open }))}
                            setValue={(value) => handleInputChange('row_number', value)}
                            placeholder="Select Row"
                            style={{ marginBottom: 15, width: '100%' }}
                        />
                        {/* Repeat for the other dropdown fields like Tube, etc. */}
                        {/* Example for Tube */}
                        <DropDownPicker
                            open={dropdownStates.tubeOpen}
                            value={formData.tube_number}
                            items={tubeItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, tubeOpen: open }))}
                            setValue={(value) => handleInputChange('tube_number', value)}
                            placeholder="Select Tube"
                            style={{ marginBottom: 15, width: '100%' }}
                        />
                        {/* Repeat for the other dropdown fields like Joint, etc. */}
                        {/* Example for Joint */}
                        <DropDownPicker
                            open={dropdownStates.jointOpen}
                            value={formData.joint_number}
                            items={jointItems}
                            setOpen={(open) => setDropdownStates(prev => ({ ...prev, jointOpen: open }))}
                            setValue={(value) => handleInputChange('joint_number', value)}
                            placeholder="Select Joint"
                            style={{ marginBottom: 15, width: '100%' }}
                        />

                        {/* Checkboxes for RT and PAUT */}
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Inspection Type:</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    value={formData.rt}
                                    onValueChange={(value) => handleInputChange('rt', value)}
                                />
                                <Text>RT</Text>
                                <CheckBox
                                    value={formData.paut}
                                    onValueChange={(value) => handleInputChange('paut', value)}
                                />
                                <Text>PAUT</Text>

                            </View>
                        </View>


                        {/* Submit Button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: BRAND,
                                padding: 15,
                                borderRadius: 5,
                                alignItems: 'center',
                            }}
                            onPress={handleSubmit}
                        >
                            <Text style={{ color: WHITE, fontSize: 16 }}>Create Job</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

export default NewJob;
