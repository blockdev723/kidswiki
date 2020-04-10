
import * as React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Text, Image, AsyncStorage, TextInput , KeyboardAvoidingView } from 'react-native';
import {
  TabBarVertical,
  TabViewVertical,
  SceneMap,
  type Route,
  type NavigationState,
} from 'react-native-vertical-tab-view';
import { Home } from './Home';
import { Topics } from './Topics';
import { Favourite } from './Favourite';
import { Featuredlist } from './Featuredlist';
import { History } from './History';
import { Settings } from './Settings';
import { Base_Url, AppVersion } from '../constants/common';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';


global.currenttt = 0;
type State = NavigationState<
  Route<{
    key: string,
    title: string,
  }>
>;

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class VerticalTabBarTextExample extends React.Component<
  *,
  State
  > {
  static title = 'Scrollable left vertical bar';
  static backgroundColor = '#3f51b5';
  static appbarElevation = 0;



  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      index: 0,
      password: '',
      modalVisible: false,
      routes: [{ key: 'home', title: 'Home', activeIconName: require('../assets/images/home_selected.png'), deActiveICon: require('../assets/images/home.png'), style: { height: 39, width: 41 }, _onClickList: this._onClickList, _onClickSearch: this._onClickSearch, _onLogout: this._onLogout },
      { key: 'topics', title: 'Topics', activeIconName: require('../assets/images/topic_selected.png'), deActiveICon: require('../assets/images/topics.png'), style: { height: 39, width: 41 }, _onClickBrowse: this._onClickBrowse, _onClickSearch: this._onClickSearch, _onLogout: this._onLogout },
      { key: 'favourite', title: 'Favourites', activeIconName: require('../assets/images/favourite_selected.png'), deActiveICon: require('../assets/images/favourite.png'), style: { height: 39, width: 41 }, _onClickSearch: this._onClickSearch, _onLogout: this._onLogout },
      { key: 'featuredlist', title: 'Lists', activeIconName: require('../assets/images/lists_selected.png'), deActiveICon: require('../assets/images/lists.png'), style: { height: 40, width: 33 }, _onClickSearch: this._onClickSearch, _onLogout: this._onLogout },
      { key: 'history', title: 'History', activeIconName: require('../assets/images/history_selected.png'), deActiveICon: require('../assets/images/history.png'), style: { height: 38, width: 38 }, _onClickSearch: this._onClickSearch, _onLogout: this._onLogout },
      { key: 'settings', title: 'Settings', activeIconName: require('../assets/images/settings_selected.png'), deActiveICon: require('../assets/images/settings.png'), style: { height: 39, width: 39 }, _onClickSetting: this._onClickSetting, _onClickSearch: this._onClickSearch, closeModal: this.closeModal, _onLogout: this._onLogout , _onForgotScreen : this._onForgotScreen}],
    };

    this._onClickList = this._onClickList.bind(this);
    this._onClickBrowse = this._onClickBrowse.bind(this);
    this._onClickSetting = this._onClickSetting.bind(this);
    this._onClickSearch = this._onClickSearch.bind(this);
    this._onLogout = this._onLogout.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this._onForgotScreen = this._onForgotScreen.bind(this);

    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem("password").then((password) => {
        this.setState({ user_token: value, myPassword: password })
      }).done();
    }).done();
  }



  CallFunction_1 = (index) => {

   

  }




  _handleIndexChange = index =>
    this.setState({
      index,
    });



  _onClickList = (screen, item, displayTitle, titleApi, selectedChild, seed) => {
    this.props.navigation.navigate(screen, { interest: item, displayTitle: displayTitle, titleForApi: titleApi, selectedChild: selectedChild, seed: seed });
  }

  closeModal = () => {
    this.setState({ index: 0 }); 
    global.currenttt = 0
  }

  _onClickBrowse = (item, browseLevelFirst, browseLevelSecond) => {
    this.props.navigation.navigate(item, { browseLevelFirst: browseLevelFirst, browseLevelSecond: browseLevelSecond });
  }

  _onClickSetting = (item) => {
    this.props.navigation.navigate(item);
  }

  _onClickSearch = (item) => {
    this.props.navigation.navigate(item);
  }


  _onPress = (screen) => {
    
  }

  _onLogout = (screen) => {
    global.currenttt = 0;
    global.colorIndex = 0 ;
    this.props.navigation.navigate(screen);    
  }

  _onForgotScreen = (screen) => {
    global.currenttt = 0;
    this.setState({ index: 0 }); 
    this.props.navigation.navigate(screen);  
   }


 

  _renderTabBar = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableOpacity
            key={route.key}
            style={{ marginTop: 10, marginBottom: 10, padding: 10 }}
            onPress={() => { props.jumpTo(route.key); global.currenttt = index, this.CallFunction_1(index) }} >

            <View style={styles.tab}>
              {global.currenttt == index ?
                index == 0 ?
                  <Image style={route.style} source={require('../assets/images/home_selected.png')} />
                  :
                  index == 1 ?
                    <Image style={route.style} source={require('../assets/images/topic_selected.png')} />
                    :
                    index == 2 ?
                      <Image style={route.style} source={require('../assets/images/favourite_selected.png')} />
                      :
                      index == 3 ?
                        <Image style={route.style} source={require('../assets/images/lists_selected.png')} />
                        :
                        index == 4 ?
                          <Image style={route.style} source={require('../assets/images/history_selected.png')} />
                          :
                          <Image style={route.style} source={require('../assets/images/settings_selected.png')} />
                :
                index == 0 ?
                  <Image style={route.style} source={require('../assets/images/home.png')} />
                  :
                  index == 1 ?
                    <Image style={route.style} source={require('../assets/images/topics.png')} />
                    :
                    index == 2 ?
                      <Image style={route.style} source={require('../assets/images/favourite.png')} />
                      :
                      index == 3 ?
                        <Image style={route.style} source={require('../assets/images/lists.png')} />
                        :
                        index == 4 ?
                          <Image style={route.style} source={require('../assets/images/history.png')} />
                          :
                          <Image style={route.style} source={require('../assets/images/settings.png')} />
              }
              <Text style={global.currenttt == index ? styles.selectNavText : styles.sideNavText}>
                {route.title}              
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}




    </View>
  );

  




  _renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'home':
        return <Home jumpTo={route.key} _onClickList={this._onClickList} _onClickSearch={this._onClickSearch} _onLogout={this._onLogout} />;
      case 'topics':
        return <Topics jumpTo={route.key} _onClickBrowse={this._onClickBrowse} _onClickSearch={this._onClickSearch} _onLogout={this._onLogout} />;
       case 'favourite':
         return <Favourite jumpTo={route.key} _onClickSearch={this._onClickSearch} _onLogout={this._onLogout} />;
      case 'featuredlist':
        return <Featuredlist jumpTo={route.key} _onClickSearch={this._onClickSearch} _onLogout={this._onLogout} />;
      case 'history':
      return <History jumpTo={route.key} _onClickSearch={this._onClickSearch} _onLogout={this._onLogout} />;
      case 'settings':
        return <Settings jumpTo={route.key} _onClickSetting={this._onClickSetting} _onClickSearch={this._onClickSearch} _onLogout={this._onLogout} closeModal={this.closeModal} _onForgotScreen = {this._onForgotScreen} />;
    }
  };


  componentDidMount() {

    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {

        var childsss = JSON.parse(childs);
        global.user_token = value;
        global.childs = childsss;
        global.selectedChild = childsss[0];
      }).done();
    }).done();

  }




  render() {
    return (
      <TabViewVertical
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        animationEnabled={false}
        swipeEnabled={false}
      />

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: 'white',
    borderTopColor: '#DCDCDC',
    borderTopWidth: 1,
    marginTop: 20,
    borderRightWidth :1,
    borderRightColor : '#DCDCDC',
  
  },
  tab: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    color: '#fff',
  },
  sideNavText: {
    marginTop: 5,
    color: '#C2C2C2',
    fontSize: 10,
    fontFamily: 'BigJohn',
  },
  selectNavText: {
    marginTop: 5,
    color: '#F962A1',
    fontSize: 10,
    fontFamily: 'BigJohn',

  },
  textInputStyle: {
    width: '100%',
    height: 60,
    fontSize: 24,
    color: 'black',
    fontFamily: 'HelveticaNeueLTStd-Roman'

  },
  viewStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    fontSize: 20,
    color: '#3F67DC',
    textDecorationLine: 'underline',
    fontFamily: 'HelveticaNeueLTStd-Roman'
  }
});