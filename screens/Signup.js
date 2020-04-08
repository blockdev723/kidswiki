import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, ImageBackground, WebView, Modal } from 'react-native';
import { Header, Left, Body, Right } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Base_Url, AppVersion } from '../constants/common';
// import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Toast, { DURATION } from 'react-native-easy-toast';




class Signup extends Component {

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
      address: '',
      visibleModal: false,

    };
  }

  isValid() {
    const { fullName, email, password, confirmPassword, location } = this.state;
    reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let valid = false;

    if (fullName.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
      valid = true;
    }

    if (fullName.length === 0) {
      this.refs.toast.show('Please enter full name', 1000);
    } else if (email.length === 0) {
      this.refs.toast.show('Please enter email address', 1000);
    } else if (reg.test(email) === false) {
      this.refs.toast.show('Please enter valid email address', 1000);
    } else if (password.length === 0) {
      this.refs.toast.show('Please enter password', 1000);
    } else if (password.length < 6) {
      this.refs.toast.show('Password must be at least 6 characters', 1000);
    } else if (confirmPassword.length === 0) {
      this.refs.toast.show('Please enter confirm password', 1000);
    } else if (password != confirmPassword) {
      this.refs.toast.show('Password and Confirm Password does not match', 1000);
    } else if (this.state.address === '') {
      this.refs.toast.show('Please enter location', 1000);
    }
    else {
      return valid;
    }


  }

  componentDidMount() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
  }

  onSignUp() {
    const { fullName, email, password, confirmPassword, location } = this.state;
    //  console.log('callledd');

    if (this.isValid()) {


      this.setState({ spinner: true });

      fetch(Base_Url + 'signUpWikiUser', {
        method: "POST",
        headers: {
          'appVersion': AppVersion,
          'timezone': this.state.timzone,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: this.state.fullName,
          email: this.state.email,
          password: this.state.password,
          location: this.state.address,
          latitude: this.state.currentLatitude,
          longitude: this.state.currentLongitude,
          deviceId: 'abc',
          deviceType: 'i',

        })

      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.data = responseJson;
          this.setState({ spinner: false });
          console.log(responseJson);
          if (responseJson.status == 1) {
            // console.log("responseJson.data.token", responseJson.data.token)
            AsyncStorage.setItem('token', responseJson.data.token);
            AsyncStorage.setItem('email', this.state.email);
            AsyncStorage.setItem('password', this.state.password);
            this.props.navigation.navigate('Createchildprofile')
          }
          else {
            let that = this;
            setTimeout(function () { that.setState({ spinner: false, fullName: '', email: '', password: '', currentLatitude: '', currentLongitude: '', location: '' }) }, 1500);
          }


          this.refs.toast.show(responseJson.message, 1000);

        }).catch((error) => {
          console.log("SignUP", error);
        });


    }
  }


  sortValueChange = (value) => {

    this.setState({
      address: value.formatted_address,
      currentLatitude: value.geometry.location.lat,
      currentLongitude: value.geometry.location.lng,
    })

  }

  openModal = (title) => {
    if(title == 'Terms & Conditions'){
      this.setState({modalTitle: title , visibleModal:true , webUri :'https://kidsfirstwiki.com/terms'})
    }else {
      this.setState({modalTitle: title, visibleModal:true , webUri :'https://kidsfirstwiki.com/privacy' })
    }

  }

  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

        <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>

          <Header style={{ backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5, elevation: 0, shadowOpacity: 0, height: 100 }}>
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                <Image style={{ width: 45, height: 40, marginLeft: 10 }} source={require('../assets/images/leftarrow.png')} />
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 30, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Sign Up {'\n'}
                <Text style={{ fontSize: 20, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 20 }}>Parent Account Holder Details</Text></Text>
            </Body>
            <Right>

            </Right>
          </Header>


          <View>


            <ScrollView keyboardShouldPersistTaps='handled' ref={ref => (this.scrollView = ref)}>
              <View style={styles.container}>

                <Spinner
                  visible={this.state.spinner} />


                <View style={{ width: '60%', marginTop: 100 }}>

                  <View style={styles.viewStyle}>
                    <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', borderTopLeftRadius: 10, alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                      <Image source={require('../assets/images/user.png')} />
                    </View>
                    <View style={{ width: '85%', height: 60, backgroundColor: 'white', borderTopRightRadius: 10, paddingLeft: 15, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
                      <TextInput style={styles.textInputStyle} placeholder="Full Name" returnKeyType={"next"}
                        onSubmitEditing={() => { this.emailAddress.focus(); }}
                        onChangeText={(fullName) => this.setState({ fullName: !this.state.fullName ? fullName.replace(/\s/g, '') : fullName })}
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
                        ref={(input) => { this.emailAddress = input; }}
                        onSubmitEditing={() => { this.password.focus(); }}
                        onChangeText={(email) => this.setState({ email: !this.state.email ? email.replace(/\s/g, '') : email })}
                        value={this.state.email} />

                    </View>
                  </View>

                  <View style={styles.viewStyle}>
                    <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                      <Image source={require('../assets/images/key.png')} />
                    </View>
                    <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 15, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
                      <TextInput style={styles.textInputStyle} placeholder="Password" returnKeyType={"next"}
                        secureTextEntry={true}
                        ref={(input) => { this.password = input; }}
                        onSubmitEditing={() => { this.confirmPassword.focus(); }}
                        onChangeText={(password) => this.setState({ password: password.replace(/\s/g, '') })}
                        value={this.state.password} />
                    </View>
                  </View>


                  <View style={styles.viewStyle}>
                    <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                      <Image source={require('../assets/images/key.png')} />
                    </View>
                    <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 15, borderBottomColor: '#dcdcdc', borderBottomWidth: 1 }}>
                      <TextInput style={styles.textInputStyle} placeholder="Confirm Password" returnKeyType={"done"}
                        secureTextEntry={true}
                        ref={(input) => { this.confirmPassword = input; }}
                        onFocus={() => this.scrollView.scrollToEnd({ animated: false })}
                        value={this.state.confirmPassword}
                        onChangeText={(confirmPassword) => this.setState({ confirmPassword: confirmPassword.replace(/\s/g, '') })} />
                    </View>
                  </View>


                  <GooglePlacesAutocomplete
                    value={this.state.location}
                    placeholder='Location'
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
                    currentLocation={false}
                    enablePoweredByContainer={false}
                  />


                  <TouchableOpacity onPress={this.onSignUp.bind(this)} style={styles.buttonContainer}>
                    <Text style={{ color: '#527BF3', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>SIGN UP</Text>
                  </TouchableOpacity>



                  <View>
                    <Text style={styles.account}>By Signing up you agree with our</Text>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                      <TouchableOpacity onPress={() => this.openModal('Terms & Conditions')}>
                        <Text style={styles.textUndeline}>Terms & Conditions</Text>
                      </TouchableOpacity>
                      <Text style={styles.account}> and </Text>
                      <TouchableOpacity onPress={() => this.openModal('Privacy Policy')}>
                      <Text style={styles.textUndeline}>Privacy Policy.</Text>
                      </TouchableOpacity>

                    </View>


                  </View>




                </View>
              </View>

            </ScrollView>

          </View>




          <Toast ref="toast" />
        </ImageBackground>





        <Modal
          coverScreen={true}
          visible={this.state.visibleModal}
          backgroundColor="tranparent"
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}>
          <Header style={{ backgroundColor: 'rgba(33,35,38,0.9)', elevation: 0, shadowOpacity: 0, height: 70 }}>
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.setState({ visibleModal: false })}>
                <Image style={{ width: 45, height: 40, marginLeft: 10 }} source={require('../assets/images/leftarrow.png')} />
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 30, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.modalTitle}</Text>
            </Body>
            <Right>

            </Right>
          </Header>
          <WebView
            source={{ url: this.state.webUri}} />
        </Modal>
      </KeyboardAvoidingView>



    );
  }
}


export default Signup;


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
    marginTop: 5,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'HelveticaNeueLTStd-Roman'
  },

  textUndeline: {
    marginTop:5,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: 'bold'

  }
});