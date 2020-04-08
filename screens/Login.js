import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground, Dimensions, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Base_Url, AppVersion } from '../constants/common';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen'
import Toast, { DURATION } from 'react-native-easy-toast';

var { viewportHeight, viewportWidth } = Dimensions.get('window');




class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      spinner: false,
      timzone: ''

    };
  }



  componentDidMount() {

    var timzone = DeviceInfo.getTimezone();
    //   console.log("hiiii", timzone)
    this.setState({ timzone: timzone });

    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {

        if (value != null && childs != null) {
          this.props.navigation.navigate('VerticalTabBarTextExample')
          setTimeout(function () { SplashScreen.hide(); }, 800);
        }
        else {
          SplashScreen.hide();
        }

      }).done();
    }).done();

  

  }



  isValid() {
    const { email, password } = this.state;
    reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let valid = false;

    if (email.length > 0 && password.length > 0) {
      valid = true;
    }

    if (email.length === 0) {
      this.refs.toast.show('Please enter email address', 1000);
    } else if (reg.test(email) === false) {
      this.refs.toast.show('Please enter valid email address', 1000);
    }
    else if (password.length === 0) {
      this.refs.toast.show('Please enter password', 1000);

    }
    else {
      return valid;
    }


  }


  onLogIn() {
    const { email, password } = this.state;

    //    console.log('callledd');
    if (this.isValid()) {
      this.setState({ spinner: true });
      //  console.log('callledd2');
      fetch(Base_Url + 'loginWikiUser', {
        method: "POST",
        headers: {
          'appVersion': AppVersion,
          'timezone': this.state.timzone,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          deviceId: 'abc',
          deviceType: 'i'
        })
      })

        .then((response) => response.json())
        .then((responseJson) => {

          // console.log("responseJson", responseJson);
          if (responseJson.status == 1) {
            if (responseJson.data.childProfiles.length === 0) {
              AsyncStorage.setItem('token', responseJson.data.token);
              AsyncStorage.setItem('email', this.state.email);
              AsyncStorage.setItem('password', this.state.password);
              this.props.navigation.navigate('Createchildprofile', { refresh: 'refresh' })
              this.setState({ spinner: false, email: '', password: '' });

            }
            else {
              
              AsyncStorage.setItem('token', responseJson.data.token);
              AsyncStorage.setItem('childs', JSON.stringify(responseJson.data.childProfiles));
              AsyncStorage.setItem('email', this.state.email);
              AsyncStorage.setItem('password', this.state.password);
              this.props.navigation.navigate('VerticalTabBarTextExample', { refresh: 'refresh' })
              this.refs.toast.show(responseJson.message, 1000);
              this.setState({ spinner: false, email: '', password: '' });
            }
          }
          else {
            this.refs.toast.show(responseJson.message, 1000);
            let that = this;
            setTimeout(function () { that.setState({ spinner: false, email: '', password: '' }) }, 1500);
            // this.setState({spinner: false});      
          }





        }).catch((error) => {
          console.log("ErrorLogin", error);
          let that = this;
          setTimeout(function () { that.setState({ spinner: false , email : '' , password : '' }) }, 1500);
          // Toast.show('There has been a problem with your fetch operation:', Toast.SHORT);
        });

    }
  }


  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  render() {
    return (

      <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>
        <ScrollView>
          <View style={styles.container}>

            <Spinner
              visible={this.state.spinner} />



            <View style={{ width: '60%' }}>
              <Image style={{ width: 100, height: 100, resizeMode: 'contain', marginTop: 100, marginBottom: 50, alignSelf: 'center' }} source={require('../assets/images/logo.png')} />

              <View style={styles.viewStyle}>
                <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', borderTopLeftRadius: 10, alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                  <Image source={require('../assets/images/mail.png')} />
                </View>
                <View style={{ width: '85%', height: 60, backgroundColor: 'white', borderTopRightRadius: 10, borderBottomColor: '#dcdcdc', paddingLeft: 15, borderBottomWidth: 1 }}>
                  <TextInput style={styles.textInputStyle} placeholder="Email Address" returnKeyType={"next"}
                    onSubmitEditing={() => { this.password.focus(); }}
                    keyboardType='email-address'
                    onChangeText={(email) => this.setState({ email: !this.state.email ? email.replace(/\s/g, '') : email })}
                    value={this.state.email} />
                </View>
              </View>



              <View style={styles.viewStyle}>
                <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 10 }}>
                  <Image source={require('../assets/images/key.png')} />
                </View>
                <View style={{ width: '85%', height: 60, backgroundColor: 'white', borderBottomRightRadius: 10, paddingLeft: 15 }}>


                  <TextInput style={styles.textInputStyle} placeholder="Password"
                    returnKeyType={"done"}
                    secureTextEntry={true}
                    ref={(input) => { this.password = input; }}
                    onChangeText={(password) => this.setState({ password: password.replace(/\s/g, '') })}
                    onSubmitEditing={this.onLogIn.bind(this)} />

                </View>
              </View>

              <Text onPress={() => this._onPress('Forgot')} style={styles.forgotPassword}>Forgot Password?</Text>


              <TouchableOpacity onPress={this.onLogIn.bind(this)} style={styles.buttonContainer}>
                <Text style={{ color: '#527BF3', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>LOGIN</Text>
              </TouchableOpacity>

              <Text style={styles.dontAccount}>Don't have an account? <Text onPress={() => this._onPress('Signup')} style={styles.singUp}>Sign Up</Text>
              </Text>


            </View>

          </View>
        </ScrollView>
        <Toast ref="toast" />
      </ImageBackground>

    );
  }
}


export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Roman'
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
    justifyContent: 'center',
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  viewStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dontAccount: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'HelveticaNeueLTStd-Roman'

  },
  singUp: {
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Md'
  }

});








