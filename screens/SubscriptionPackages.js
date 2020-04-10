
import React from 'react';
import {
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    ScrollView,
    Platform,
    AsyncStorage,
    FlatList,
    Alert,
    NativeModules
} from 'react-native';
import { Text } from 'native-base';
const win = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
const { InAppUtils } = NativeModules
// var InAppUtils = require('NativeModules').InAppUtils
import Spinner from 'react-native-loading-spinner-overlay';
const identifiers =  ['com.app.kidswiki.monthlySub']


import style from './style';


class SubscriptionPackages extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
            isSelecetUnlimited: true,
            dimondArray:[],
            borderColor:'#D7D7D7',
            receipt:'',
            itemPressed:'',
            traanctioniD:'',
            isLoading:false,
            data:{},
            dimondCound:0,
            monthlySubscription:''           
           
        }
    }
     componentWillMount() {
   
        try {
            AsyncStorage.getItem('userinfo').then((userinfo) => {

                var data = JSON.parse(userinfo)
                this.setState({ loginApiData: data })
               this.setState({isLoading: true});
               this.getProfile(data)
                this.getDimondsPackege(data)
                


            })
        } catch (error) {
          
        }
       
    }
    resetState = () => {
        this.setState(defaultState);
      };
    getDimondsPackege(data) {
       
        fetch(global.BaseUrl + 'subscription/' + data.user.id + '/subscriptionList', {
            method: 'GET',
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "appVersion": global.appVersion,
                "deviceType": global.deviceType,
                'Authorization': 'Bearer ' + data.accessToken + ''
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({isLoading: false});
             
                if (responseJson.code ==200) {
                   
                    this.setState({isLoading: false});
                    var listdata =responseJson.data;
                  
                        for(var i in listdata) {
                            listdata[i].price = listdata[i].price
                            listdata[i].diamondCount = listdata[i].diamondCount
                                if(listdata[i].diamondCount == '500'){
                                    this.setState({itemPressed: listdata[i].id});
                                }
                              
                          
                        }
                       
                this.setState({
                    dimondArray:listdata
                })

                }
                else {

                }

            })
            .catch((error) => {
                
                this.setState({isLoading: true});
              
            });
    }
    
    dimondListClick  = async(userdata) => {
       
       if(userdata.id==1){
         var productIdentifier = 'com.product.ZodiacFinder';
        this.setState({
            itemPressed: userdata.id,
            refreshing: !this.state.refreshing,
            borderColor:'#800080',
            isLoading: true
        });
        InAppUtils.loadProducts(identifiersProduct, (error, products) => {
         
           
      
                InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
                    this.setState({isLoading: false});
                 
                  
                // NOTE for v3.0: User can cancel the payment which will be available as error object here.
                if(response && response.productIdentifier) {    
                   var data= JSON.stringify({       
                        planId:userdata.id,
                        transactionId:response.transactionIdentifier,
                        
                    });
                  
                    fetch(global.BaseUrl+'subscription/'+this.state.loginApiData.user.id+'/buySubscription',{
                        method: "POST",
                        headers: {
                          "accept":"application/json",
                          "Content-Type":"application/json",
                          "appVersion":global.appVersion,
                          "deviceType":global.deviceType,
                          'Authorization': 'Bearer '+this.state.loginApiData.accessToken
                      
                        },
                        body:data,
                    })
                  .then((response)  => response.json())
                  .then((responseJson)=>
                  {
               
                     if(responseJson.code==200){
                    
                      Toast.show(responseJson.message);
                       
                     }
                     else{
                      Toast.show(responseJson.message);
                     }
            
                  })
                }
                else{
                   // Alert.alert("Cannot connect to iTunes");
                }
                });
            //update store here.
         });
       }
       else{
           if(this.state.monthlySubscription==2){
            Toast.show('You already buy unlimted plan');
            
           }
           else{
            this.setState({
                itemPressed: userdata.id,
                refreshing: !this.state.refreshing,
                borderColor:'#800080',
                isLoading: true
            });
            InAppUtils.loadProducts(identifiers, (error, products) => {
              
                //Alert.alert("Cannot connect to iTunes");
               
            var productIdentifier = 'com.app.zodiac.auto.1Month';
                    InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
                        this.setState({isLoading: false});
                     
                
                      
                    // NOTE for v3.0: User can cancel the payment which will be available as error object here.
                    if(response && response.productIdentifier) {    
                       var data= JSON.stringify({       
                            planId:userdata.id,
                            transactionId:response.transactionIdentifier,
                            
                        });
                      
                        fetch(global.BaseUrl+'subscription/'+this.state.loginApiData.user.id+'/buySubscription',{
                            method: "POST",
                            headers: {
                              "accept":"application/json",
                              "Content-Type":"application/json",
                              "appVersion":global.appVersion,
                              "deviceType":global.deviceType,
                              'Authorization': 'Bearer '+this.state.loginApiData.accessToken
                          
                            },
                            body:data,
                        })
                      .then((response)  => response.json())
                      .then((responseJson)=>
                      {
                      //  isLoading: true
                         if(responseJson.code==200){
                        
                          Toast.show(responseJson.message);
                           
                         }
                         else{
                          Toast.show(responseJson.message);
                         }
                
                      })
                    }
                    else{
                        Alert.alert("Cannot connect to iTunes");
                    }
                    });
                //update store here.
             });
           }
       
       }
        
      
    }
    componentWillReceiveProps(nextProps) {
     
        AsyncStorage.getItem('userinfo').then((userinfo) => {
          var data= JSON.parse(userinfo)
          this.setState({ loginApiData:data})
          this.getProfile(data)
        
             })
        }
      
    getProfile(data){     
                 
             fetch(global.BaseUrl+'user/'+data.user.id+'/getProfile',{
                method: 'GET',
                headers: {
                  "accept":"application/json",
                  "Content-Type":"application/json",
                  "appVersion":global.appVersion,
                  "deviceType":global.deviceType,
                  'Authorization': 'Bearer ' + data.accessToken + ''
                },
              
              }).then((response) => response.json())
                .then((responseJson) => {
                
            
                if(responseJson.code==200){                 // alert("plannoooooooo" +responseJson.data.planNo)
                  this.setState({ data:responseJson.data.user,dimondCound:responseJson.data.sendDiamondCount,monthlySubscription:responseJson.data.planNo});
      
             this.props.navigation.setParams({"likeCount": responseJson.data.likeCount})
         
                  global.likeCount=responseJson.data.likeCount
                  global.Matchount=responseJson.data.matchCount
              }
               else{
  
               }
                
                })
               
          
       }
    render() {
        const receivedDiamond =this.state.data.receivedDiamond
        return (
            <ScrollView>
                <Spinner
                      visible={this.state.isLoading}
                     />
                <LinearGradient colors={['#AA076B', '#61045F']} style={{ height: win.height / 2.5, width: win.width }}>
                    <Image style={{ width: win.width - 50, height: 30, marginTop: '5%', alignSelf: 'center' }} source={require('../../assets/image/text1.png')} />
                    <View style={{ alignSelf: 'center', flexDirection: 'row', marginTop: '5%', backgroundColor: "#671247", borderRadius: 30 }}>
                        <Image style={{ marginTop: 5, marginBottom: 3, marginLeft: 20, marginRight: 10, width: 25, height: 25 }} source={require('../../assets/image/diamond_icon.png')} />
                       {this.state.monthlySubscription==2 ?<Image style={{height:25, width:25, marginBottom: 3,marginRight: 15,top:1}} source={require('../../assets/image/crown.png')} />:<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25, marginBottom: 3, marginRight: 20 }}>{this.state.dimondCound}</Text>}

                    </View>
                    <View style={{ marginTop: '10%', marginHorizontal: 10 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Use diamonds to show people you are interested in them. Sending diamonds will send a notification to your person on interest. Sending diamonds will also allow message prior to matching.You can also use diamonds on your Likes list to view and chat.</Text>
                    </View>
                </LinearGradient>
                <FlatList
                horizontal
             data={this.state.dimondArray}
             refreshing = {this.state.refreshing}
            renderItem={({item}) => {
           
                const isSelectedUser = this.state.dimondArray == item
                const viewStyle = isSelectedUser
                  ? style.ContentViewUnlimitedEnable
                  : style.ContentViewUnlimitedDissable;
              return (
                <View style={{ flexDirection: 'row', marginTop: '15%', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>
                            <View style={[style.ContentViewUnlimitedEnable,{borderColor:this.state.itemPressed  == item.id ? '#800080' : '#D7D7D7'}]}>
                              
                                <TouchableOpacity onPress={this.dimondListClick.bind(this,item)}>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Image style={{ height: 50, width: 50, margin: 2 }} source={require('../../assets/image/diamond_icon.png')} />
                                        {item.price!=0.99 ? <Image style={{ height: 50, width: 50, margin: 2 }} source={require('../../assets/image/crown.png')} />:<Text style={{ textAlign: 'center', fontSize: 15, color: '#626262' }}></Text>}
                                    </View>
                                    {item.diamondCount==500 ?<Text style={{ textAlign: 'center', fontSize: 15, color: '#626262' }}>Unlimited</Text>:<Text style={{ textAlign: 'center', fontSize: 15, color: '#626262' }}>{item.diamondCount} Diamonds</Text>}
                                    {item.diamondCount==500 ?<Text style={{ textAlign: 'center', fontSize: 15, color: '#000000' }}>${item.price}/m</Text>:
                                    <Text style={{ textAlign: 'center', fontSize: 15, color: '#000000' }}>${item.price}</Text>}
                                </TouchableOpacity>
                            </View>
                            {item.diamondCount==500 ?
                            <View style={{ position: 'absolute', alignSelf: 'center', flexDirection: 'row', backgroundColor: "#800080", borderRadius: 30, left: 40, top: -10 }}>
                                <Text style={{ color: 'white', fontSize: 10, marginTop: 5, marginBottom: 5, marginRight: 15, marginLeft: 15 }}>MOST POPLULAR</Text>
                            </View>:
                          <View></View>}
                        </View> 
                 
                </View>
                  );
                }}
                keyExtractor={(item, index) => index}
        />
                <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 30 }}>
                    <Image style={{ marginTop: 20, height: 50, width: 50, marginLeft: 20 }} source={require('../../assets/image/star.png')} />
                    <Image style={{ width: win.width - 90, height: 80, marginTop: 20 }} source={require('../../assets/image/text2.png')} />
                </View>
            </ScrollView>
        )
    }
}


export default SubscriptionPackages;