import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Base_Url, AppVersion, Image_Url } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';



var { viewportHeight, viewportWidth } = Dimensions.get('window');
export class BrowseTopicLevel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spinner: true,
      browseData: [],
    };
  }

  componentDidMount() {

    const { navigation } = this.props;
    var browseLevelFirst = navigation.getParam('browseLevelFirst');

    this.setState({ browseLevelFirst: browseLevelFirst });
    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0] })
        this.getBrowseLevelTopics();

      }).done();
    }).done();


  }


  getBrowseLevelTopics() {

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone, spinner: true });
    fetch(Base_Url + 'getBrowseLevel2Topics', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        browseLevel1: this.state.browseLevelFirst
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        if (responseJson.status == 1) {
          this.setState({ spinner: false, browseData: responseJson.data });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false });
        }
      }).catch((error) => {
        console.log(error);
      });
  }


  _onPress = (screen, browseLevelFirst, browseLevelSecond) => {
    this.props.navigation.navigate(screen, { browseLevelFirst: browseLevelFirst, browseLevelSecond: browseLevelSecond })
  }

  render() {
    return (

      // <ScrollView>
      <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', marginTop: 10, height: '100%', position: 'relative' }}>

        <View style={{ width: '100%', height: '100%', alignItems:'center', justifyContent:'center' }}>

          <Spinner
            visible={this.state.spinner} />

          <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 20, marginBottom: 10 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 40, height: 30 }}>
              <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
            </TouchableOpacity>
            <View style={{ width: '95%', flexDirection: 'column' }}>
              <Text style={{ fontSize: 25, textTransform: 'uppercase', color: '#527CF3', fontFamily: 'BigJohn', justifyContent: 'center', marginLeft: 25, marginTop: 5 }}>{this.state.browseLevelFirst}</Text>

              <View style={{ width: '95%', flexDirection: 'row', marginTop: 10, marginLeft: 25, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />

            </View>
          </View>

          <ScrollView>
            <View style={{ marginTop: 40, marginLeft: 20, marginBottom: 20 }}>

              <FlatList
                data={this.state.browseData}
                renderItem={({ item }) =>
                  <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'flex-end' }} onPress={(nn) => this._onPress('ArticlesBrowseLevel', item.browseLevel1, item.browseLevel2)}>
                    {item.browseLevel2pic ? <Image style={styles.imageAnimals} source={{ uri: item.browseLevel2pic }} /> :

                      <ImageBackground style={[styles.noImageStyle]}>
                        <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                      </ImageBackground>}
                    {item.browseLevel2pic ? <Image source={require('../assets/images/gradient.png')} style={{ width: 300, height: 70, position: 'absolute', margin: 10, borderRadius: 10, }} /> : null}
                    
                    <View style={{ justifyContent: 'center' }}>
                      <Text style={styles.textStyle}>{item.browseLevel2}</Text>
                    </View>
                  </TouchableOpacity>

                }
                ItemSeparatorComponent={this.renderSeparator}
                numColumns={3}
                horizontal={false}
                columnWrapperStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}
              />

            </View>
          </ScrollView>

        </View>
      </ImageBackground>
      //  </ScrollView>

    );
  }
}


export default BrowseTopicLevel;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAnimals: {
    width: 300,
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
  ,

  noImageStyle: {
    flexDirection: 'row',
    borderRadius: 10,
    width: 300,
    height: 200,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'rgba(98,98,98,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.5
  },


}); 