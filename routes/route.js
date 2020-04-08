
import React, { Component } from 'react';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialBottomTabNavigator, createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Forgot from '../screens/Forgot';
import Createchildprofile from '../screens/Createchildprofile';
import Subscription from '../screens/Subscription';
import Home from '../screens/Home';
import Topics from '../screens/Topics';
import Favourite from '../screens/Favourite';
import Featuredlist from '../screens/Featuredlist';
import History from '../screens/History';
import Settings from '../screens/Settings';
import Mysubscription from '../screens/Mysubscription';
import Changepassword from '../screens/Changepassword';
import Contactus from '../screens/Contactus';
import Mysearch from '../screens/Mysearch';
import SearchList from '../screens/SearchList';
import Myprofile from '../screens/Myprofile';
import MostReadTopics from '../screens/MostReadTopics';
import Sidenavigator from '../screens/Sidenavigator';
import FeaturedPicture from '../screens/FeaturedPicture';
import EditAccountInfo from '../screens/EditAccountInfo';
import UpdateChildProfile from '../screens/UpdateChildProfile';
import BrowseTopicLevel from '../screens/BrowseTopicLevel';
import ArticlesBrowseLevel from '../screens/ArticlesBrowseLevel';
import VerticalTabBarTextExample from '../screens/VerticalTabBarTextExample';


const RootStack = createStackNavigator({
 
  
    Login: {
    screen: Login,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Signup: {
    screen: Signup,
    navigationOptions: { header: null,gesturesEnabled: false }
  },
  Sidenavigator: {
    screen: Sidenavigator,
    navigationOptions: { header: null,gesturesEnabled: false }
  },
  Forgot: {
    screen: Forgot,
    navigationOptions: { header: null,gesturesEnabled: false }
  },
  VerticalTabBarTextExample: {
    screen: VerticalTabBarTextExample,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Createchildprofile: {
    screen: Createchildprofile,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Subscription: {
    screen: Subscription,
    navigationOptions: { header: null,gesturesEnabled: false }
  },
  Home: {
    screen: Home,
    navigationOptions: { header: null,gesturesEnabled: false }
  },
  Topics: {
    screen: Topics,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Favourite: {
    screen: Favourite,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Featuredlist: {
    screen: Featuredlist,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  History: {
    screen: History,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Settings: {
    screen: Settings,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Changepassword: {
    screen: Changepassword,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Contactus: {
    screen: Contactus,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Mysubscription: {
    screen: Mysubscription,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Mysearch: {
    screen: Mysearch,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  SearchList: {
    screen: SearchList,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  Myprofile: {
    screen: Myprofile,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  MostReadTopics: {
    screen: MostReadTopics,
    navigationOptions: { header: null,gesturesEnabled: false }
  },
  FeaturedPicture: {
    screen: FeaturedPicture,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  EditAccountInfo: {
    screen: EditAccountInfo,
    navigationOptions: { header: null ,gesturesEnabled: false}
  },
  UpdateChildProfile: {
    screen: UpdateChildProfile,
    navigationOptions: { header: null,gesturesEnabled: false }
  },
  BrowseTopicLevel: {
    screen: BrowseTopicLevel,
    navigationOptions: { header: null ,gesturesEnabled: false}
  }, 
  ArticlesBrowseLevel: {
    screen: ArticlesBrowseLevel,
    navigationOptions: { header: null ,gesturesEnabled: false}
  }, 
  
});


const AppNav = createAppContainer(RootStack);

export default AppNav;












// https://docs.google.com/spreadsheets/d/1dNPVIs_nCGS4s-d7qLURQNt8gF_vtOA6jkVgh_4Mn3Q/edit#gid=0