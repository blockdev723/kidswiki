import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Button, Icon, Footer, FooterTab, Content } from 'native-base';
import { Base_Url, AppVersion } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';




class Changepassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'Home',
      selected: '1',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      spinner: false,
      user_token: ''

    };
  }

  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('password').then((password) => {
        console.log("user_token home", value)
        this.setState({ user_token: value, myPassword: password })
      }).done();
    }).done();

  }


  isValid() {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    let valid = false;

    if (oldPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0) {
      valid = true;
    }

    if (oldPassword.length === 0) {
      this.refs.toast.show('Please enter Old Password', 1000);

    }
    else if (newPassword.length === 0) {
      this.refs.toast.show('Please enter New Password', 1000);

    }
    else if (newPassword.length <= 5) {
      this.refs.toast.show('Password must be at least 6 characters', 1000);
    }

    else if (confirmPassword.length === 0) {
      this.refs.toast.show('Please enter Confirm Password', 1000);

    } else if (newPassword != confirmPassword) {
      this.refs.toast.show('Password & confirm password does not match', 1000);
    }
    else if (newPassword == this.state.myPassword) {
      this.refs.toast.show('Please select new password different from your old password', 3000);
    }
    else {
      return valid;
    }

  }


  onChangePassword() {
    if (this.isValid()) {

      console.log(this.state.oldPassword + "\n" + this.state.newPassword + "\n" + this.state.confirmPassword)

      this.setState({ spinner: true });

      fetch(Base_Url + 'changePassword', {
        method: "POST",
        headers: {
          'appVersion': AppVersion,
          'timezone': this.state.timzone,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.state.user_token
        },
        body: JSON.stringify({
          currentPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,

        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.data = responseJson;
          console.log("ChangePassword=======>>>>>>>>", this.data)
          this.setState({ spinner: false });



          let that = this;

          if (responseJson.status == '1') {
            AsyncStorage.setItem('password', this.state.newPassword);

            that.refs.toast.show(responseJson.message, 800);
            setTimeout(function () { that.props.navigation.navigate('VerticalTabBarTextExample') }, 800);

          }

          that.refs.toast.show(responseJson.message, 1000);

        }).catch((error) => {
          console.log(error);
          this.setState({ spinner: false });
        });




    }
  }


  render() {
    return (
      <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>
        <Header style={{ backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.5)', borderBottomWidth: 0.5, elevation: 0, shadowOpacity: 0 }}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
              <Image style={{ width: 40, height: 35, marginLeft: 10 }} source={require('../assets/images/leftarrow.png')} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 25, textAlign: 'center', color: 'white', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Change Password</Text>
          </Body>
          <Right>

          </Right>
        </Header>

        <View>


          <ScrollView>

            <View style={styles.container}>

              <Spinner
                visible={this.state.spinner} />


              <View style={{ width: '60%' }}>


                <View style={styles.viewStyle}>
                  <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 10, borderBottomColor: 'white', borderBottomWidth: 1 }}>
                    <Image source={require('../assets/images/key.png')} />
                  </View>
                  <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 15, borderTopRightRadius: 10, borderBottomWidth: 1 }}>
                    <TextInput style={styles.textInputStyle} placeholder="Old Password" returnKeyType={"next"}
                      secureTextEntry={true}
                      onSubmitEditing={() => { this.newPassword.focus(); }}
                      onChangeText={(oldPassword) => this.setState({ oldPassword: oldPassword.replace(/\s/g, '') })}
                      value={this.state.oldPassword} />
                  </View>
                </View>

                <View style={styles.viewStyle}>
                  <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', borderBottomWidth: 1 }}>
                    <Image source={require('../assets/images/key.png')} />
                  </View>
                  <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 15, borderBottomWidth: 1 }}>
                    <TextInput style={styles.textInputStyle} placeholder="New Password" returnKeyType={"next"}
                      secureTextEntry={true}
                      ref={(input) => { this.newPassword = input; }}
                      onSubmitEditing={() => { this.confirmNewPassword.focus(); }}
                      onChangeText={(newPassword) => this.setState({ newPassword: newPassword.replace(/\s/g, '') })}
                      value={this.state.newPassword} />
                  </View>
                </View>


                <View style={styles.viewStyle}>
                  <View style={{ height: 60, width: '15%', backgroundColor: '#3F67DC', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 10 }}>
                    <Image source={require('../assets/images/key.png')} />
                  </View>
                  <View style={{ width: '85%', height: 60, backgroundColor: 'white', paddingLeft: 15, borderBottomRightRadius: 10 }}>
                    <TextInput style={styles.textInputStyle} placeholder="Confirm New Password" returnKeyType={"done"}
                      secureTextEntry={true}
                      ref={(input) => { this.confirmNewPassword = input; }}
                      onChangeText={(confirmPassword) => this.setState({ confirmPassword: confirmPassword.replace(/\s/g, '') })}
                      value={this.state.confirmPassword} />
                  </View>
                </View>



                <TouchableOpacity style={styles.buttonContainer} onPress={this.onChangePassword.bind(this)}>
                  <Text style={{ color: '#527BF3', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>SUBMIT</Text>
                </TouchableOpacity>




              </View>

            </View>
          </ScrollView>
        </View>
        <Toast ref="toast" />
      </ImageBackground>
    );
  }
}



export default Changepassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50

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
    color: 'black',
    fontFamily: 'HelveticaNeueLTStd-Roman'
  },
  buttonContainer: {
    width: '100%',
    height: 60,
    paddingTop: 5,
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
