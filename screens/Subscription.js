import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground ,Alert, NativeModules, AsyncStorage} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Base_Url, AppVersion } from '../constants/common';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';

var InAppUtils = require('NativeModules').InAppUtils


const identifiers = [
  'com.app.kidswiki.subMonthly',
];
class Subscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
     };

  }


  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
        console.log("user_token home", value)
        this.setState({ user_token: value})
    }).done();
  }
  


 
  
  _onPressSub = () => {
    let _this = this;
    setTimeout(function(){_this.setState({spinner: true}); }, 500);  
   InAppUtils.loadProducts(identifiers, (error, products) => {   
      var productIdentifier = 'com.app.kidswiki.subMonthly';
      InAppUtils.purchaseProduct(productIdentifier, (error, response) => {     
        if(response && response.productIdentifier) {          
          var x = response.originalTransactionDate;
          var d = new Date(x);                   
        var startTime = d.getFullYear()+"-"+("0" + (d.getMonth() + 1)).slice(-2)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
      
        this.setState({transactionId: response.transactionIdentifier ,startTime : startTime , feeAmount :products[0].price , spinner : false});
        let that = this;
        setTimeout(function () { that.addSubscription()}, 500);
                            
           }
           else{
            console.log(JSON.stringify(error.message))
            this.setState({spinner : false});
           }

        });
      //update store here.
   }); 
  }


   addSubscription = () => {  

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone   , spinner: true});

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
        startTime:this.state.startTime,
        feeAmount:this.state.feeAmount ,
        transactionId : this.state.transactionId

      })
    })

      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;

        console.log("========>>>>>>>>",responseJson)

        this.setState({ spinner: false });
        if (responseJson.status == 1) {
          this.props.navigation.navigate('VerticalTabBarTextExample')
        }

        Toast.show(responseJson.message, Toast.SHORT);

      }).catch((error) => {
        this.setState({ spinner: false });
        console.log(error);
      });

   }

    _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  render() {
    return (
      <ImageBackground source={require('../assets/images/bgimg.png')} style={{ width: '100%', height: '100%' }}>

      <Spinner
      visible={this.state.spinner}
                />

        <ScrollView>
          <View style={styles.container}>        

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 100 }}>
              <Text style={{ fontSize: 25, color: 'white', alignSelf: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Thanks for registering with us.</Text>
              <TouchableOpacity activeOpacity={1} style = {{position: 'absolute', right: 10}} onPress={() => this._onPress('VerticalTabBarTextExample')}>
              <Text  style={{ fontSize: 25, color: 'white', textDecorationLine: 'underline', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Skip</Text>
              </TouchableOpacity>
            </View>


            <View style={{ width: '60%', marginTop: 30, backgroundColor: '#3F67DC', borderRadius: 10 }}>

              <Image style={{ width: 150, height: 150, resizeMode: 'contain', marginTop: 20, marginBottom: 20, alignSelf: 'center' }} source={require('../assets/images/logo.png')} />
              <Text style={styles.instruction}>You need to purchase monthly Subscription{'\n'}package for using the app features.</Text>
              <Text style={{ width: '100%', fontSize: 30, textAlign: 'center', color: '#28418b', marginTop: 20, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>Monthly Payment</Text>
              <Text style={{ width: '100%', fontSize: 25, textAlign: 'center', color: 'white', marginBottom: 30, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>$9.99</Text>


            </View>


            {/* <TouchableOpacity style={styles.buttonContainer}> */}
            <TouchableOpacity style={styles.buttonContainer} onPress={() => this._onPressSub()}>             
              <Text style={{ color: '#527BF3', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold' }}>PURCHASE</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}



export default Subscription;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  instruction: {
    width: '100%',
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'HelveticaNeueLTStd-Roman',

  },
  textInputStyle: {
    width: '100%',
    height: 60,
    fontSize: 20,
    color: '#1894CE',

  },

  buttonContainer: {
    width: '60%',
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

  },
  textUndeline: {
    alignSelf: 'flex-end',
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',

  }
});