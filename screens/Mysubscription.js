import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, AsyncStorage , Alert, NativeModules } from 'react-native';
import { Base_Url, AppVersion } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
const { InAppUtils } = NativeModules
// var InAppUtils = require('NativeModules').InAppUtils


const identifiers = [
  'com.app.kidswiki.subMonthly',
];
class Mysubscription extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreen: 'Home',
      selected: '1',
      selectedChild: { username: '' },
      spinner: false,
    };
  }


  componentDidMount() {
    console.log("propsssssssss", this.props)
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0] })
        this.getSubscriptionDetail();
      }).done();
    }).done();

  }


  getSubscriptionDetail() {
    this.setState({ spinner: true })
    var timzone = DeviceInfo.getTimezone();
    fetch(Base_Url + 'getSubscriptionDetail', {
      method: "GET",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      }

    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Login');
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;
        console.log("getSubscriptionDetail===>>>>>", JSON.stringify(responseJson.data));

        if (responseJson.status == 1) {
          this.setState({ spinner: false, isSubscribed: responseJson.data.isSubscribed, daysRemaining: responseJson.data.daysRemaining, subscriptionId: responseJson.data.subscriptionId });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false });
        }
      }).catch((error) => {
        console.log(error);
        this.setState({ spinner: false });
        console.log("getSubscription", error);
      });
  }

  
  _showAlert = () => {		
			
    Alert.alert(		
      '',		
      'Are you sure you want to cancle Subscription ?',		
      [		
        //  {text: 'Ask me later', onPress: () => this._onPress()},		
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },		
        { text: 'OK', onPress: (nn) => this.cancelSubscription() },		
       ],		
      { cancelable: false }		
    )		
    
  }


  cancelSubscription() {
    this.setState({ spinner: true })
    var timzone = DeviceInfo.getTimezone();
    fetch(Base_Url + 'cancelSubscriptionDetail', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        subscriptionId: this.state.subscriptionId
      })


    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        console.log("cancelSubscriptionDetail===>>>>>", JSON.stringify(responseJson.data));

        if (responseJson.status == 1) {
          this.getSubscriptionDetail();
          this.setState({ spinner: false });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false });
        }
      }).catch((error) => {
        this.setState({ spinner: false });
        console.log("cancleSubscription", error);
      });
  }


  _onPressSub = () => {
    let _this = this;
    setTimeout(function () { _this.setState({ spinner: true }); }, 500);
    InAppUtils.loadProducts(identifiers, (error, products) => {
      var productIdentifier = 'com.app.kidswiki.subMonthly';
      InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
        if (response && response.productIdentifier) {
          var x = response.originalTransactionDate;
          var d = new Date(x);
          var startTime = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

          this.setState({ transactionId: response.transactionIdentifier, startTime: startTime, feeAmount: products[0].price, spinner: false });
          let that = this;
          setTimeout(function () { that.addSubscription() }, 500);

        }

        else {

          console.log(JSON.stringify(error.message))
          this.setState({ spinner: false });

        }

      });
      // this.setState({spinner : false});

      //update store here.
    });

    }


  addSubscription = () => {


    console.log("android",this.state.startTime,this.state.feeAmount,this.state.transactionId)
   

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone  , spinner: true});

    fetch(Base_Url + 'addSubscriptionDetail', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        startTime: this.state.startTime,
        feeAmount: this.state.feeAmount,
        transactionId: this.state.transactionId

      })
    })

      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;

        // console.log("========>>>>>>>>", responseJson)
        this.setState({ spinner: false });
        if (responseJson.status == 1) {
          this.getSubscriptionDetail();
        }

        Toast.show(responseJson.message, Toast.SHORT);

      }).catch((error) => {
        this.setState({ spinner: false });
        console.log("appSubscription", error);
      });

  }


  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }
  render() {
    return (
      <View style={{ flex: 1 }}>

        <Spinner
          visible={this.state.spinner} />

        <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 20 }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 40, height: 35 }}>
            <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 35 }} />
          </TouchableOpacity>
          <View style={{ width: '95%', flexDirection: 'column' }}>
            <Text style={{ fontSize: 25, textTransform: 'uppercase', color: '#527CF3', fontFamily: 'HelveticaNeueLTStd-Md', justifyContent: 'center', marginLeft: 25, marginTop: 5 }}>My Subscription</Text>

            <View style={{ width: '95%', flexDirection: 'row', marginTop: 10, marginLeft: 25, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />

          </View>
        </View>

        <View style={{ width: '100%', flexDirection: 'row', marginTop: 30, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />


        {this.state.isSubscribed ?
          <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>

            <View style={{ width: '60%', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/images/msg_subs.png')} />

              <Text style={{ color: 'black', fontSize: 22, margin: 20, fontFamily: 'HelveticaNeueLTStd-Roman' }}>Your subscription will be expired in {this.state.daysRemaining} days.</Text>


              <TouchableOpacity style={styles.buttonContainer} onPress={() => this._showAlert()}>
                <Text style={{ color: '#527BF3', fontSize: 22, fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>x Cancel Subscription</Text>
              </TouchableOpacity>

            </View>

          </View>

          :
          <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <View style={{ width: '60%', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../assets/images/msg_subs.png')} />
              <Text style={{ color: 'black', fontSize: 22, margin: 20, fontFamily: 'HelveticaNeueLTStd-Roman' }}>No Subscription yet.</Text>

              <TouchableOpacity style={styles.buttonContainer} onPress={this._onPressSub.bind(this)}>
                <Text style={{ color: '#527BF3', fontSize: 22, fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Purchase</Text>
              </TouchableOpacity>

            </View>

          </View>
        }




      </View>
    );
  }
}



export default Mysubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonContainer: {
    width: '65%',
    height: 60,
    paddingTop: 5,
    justifyContent: 'center',
    paddingBottom: 5,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#527BF3',
    justifyContent: 'center',
    fontFamily: 'HelveticaNeueLTStd-Md'
  },
  singUp: {
    marginTop: 30,
    fontSize: 20,
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Md'
  }

});
