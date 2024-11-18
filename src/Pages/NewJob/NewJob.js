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
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { BRAND, WHITE, GRAY } from '../../constants/color';
import Header from '../../components/Header';
import { MyStatusBar, WIDTH } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { POSTNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { CheckBox } from 'react-native-elements';

const NewJob = ({ navigation }) => {
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
        date: new Date().toLocaleDateString(),
    });

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

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleSubmit = async () => {
        const url = `${BAS_URL}welding/jobmaster/create-job/`;

        const response = await POSTNETWORK(url, formData, true, false);

        if (response && response.status === 'success') {
            Alert.alert('Success', 'Job created successfully');
            navigation.goBack();
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
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 25, paddingHorizontal: 20 }}
                    >
                        <View style={{ flex: 1, width: WIDTH, alignItems: 'center' }}>
                            <View style={appStyles.dateSection}>
                                <Text style={appStyles.dateText}>Date: {formData.date}</Text>
                            </View>

                            {/* Dropdowns in Grid (2 per row) */}
                            <View style={styles.gridContainer}>
                                <DropDownPicker
                                    open={dropdownStates.unitOpen}
                                    value={formData.unit_number}
                                    items={unitItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, unitOpen: open }))}
                                    setValue={(value) => handleInputChange('unit_number', value)}
                                    placeholder="Select Unit"
                                    style={styles.dropdown}
                                />
                                <DropDownPicker
                                    open={dropdownStates.componentOpen}
                                    value={formData.component_name}
                                    items={componentItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, componentOpen: open }))}
                                    setValue={(value) => handleInputChange('component_name', value)}
                                    placeholder="Select Component"
                                    style={styles.dropdown}
                                />
                            </View>


                            <View style={styles.gridContainer}>
                                <DropDownPicker
                                    open={dropdownStates.areaOpen}
                                    value={formData.area}
                                    items={areaItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, areaOpen: open }))}
                                    setValue={(value) => handleInputChange('area', value)}
                                    placeholder="Select Area"
                                    style={styles.dropdown}
                                />
                                <DropDownPicker
                                    open={dropdownStates.hangerOpen}
                                    value={formData.hanger_number}
                                    items={hangerItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, hangerOpen: open }))}
                                    setValue={(value) => handleInputChange('hanger_number', value)}
                                    placeholder="Select Hanger"
                                    style={styles.dropdown}
                                />
                            </View>

                            <View style={styles.gridContainer}>
                                <DropDownPicker
                                    open={dropdownStates.coilOpen}
                                    value={formData.coil_number}
                                    items={coilItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, coilOpen: open }))}
                                    setValue={(value) => handleInputChange('coil_number', value)}
                                    placeholder="Select Coil"
                                    style={styles.dropdown}
                                />
                                <DropDownPicker
                                    open={dropdownStates.panelOpen}
                                    value={formData.panel_number}
                                    items={panelItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, panelOpen: open }))}
                                    setValue={(value) => handleInputChange('panel_number', value)}
                                    placeholder="Select Panel"
                                    style={styles.dropdown}
                                />
                            </View>

                            <View style={styles.gridContainer}>
                                <DropDownPicker
                                    open={dropdownStates.rowOpen}
                                    value={formData.row_number}
                                    items={rowItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, rowOpen: open }))}
                                    setValue={(value) => handleInputChange('row_number', value)}
                                    placeholder="Select Row"
                                    style={styles.dropdown}
                                />
                                <DropDownPicker
                                    open={dropdownStates.tubeOpen}
                                    value={formData.tube_number}
                                    items={tubeItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, tubeOpen: open }))}
                                    setValue={(value) => handleInputChange('tube_number', value)}
                                    placeholder="Select Tube"
                                    style={styles.dropdown}
                                />
                            </View>

                            <View style={styles.gridContainer}>
                                <DropDownPicker
                                    open={dropdownStates.jointOpen}
                                    value={formData.joint_number}
                                    items={jointItems}
                                    setOpen={(open) => setDropdownStates((prevState) => ({ ...prevState, jointOpen: open }))}
                                    setValue={(value) => handleInputChange('joint_number', value)}
                                    placeholder="Select Joint"
                                    style={styles.dropdown}
                                />
                            </View>

                            <CheckBox
                                title="RT Required"
                                checked={formData.rt_required}
                                onPress={() => handleInputChange('rt_required', !formData.rt_required)}
                            />
                            <CheckBox
                                title="PAUT Required"
                                checked={formData.paut_required}
                                onPress={() => handleInputChange('paut_required', !formData.paut_required)}
                            />

                            <TouchableOpacity style={appStyles.submitButton} onPress={handleSubmit}>
                                <Text style={appStyles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dropdown: {
        width: '48%', // To make sure there are two columns
        marginBottom: 10,
    },
});

export default NewJob;
