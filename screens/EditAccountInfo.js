import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, ImageBackground } from 'react-native';
import { Header, Left, Body, Right } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Base_Url, AppVersion } from '../constants/common';
import DeviceInfo from 'react-native-device-info';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Toast, { DURATION } from 'react-native-easy-toast';




class EditAccountInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            location: '',
            error: null,
            spinner: false,
            address: ''

        };
    }

    isValid() {
        const { fullName } = this.state;
        let valid = false;

        if (fullName.length > 0) {
            valid = true;
        }

        if (fullName.length === 0) {
            this.refs.toast.show('Please enter full name', 1000);
        } else if (this.state.address === '') {
            this.refs.toast.show('Please enter location', 1000);
        }
        else {
            return valid;
        }



    }

    componentDidMount() {
        const { navigation } = this.props;
        var userData = navigation.getParam('userData');
        var timzone = DeviceInfo.getTimezone();
        console.log("hellooooofgffyhgfhfh", userData)

        this.locationRef.setAddressText(userData.location)

        this.setState({ timzone: timzone, emailAddress: userData.email, fullName: userData.name, address: userData.location, currentLatitude: userData.latitude, currentLongitude: userData.longitude });

        AsyncStorage.getItem("token").then((value) => {
            AsyncStorage.getItem('childs').then((childs) => {
                console.log("user_token home", value, childs)
                var childsss = JSON.parse(childs);
                this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0] })

            }).done();
        }).done();


    }

    onSignUp() {
        const { fullName, email, password, confirmPassword, location } = this.state;
        if (this.isValid()) {

            this.setState({ spinner: true });


            console.log(this.state.fullName + "\n" + this.state.emailAddress + "\n" + this.state.address + "\n" + this.state.currentLatitude + "\n" + this.state.currentLongitude)

            fetch(Base_Url + 'editUserProfile', {
                method: "POST",
                headers: {
                    'appVersion': AppVersion,
                    'timezone': this.state.timzone,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.user_token
                },
                body: JSON.stringify({
                    fullName: this.state.fullName,
                    location: this.state.address,
                    latitude: this.state.currentLatitude,
                    longitude: this.state.currentLongitude,

                })

            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.data = responseJson;
                    console.log("hiiiiiii", this.data)
                    this.setState({ spinner: false });
                    // console.log(responseJson);

                    let that = this;
                    if (responseJson.status == '1') {
                        that.refs.toast.show(responseJson.message, 500);
                        setTimeout(function () { that.props.navigation.navigate('Myprofile', { refresh: 'refresh' }) }, 800);                                  
                    }

                    that.refs.toast.show(responseJson.message, 1000);


                }).catch((error) => {
                    console.log(error);
                });

        }
    }


    sortValueChange = (value) => {
        console.log("valueeeeeeeeeeeeeeee ", value)

        this.setState({
            address: value.formatted_address,
            currentLatitude: value.geometry.location.lat,
            currentLongitude: value.geometry.location.lng,
        })

        console.log("valueeeeeeeeeeeeeeee ", value.formatted_address + "\n" + value.geometry.location.lat + "\n" + value.geometry.location.lng)

    }

    _onPress = (screen) => {
        this.props.navigation.navigate(screen)
    }
    render() {
        return (
            //   <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>

                <Header style={{ backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5, elevation: 0, shadowOpacity: 0, height: 70 }}>
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            <Image style={{ width: 45, height: 40, marginLeft: 10 }} source={require('../assets/images/leftarrow.png')} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Edit Account</Text>
                    </Body>
                    <Right>

                    </Right>
                </Header>


                <View>


                    <ScrollView keyboardShouldPersistTaps='handled' ref={ref => (this.scrollView = ref)}>

                        <View style={styles.container}>


                            <View style={{ width: '60%', marginTop: 100 }}>

                                <View style={styles.viewStyle}>
                                    <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', borderTopLeftRadius: 10, alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                                        <Image source={require('../assets/images/user.png')} />
                                    </View>
                                    <View style={{ width: '85%', height: 60, backgroundColor: 'white', borderTopRightRadius: 10, paddingLeft: 15, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
                                        <TextInput style={styles.textInputStyle} placeholder="Full Name" returnKeyType={"next"}
                                            onSubmitEditing={() => { this.emailAddress.focus(); }}
                                            onChangeText={(fullName) => this.setState({ fullName: !this.state.fullName ? fullName.replace(/\s/g, '') : fullName.replace(/\s/g, '') })}
                                            value={this.state.fullName} />
                                    </View>
                                </View>


                                <View style={styles.viewStyle}>
                                    <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                                        <Image source={require('../assets/images/mail.png')} />
                                    </View>
                                    <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 15, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
                                        <TextInput style={styles.textInputStyle} placeholder="Email Address" returnKeyType={"next"}
                                            keyboardType='email-address'
                                            editable={false}
                                            ref={(input) => { this.emailAddress = input; }}
                                            onChangeText={(email) => this.setState({ email: !this.state.email ? email.replace(/\s/g, '') : email })}
                                            value={this.state.emailAddress} />

                                    </View>
                                </View>



                                <GooglePlacesAutocomplete
                                    value={this.state.location}
                                    placeholder='Enter Location'
                                    placeholderTextColor="#a2a0a0"
                                    listViewDisplayed='false'
                                    underlineColorAndroid="transparent"
                                    minLength={1}
                                    autoFocus={this.state.locFocus}
                                    onPress={(data, details = null) => {
                                        this.sortValueChange(details)
                                    }}


                                    ref={(instance) => { this.locationRef = instance }}
                                    returnKeyType={'next'}
                                    fetchDetails={true}
                                    query={{
                                        key: 'AIzaSyDAoXX_NnO7iVp7ENOGX-plaQOa5-1AUfs',
                                        language: 'en',
                                        types: '(cities)',
                                    }}

                                    renderLeftButton={() => <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', borderBottomLeftRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../assets/images/loc.png')} />
                                    </View>}
                                    styles={{
                                        textInputContainer: {
                                            backgroundColor: 'white',
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                            height: 60,
                                            borderBottomLeftRadius: 10,
                                            borderBottomRightRadius: 10


                                        },
                                        container: {
                                            color: '#6a6a6a',
                                            backgroundColor: 'white',
                                            borderBottomLeftRadius: 10,
                                            borderBottomRightRadius: 10
                                        },
                                        description: {
                                            color: '#a2a0a0',
                                        },
                                        textInput: {
                                            width: '100%',
                                            height: 50,
                                            fontSize: 20,
                                            color: '#737373',
                                            fontFamily: 'HelveticaNeueLTStd-Roman'
                                        },
                                        predefinedPlacesDescription: {
                                            color: '#6a6a6a'
                                        },
                                    }}
                                    debounce={0}
                                    currentLocation={false}
                                />

                                <TouchableOpacity onPress={this.onSignUp.bind(this)} style={styles.buttonContainer}>
                                    <Text style={{ color: '#527BF3', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>Update</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </ScrollView>

                </View>
                <Toast ref="toast" />
            </ImageBackground>

            //   </KeyboardAvoidingView>



        );
    }
}


export default EditAccountInfo;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    textInputStyle: {
        width: '100%',
        height: 60,
        fontSize: 20,
        color: '#737373',
        fontFamily: 'HelveticaNeueLTStd-Roman'

    },

    buttonContainer: {
        width: '100%',
        height: 60,
        paddingTop: 15,
        justifyContent: 'center',
        paddingBottom: 5,
        marginTop: 30,
        marginBottom: 30,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center'
    },
    viewStyle: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    account: {
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'HelveticaNeueLTStd-Roman'
    },

    textUndeline: {
        marginTop: 30,
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        textDecorationLine: 'underline',
        fontFamily: 'HelveticaNeueLTStd-Md',
        fontWeight: 'bold'

    }
});