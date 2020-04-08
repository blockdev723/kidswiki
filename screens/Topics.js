import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator , Alert , Linking } from 'react-native';
import { Base_Url, AppVersion, Image_Url } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';


var { viewportHeight, viewportWidth } = Dimensions.get('window');


const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export class Topics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      browseData: [],
      page: 0,
      selectedChild: { username: '' },
      showIndicator: false,
      isSrolled: true,
      trueeee: false,
      showData: true,
    };

  }

  componentDidMount() {
    console.log("propsssssssss", this.props)
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0] })
        this.getBrowseLevelTopics();
      }).done();
    }).done();

  }

  componentWillReceiveProps(nextProps) {
    if (global.currenttt == 1) {
      AsyncStorage.getItem("token").then((value) => {
        AsyncStorage.getItem('childs').then((childs) => {
          AsyncStorage.getItem('globalIndex').then((index) => {


            console.log("indexTopic", index)

            // console.log("user_token home", value, childs)
            var childsss = JSON.parse(childs);
            global.selectedChild = childsss[global.colorIndex];
            this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0] })
            // this.getBrowseLevelTopics();
          }).done();
        }).done();
      }).done();

      this.setState({ popoverShow: false })
      console.log('componentWillReceiveProps', nextProps);
    }
  }


  showAppUpdateAlert(link) {
    Alert.alert(
      'App Update',
      'Update app from App Store',
      [
        {
          text: 'Update App', onPress: () => {
            Linking.openURL(link).then((res) => {
              this.setState({ spinner: false })
            })
              .catch((err) => { console.log(err) });


          }
        },
      ],
      { cancelable: false },
    );

  }


  getBrowseLevelTopics() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ showIndicator: true });
    fetch(Base_Url + 'getBrowseLevel1Topics', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        pageNo: this.state.page,
        maxRecords: '64'


      })

    })
      .then((response) => {
        if (response.status === 200) {
          console.log("TopicSUCCESSS")
          return response.json();
        }
        else if (response.status === 401) {
          // AsyncStorage.removeItem('token');
          // this.props._onLogout('Login')
          this.setState({ spinner: false });
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;
        //  console.log("getBrowseLevelTopics===>>>>>", JSON.stringify(responseJson.data));

        // var browseData = this.state.browseData;
        // var finalArray = browseData.concat(responseJson.data)
        // this.setState({ spinner: false, browseData: finalArray, page: this.state.page + 1 });

        // console.log("getBrowseLevelTopics===>>>>>", responseJson.data.length);
        if (responseJson.data.length === 0) {
          console.log("XYZ", responseJson.data === null)
          this.setState({ spinner: false, showIndicator: false });
        }

        if (responseJson.status == 1) {
          var browseData = this.state.browseData;
          var finalArray = browseData.concat(responseJson.data)
          this.setState({ spinner: false, browseData: finalArray, page: this.state.page + 1, previousLength: responseJson.data.length, showData: true });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          // spinner = false;
          this.setState({ spinner: false, showIndicator: false });
          // this.setState({ spinner: false });
        }
      }).catch((error) => {
        console.log(error);
      });
  }



  _onPress = (screen) => {
    alert("Hiiiiiii")

  }


  setPopupVisible(visible) {
    this.setState({ popoverShow: !this.state.popoverShow });
  }

  selectChild = (item, index) => {
    this.setPopupVisible(false)
    global.selectedChild = item;
    global.colorIndex = index;
    AsyncStorage.setItem("globalIndex", JSON.stringify(index));
    this.setState({ selectedChild: item })
    let that = this;
    setTimeout(function () { that.getBrowseLevelTopics() }, 500);

  }


  render() {
    return (

      // <ScrollView>
      <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', marginTop: 20, height: '100%', position: 'relative' }}>

        <TouchableOpacity activeOpacity={1} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent:'center' }} onPress={() => this.setState({ popoverShow: false })}>


          <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', position: 'absolute', top: 10, left: 20, right: 20, zIndex: 999 }}>


            {this.state.popoverShow ?


              <View style={{
                marginRight: 20,
                width: 180, position: 'absolute', right: 10, borderRadius: 5, top: 58, flexDirection: 'column', backgroundColor: 'white', shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
              }}>
                <Image style={{
                  height: 30, width: 26, position: 'absolute', top: -30, left: 140, zIndex: 9999, shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.4,
                  shadowRadius: 2,
                }} source={require('../assets/images/arrow_pop.png')} />
                <FlatList
                  data={this.state.childs}
                  renderItem={({ item, index }) => (
                    <View>
                      <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.selectChild(item, index)}>
                        <View style={{ width: 50, height: 50, borderRadius: 50 / 2, backgroundColor: index == 0 ? '#527CF3' : index == 1 ? '#F45C5F' : index == 2 ? '#62C677' : index == 3 ? '#05e6f0' : '#800080', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                          <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{item.username.substring(0, 1)}</Text>
                        </View>
                        <Text style={{ color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginLeft: 10, marginRight: 10, fontSize: 20 }}>{item.username}</Text>
                      </TouchableOpacity>

                      <View style={{ borderBottomColor: '#BDBDBD', borderBottomWidth: 1 }} />

                    </View>
                  )}
                  refreshing={this.state.refreshing}
                />

              </View>


              : null}



            <View style={{ width: '100%', flexDirection: 'column' }}>
              <Text style={{ textTransform: 'uppercase', color: '#527CF3', fontSize: 25, fontFamily: 'BigJohn', marginLeft: 5 }}>Browse Topics</Text>

              <View style={{ width: '71%', flexDirection: 'row', marginTop: 5, marginLeft: 5, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />
            </View>

            <View style={{ position: 'absolute', right: 30, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { this.props._onClickSearch('Mysearch'); this.setState({ popoverShow: false }) }} style={styles.iconBackground}>
                <Image style={{ width: 27, height: 27 }} source={require('../assets/images/search.png')} />
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.iconBackground}>
                <Image style={{ width: 27, height: 27 }} source={require('../assets/images/notification.png')} />
                <View style={styles.notifictaionCircle}>
                  <Text style={{ color: 'white', fontSize: 18, fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8 }}>2</Text>
                </View>
              </TouchableOpacity> */}



              <TouchableOpacity style={[styles.circle, { backgroundColor: global.colorIndex == 0 ? '#527CF3' : global.colorIndex == 1 ? '#F45C5F' : global.colorIndex == 2 ? '#62C677' : global.colorIndex == 3 ? '#05e6f0' : '#800080' }]} onPress={() => { this.setPopupVisible(true) }}>
                <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{global.selectedChild.username.substring(0, 1)}</Text>
              </TouchableOpacity>
            </View>

          </View>

          <ScrollView style={{ marginTop: 70, position: 'relative' }}>
            {/* onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                let that = this;
                if (!that.state.trueeee) {
                  that.setState({ trueeee: true })
                  // that.setState({ showIndicator: true });
                  {this.state.showData ? 

                    that.setState({ showIndicator: true } ,that.getBrowseLevelTopics())                   
                  : null}  
                  // that.getBrowseLevelTopics()
                  console.log("refreshLog")
                  setTimeout(() => {
                    that.setState({ trueeee: false })
                  }, 1000)
                }
              }
            }}> */}


            <TouchableOpacity activeOpacity={1}>

              <FlatList
                data={this.state.browseData}
                renderItem={({ item, index }) =>
                  <View>
                    <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'flex-end' }} onPress={() => { item.hasBrowseLevel2 ? this.props._onClickBrowse('BrowseTopicLevel', item.browseLevel1, '') : this.props._onClickBrowse('ArticlesBrowseLevel', item.browseLevel1, ''); this.setState({ popoverShow: false }) }}>
                      <Image style={styles.imageAnimals} source={{ uri: Image_Url + item.browselevel1pic }} />
                      <Image source={require('../assets/images/gradient.png')} style={{ width: 275, height: 60, position: 'absolute', margin: 10, borderRadius: 10, }} />
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.textStyle}>{item.browseLevel1}</Text>
                      </View>
                    </TouchableOpacity>
                    {index == this.state.browseData.length - 1 ?
                      <View style={{ alignItems: 'center', width: '100%' }}>
                        <ActivityIndicator
                          style={{ padding: 15, marginLeft: -600 }}
                          animating={this.state.showIndicator}
                          size="large" color="white" />
                      </View>
                      : null}
                  </View>
                }
                ItemSeparatorComponent={this.renderSeparator}
                numColumns={3}
                horizontal={false}
                columnWrapperStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}
              />
            </TouchableOpacity>

          </ScrollView>



        </TouchableOpacity>
      </ImageBackground>
      //  </ScrollView>

    );
  }
}


export default Topics;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAnimals: {
    width: 275,
    height: 200,
    margin: 10,
    borderRadius: 10,

  }, textStyle: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    marginLeft: 20,
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: 'bold',
    paddingBottom: 60,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#527CF3',
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Md',
    justifyContent: 'center',
    alignItems: 'center'

  },

  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#F4F4F4',
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Md',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15

  },
  sideNavText: {
    marginTop: 2,
    color: '#9A9A9A',
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  selectNavText: {
    marginTop: 2,
    color: '#527CF3',
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: '800',
    textTransform: 'uppercase'

  },
  notifictaionCircle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#527CF3',
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeueLTStd-Md',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 25,
    bottom: 30
  }



}); 