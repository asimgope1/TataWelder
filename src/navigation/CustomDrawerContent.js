import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { BRAND, WHITE } from '../constants/color';
import { WIDTH } from '../constants/config';

const menuItems = [
    { name: 'DashBoard', icon: 'view-dashboard', label: 'Dashboard' },
    { name: 'Registration', icon: 'form-select', label: 'Registration' },
    { name: 'New Job', icon: 'briefcase-plus', label: 'New Job' },
    { name: 'Job Approval', icon: 'check-decagram', label: 'Job Approval' },
    { name: 'RT Report', icon: 'file-document-outline', label: 'RT Report' },
    { name: 'PAUT-Report', icon: 'file-document-edit-outline', label: 'PAUT Report' },
    { name: 'Quality Verification', icon: 'check-circle-outline', label: 'Quality Verification' },
    { name: 'TPI', icon: 'account-group', label: 'TPI' },
    { name: 'Final Approval', icon: 'clipboard-check-outline', label: 'Final Approval' },
];

const CustomDrawerContent = (props) => {
    const navigation = useNavigation();

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.drawerContainer}
        >
            <View style={styles.gridContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.name)}
                    >
                        <View style={styles.iconContainer}>
                            <Icon name={item.icon} size={30} color={WHITE} />
                        </View>
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Adjust items to space them out evenly
        paddingVertical: 20,
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: WIDTH * 0.3, // Adjust width to fit three items per row
        height: 120,
        margin: 10,
        borderRadius: 10,
        backgroundColor: BRAND,
        opacity: 0.9,
    },
    iconContainer: {
        marginBottom: 8,
    },
    label: {
        color: WHITE,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CustomDrawerContent;
