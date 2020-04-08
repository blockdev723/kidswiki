import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground, FlatList, WebView, ActivityIndicator } from 'react-native';
import { Base_Url, AppVersion, Image_Url } from '../constants/common';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import { CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import MyWebView from 'react-native-webview-autoheight';


const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export class ArticlesBrowseLevel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spinner: true,
      articleData: [],
      spinner: false,
      visible: [],
      bgColor: ['red', 'blue', 'yellow',],
      newListShow: false,
      page: 0,
      showIndicator: true,
      isSrolled: true,
      refreshing: false,
      trueeee: false,
      defaultChecked: true,
      viewHeight: 0,
      Height: 0,
      showData: true,
      articlesToOpen: [],
      responseModal: {},

    };
  }

  onNavigationChange(event) {
    if (event.target) {
      const htmlHeight = Number(event.target)
      this.setState({ Height: htmlHeight });
    }
  }


  find_dimesions(layout) {
    const { x, y, width, height } = layout;
    this.setState({ viewHeight: height })
  }

  componentDidMount() {
    const { navigation } = this.props;
    var browseLevelFirst = navigation.getParam('browseLevelFirst');
    var browseLevelSecond = navigation.getParam('browseLevelSecond');


    this.setState({ browseLevelFirst: browseLevelFirst, browseLevelSecond: browseLevelSecond });

    AsyncStorage.getItem("token").then((value) => {
      AsyncStorage.getItem('childs').then((childs) => {
        console.log("user_token home", value, childs)
        var childsss = JSON.parse(childs);
        this.setState({ user_token: value, childs: childsss, selectedChild: childsss[global.colorIndex] })
        this._getRandomColor();
        this.getBannledList();
        this.getUserList();
        this.getArticleBrowseLevel();

      }).done();
    }).done();


  }

  _getRandomColor() {
    var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
    this.setState({
      selectedColor: item,
    })
  }


  getBannledList() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });

    fetch(Base_Url + 'getWordReplacementList', {
      method: "GET",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;


        if (responseJson.status == 1) {
          this.setState({ banData: responseJson.data });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }

      }).catch((error) => {
        console.log(error);
      });

  }


  getArticleBrowseLevel() {

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'getArticlesByBrowseLevels', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        browseLevel1: this.state.browseLevelFirst,
        browseLevel2: this.state.browseLevelSecond,
        pageNo: this.state.page,
        maxRecords: 12,
        childId: this.state.selectedChild.id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;


        if (responseJson.data === 'undefined') {
          this.setState({ spinner: false, showIndicator: false, trueeee: false });
        }

        if (responseJson.status == 1) {
          var articleData = this.state.articleData;
          var finalArray = articleData.concat(responseJson.data)
          this.setState({ spinner: false, articleData: finalArray, page: this.state.page + 1, showIndicator: false, showData: true, });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false, showIndicator: false, trueeee: false });
        }
      }).catch((error) => {
        console.log(error);
      });
  }



  showVisible = (index, position, item) => {
    if (index == this.state.prevIndex) {
      this.setShowDescriptionModal(item, index)
    }
    else {
      var visible = this.state.visible;
      visible[index] = !visible[index]
      for (var i in visible) {
        if (i != index) {
          visible[i] = false;
        }
      }
      this.setState({ visible: visible, refreshing: !this.state.refreshing, prevIndex: index })
    }

  }



  addToFavorite(item, index) {

    var isFavourite, favoArrayData;
    if (item.isFavourite == true) {
      isFavourite = 0;
      favoArrayData = false;
    } else {
      isFavourite = 1;
      favoArrayData = true;
    }

    var favDataaaaaaa = this.state.articleData;
    favDataaaaaaa[index].isFavourite = favoArrayData;
    this.setState({ articleData: favDataaaaaaa, refreshing: !this.state.refreshing })

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'setOrUnsetFavouriteArticle', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: this.state.selectedChild.id,
        title_for_api: item.title_for_api,
        favouriteStatus: isFavourite,
        title_for_display: item.title_for_display,
        image: item.image

      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;


        if (responseJson.status == 1) {
          this.setState({ spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });

  }


  addToFavoriteeeeee() {

    var isFavourite, favoArrayData;
    if (this.state.responseModal.isFavourite == true) {
      isFavourite = 0;
      favoArrayData = false;
    } else {
      isFavourite = 1;
      favoArrayData = true;
    }
    var responseModal = this.state.responseModal;
    responseModal.isFavourite = favoArrayData;
    this.setState({ responseModal: responseModal })

    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'setOrUnsetFavouriteArticle', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: this.state.selectedChild.id,
        title_for_api: this.state.responseModal.title_for_api,
        favouriteStatus: isFavourite,
        title_for_display: this.state.responseModal.title_for_display,
        image: this.state.responseModal.image

        })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;


        if (responseJson.status == 1) {
          this.setState({ spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }


  isIconCheckedOrNot = (item, index) => {
    var checked = this.state.checked;
    checked[index] = !checked[index];
    // console.log("hii111", checked)
    for (var i in checked) {
      if (i != index) {
        checked[i] = false;
      }
    }

    // console.log("hii", checked)
    this.setState({ newListChecked: false, checked: checked, refreshingCheck: !this.state.refreshingCheck, currentList: item })

  }

  setShowNewListModal(visible, item, openFrom) {
    if (visible) {
      this.setState({ newListShow: visible, selectedItemm: item, listTitle: '', openFrom : openFrom });
    }
    else {
      this.setState({ newListShow: visible, listTitle: '' });
    }

  }


  createNewIcon = () => {
    var checkeddd = [];
    for (var i in this.state.checkPrev) {
      checkeddd[i] = false;
    }
    this.setState({ newListChecked: !this.state.newListChecked, checked: checkeddd, refreshingCheck: !this.state.refreshingCheck });
  }


  getUserList() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'getUserLists', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: this.state.selectedChild.id,


      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;

        if (responseJson.status == 1) {
          var checkeddd = [];
          for (var i in responseJson.data) {
            checkeddd[i] = false;
          }

          this.setState({ spinner: false, userList: responseJson.data, checked: checkeddd, checkPrev: checkeddd });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }



  setCreateList() {
    if (this.state.newListChecked) {
      const { listTitle } = this.state;
      if (!listTitle || listTitle.length === 0) {
        Toast.show('Please add list', Toast.LONG);
      }
      else {
        this.addNewList(this.state.listTitle);
      }
    }
    else {
      if (this.state.currentList !== undefined) {
        this.state.openFrom == 'Modal' ? this.addWithOldListttttttt() :  this.addWithOldList();
      } else {
        Toast.show("Please select list", Toast.SHORT);
      }
    }
  }

  addNewList(listTitleName) {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'createUserList', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        listName: listTitleName,
        childId: this.state.selectedChild.id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        // console.log("responseJson", responseJson)
        if (responseJson.status == 1) {
          this.setState({ spinner: false, currentList: { id: responseJson.id } });
          let that = this;
          setTimeout(function () { that.state.openFrom == 'Modal' ? that.addWithOldListttttttt() : that.addWithOldList(); }, 500);

        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }



  addNewList(listTitleName) {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'createUserList', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        listName: listTitleName,
        childId: this.state.selectedChild.id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        // console.log("responseJson", responseJson)
        if (responseJson.status == 1) {
          this.setState({ spinner: false, currentList: { id: responseJson.id } });
          let that = this;
          setTimeout(function () { that.state.openFrom == 'Modal' ? that.addWithOldListttttttt() : that.addWithOldList(); }, 500);

        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });
  }


  addWithOldList() {


    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'addArticlesToList', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: this.state.selectedChild.id,
        title_for_api: this.state.selectedItemm.title_for_api,
        image: this.state.selectedItemm.image,
        listId: this.state.currentList.id

      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        // console.log("hellooooooo", responseJson)
        if (responseJson.status == 1) {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false, newListShow: false, listTitle: '' });
          this.getUserList();
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }



  addWithOldListttttttt() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    fetch(Base_Url + 'addArticlesToList', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: this.state.selectedChild.id,
        title_for_api: this.state.responseModal.title_for_api,
        image: this.state.responseModal.image,
        listId: this.state.currentList.id

      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.data = responseJson;
        // console.log("hellooooooo", responseJson)
        if (responseJson.status == 1) {
          Toast.show(responseJson.message, Toast.SHORT);
          this.setState({ spinner: false, newListShow: false, listTitle: '' });
          this.getUserList();
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });


  }


  setShowDescriptionModal(item, index) {
    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.article);
    this.setState({ visibleModal: 'sliding', responseModal: '', htmlForm: '', articlesToOpen: articlesToOpen, seachedItem: item, transparentModal: true, selectedIndex: index });

    let that = this;
    setTimeout(function () { that.setState({ transparentModal: false }) }, 800);

    fetch(Base_Url + 'getArticleDetail', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        title: item.title_for_api,
        childId: this.state.selectedChild.id,
        interestName: ''

      })
    })

    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == 0) {
        Toast.show(responseJson.message, Toast.SHORT);
      } else {

        this.data = responseJson;
        var htmlString = responseJson.mobileHTML;
        var filterHtmlString = htmlString.replace(new RegExp('href="//', 'g'), 'href="https://');
        var htmlTags = filterHtmlString.match(/<a [^>]+>([^<]+)<\/a>/g);
        var replacinggg = [];
        for (var j in htmlTags) {
          var splitString = htmlTags[j].split(" ")
          var split2 = htmlTags[j].split(">")[1];
          for (var i in this.state.banData) {
            if (split2.split("<")[0].includes(this.state.banData[i].checktitle)) {
              replacinggg.push(splitString[1]);
              console.log("ayaaaa")
            }
          }

        }
        var filterHtmlStringgggg = filterHtmlString;
        let unique = [...new Set(replacinggg)];
        for (var k in unique) {
          filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k], 'g'), '');
        }

        var filterHtmlStringgggg22 = filterHtmlStringgggg;
        for (var i in this.state.banData) {
          filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp("\\b" + this.state.banData[i].checktitle + "\\b", 'gi'), '[' + this.state.banData[i].replaceword + ']');

        }


        var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
        var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
        var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');

        this.setState({ htmlForm: openFacts, responseModal: responseJson, htmlFormPrev: openFacts, spinner2: false });


        var htmlString = this.state.htmlForm;
        var n = htmlString.indexOf("</head>");
        var kkkkk = new Date();
        var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " +"<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
        this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });


        if (responseJson.status == 1) {

        }
      }

      }).catch((error) => {
        console.log(error);
      });

  }

 

  showArticleDetailForLinks(article_name) {
    console.log("item.article", article_name)
    let that = this;
    setTimeout(function () { that.setState({ transparentModal: false }) }, 800);

    fetch(Base_Url + 'getArticleDetail', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': this.state.timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        title: article_name,
        childId: global.selectedChild.id,
        interestName: ''
      })
    })

    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == 0) {
        Toast.show(responseJson.message, Toast.SHORT);
      } else {
        this.data = responseJson;
        var htmlString = responseJson.mobileHTML;
        var filterHtmlString = htmlString.replace(new RegExp('href="//', 'g'), 'href="https://');
        var htmlTags = filterHtmlString.match(/<a [^>]+>([^<]+)<\/a>/g);
        var replacinggg = [];
        for (var j in htmlTags) {
          var splitString = htmlTags[j].split(" ")
          var split2 = htmlTags[j].split(">")[1];
          for (var i in this.state.banData) {
            if (split2.split("<")[0].includes(this.state.banData[i].checktitle)) {
              replacinggg.push(splitString[1]);
            }
          }
        }
        var filterHtmlStringgggg = filterHtmlString;
        let unique = [...new Set(replacinggg)];
        for (var k in unique) {
          filterHtmlStringgggg = filterHtmlStringgggg.replace(new RegExp(unique[k], 'g'), '');
        }

        var filterHtmlStringgggg22 = filterHtmlStringgggg;
        for (var i in this.state.banData) {
          filterHtmlStringgggg22 = filterHtmlStringgggg22.replace(new RegExp("\\b" + this.state.banData[i].checktitle + "\\b", 'gi'), '[' + this.state.banData[i].replaceword + ']');
        }


        var filterDisplayString = filterHtmlStringgggg22.replace(new RegExp('display: none;">', 'g'), 'display: block;">');
        var filterExternalLink = filterDisplayString.replace(new RegExp('rel="mw:ExtLink" href', 'g'), 'rel="mw:ExtLink" text');
        var openFacts = filterExternalLink.replace(new RegExp('pcs-collapse-table', 'g'), 'pcs-collapse-table');

        this.setState({ htmlForm: openFacts, responseModal: responseJson, htmlFormPrev: openFacts });


        var htmlString = this.state.htmlForm;
        var n = htmlString.indexOf("</head>");
        var kkkkk = new Date();
        var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + " " +"<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedstatic/uploaded_css_static.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
        this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });

        if (responseJson.status == 1) {
          this.setState({ spinnerModal: false });
        }
        else {
          this.setState({ spinnerModal: false });

        }
      }

      }).catch((error) => {
        setTimeout(function () { that.setState({ spinnerModal: false }) }, 1000);
        console.log("Description", error);
      });

  }




  layoutChecked = (index) => {
    if (index == '0') {
      this.setState({ defaultChecked: true, customChecked: false, htmlForm: this.state.htmlFormPrev });
    } else {
      if (!this.state.customChecked) {
        var htmlString = this.state.htmlForm;
        var n = htmlString.indexOf("</head>");
        var kkkkk = new Date();
        var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n); this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });
      }
    }
  }



  render_FlatList_header = () => {
    var header_View = (
      <View style={{ height: this.state.Height, overflow: 'scroll' }}>
        <WebView
          style={styles.header_footer_style}
          source={{ html: htmlContent }}
          onNavigationStateChange={this.onNavigationChange.bind(this)} />
      </View>
    );
    return header_View;
  };

  backDetail = () => {
    console.log("hiiiii this.state.articlesToOpen", this.state.articlesToOpen)

    if (this.state.articlesToOpen.length == 1) {
      this.setState({ visibleModal: null, articlesToOpen: [] })
    }
    else {
      var articlesToOpen = this.state.articlesToOpen;
      var cuurent_article = this.state.articlesToOpen[this.state.articlesToOpen.length - 2];
      articlesToOpen.splice(this.state.articlesToOpen.length - 1);
      console.log("hiiiii this.state.articlesToOpen after", articlesToOpen)
      this.setState({ articlesToOpen: articlesToOpen })
      this.showArticleDetailForLinks(cuurent_article);
    }

  }


  render() {
    return (

      <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', marginTop: 10, height: '100%', position: 'relative' }}>

        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent:'center'  }}>

          <Spinner
            visible={this.state.spinner} />


          <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 20, marginBottom: 10 }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 40, height: 30 }}>
              <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
            </TouchableOpacity>
            <View style={{ width: '95%', flexDirection: 'column' }}>
              <Text style={{ fontSize: 25, textTransform: 'uppercase', color: '#527CF3', fontFamily: 'BigJohn', justifyContent: 'center', marginLeft: 25, marginTop: 5 }}>{this.state.browseLevelSecond ? this.state.browseLevelSecond : this.state.browseLevelFirst}</Text>

              <View style={{ width: '95%', flexDirection: 'row', marginTop: 10, marginLeft: 25, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />

            </View>
          </View>

          <ScrollView style={{ marginTop: 40, marginLeft: 40 }}
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                let that = this;
                if (!that.state.trueeee) {
                  that.setState({ trueeee: true })
                  {
                    this.state.showData ?
                    that.setState({ showIndicator: true }, that.getArticleBrowseLevel())
                    : null
                  }
                  setTimeout(() => { that.setState({ trueeee: false, showIndicator: false }) }, 4000)

                }
              }
            }}>
            <FlatList
              refreshing={this.state.refreshing}
              data={this.state.articleData}
              renderItem={({ item, index }) =>
                <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                  onPress={(nn) => this.showVisible(index, '', item)}>
                

                  {item.image ?
                    <Image style={[styles.imageBookmarks, { height: this.state.visible[index] ? 270 : 250, width: this.state.visible[index] ? 320 : 300, marginRight: item.hasMore ? 0 : 15 }]} source={{ uri: item.image }} />
                    :
                    <ImageBackground style={[styles.noImageStyle , { height: this.state.visible[index] ? 270 : 250, width: this.state.visible[index] ? 320 : 300, marginRight: item.hasMore ? 0 : 15 }]}>
                    <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                  </ImageBackground>
                  }
                  {item.image ? <Image source={require('../assets/images/gradient.png')} style={{ width: this.state.visible[index] ? 320 : 300, height: this.state.visible[index] ? 270 : 70, position: 'absolute', marginLeft: 10, borderRadius: 10, bottom: 0 }} />: null}
             
                  {this.state.visible[index] ?
                    <View style={{ flexDirection: 'row', position: 'absolute', marginLeft: 20, right: 20, top: 20 }}>
                      <TouchableOpacity style={{ paddingRight: 5, zIndex: 99999 }} onPress={(mm) => this.addToFavorite(item, index)}>
                        {item.isFavourite ?
                          <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_yellow.png')} />
                          :
                          <Image style={{ width: 50, height: 50 }} source={require('../assets/images/star_white.png')} />
                        }
                      </TouchableOpacity>

                      <TouchableOpacity style={{ paddingLeft: 5, zIndex: 999 }} onPress={(mm) => this.setShowNewListModal(true, item , '')}>
                        <Image style={{ width: 50, height: 50 }} source={require('../assets/images/list_white.png')} />
                      </TouchableOpacity>
                    </View> : null}


                  <View style={{ width: 300, justifyContent: 'center', position: 'absolute', bottom: this.state.visible[index] ? 10 : 0 }}>
                    <Text numberOfLines={2} style={styles.textStyle}>{item.title_for_display}</Text>

                    {this.state.visible[index] ?
                      <View style={{ marginTop: 30 }}>
                       
                        <Text numberOfLines={4} style={styles.textDesStyle}>{item.summary}</Text>
                      </View>
                      : null}
                  </View>
                </TouchableOpacity>

              }

              ItemSeparatorComponent={this.renderSeparator}
              numColumns={3}
              horizontal={false}
              showsHorizontalScrollIndicator={false}
            />

            <ActivityIndicator
              style={{ padding: 15 }}
              animating={this.state.showIndicator}
              size="large" color="white" />
          </ScrollView>


          <Modal
            coverScreen={true}
            isVisible={this.state.visibleModal === 'sliding'}
            backdropColor="tranparent"
            animationIn="slideInRight"
            animationOut="slideOutRight"
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800} >






            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Spinner
                visible={this.state.spinner2} />


              <TouchableOpacity activeOpacity={1} style={{ width: '15%', backgroundColor: this.state.transparentModal ? 'rgba(255, 255, 255 ,0.0)' : 'rgba(255,255,255,0.5)' }} onPress={() => this.setState({ visibleModal: false, transparentModal: true, defaultChecked: true, customChecked: false, articlesToOpen: [] })} />


              <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>
              <TouchableOpacity style={{ marginLeft: 20, marginTop: 15 }} onPress={() => this.backDetail()}>
                <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
              </TouchableOpacity>



                <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
                  
                </View>


                <View style={{ position: 'absolute', marginTop: 15, right: 10, flexDirection: 'row', flexDirection: 'row', padding: 10 }}>

                  <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginRight: 15 }} onPress={(nn) => this.addToFavoriteeeeee(this.state.seachedItem, this.state.selectedIndex)}>
                      <Image style={{ width: 30, height: 31 }} source={require('../assets/images/star_plus.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginRight: 15 }} onPress={(mm) => this.setShowNewListModal(true, this.state.seachedItem, this.state.modalType, 'Modal')}>
                      <Image style={{ width: 30, height: 32 }} source={require('../assets/images/lists_star.png')} />
                    </TouchableOpacity>


                  </View>

                </View>


                <View style={{ width: '100%', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                <WebView
                  style={{ flex: 1, marginBottom: 20 }}
                  ref={(ref) => { this.webview = ref; }}
                  source={{ html: this.state.htmlForm }}
                  onNavigationStateChange={(event) => {
                    if (event.url != 'about:blank') {
                      this.webview.stopLoading();

                      var article_nmaesss = event.url.split('/');
                      var article_name = article_nmaesss[article_nmaesss.length - 1];
                      console.log("article_name", article_name)
                      var articlesToOpen = this.state.articlesToOpen;
                      articlesToOpen.push(article_name)
                      this.setState({articlesToOpen: articlesToOpen})
                      this.showArticleDetailForLinks(article_name);
                    }

                  }} />

              </View>
              <Modal

                animationType="slide"
                visible={this.state.newListShow}
                transparent={true}>

                <View style={{
                  height: '100%',
                  width: '100%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.8)'
                }}>

                  <View style={{
                    width: '60%',
                    backgroundColor: '#fff',
                    height: 'auto',
                    borderRadius: 10,
                    flexDirection: 'column',
                  }}>



                    <Text style={{ color: 'black', fontSize: 22, marginTop: 15, marginBottom: 15, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman', fontWeight: 'bold' }}>Create New List</Text>

                    <View style={{ width: '100%', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                    <ScrollView
                      style={{ height: 300 }}>
                      <View style={{ padding: 10 }}>

                        <FlatList
                          data={this.state.userList}
                          renderItem={({ item, index }) =>
                            <CheckBox
                              title={item.listName}
                              checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                              uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                              checked={this.state.checked[index]}
                              onPress={() => this.isIconCheckedOrNot(item, index)}
                              containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
                              textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />

                          }

                          ItemSeparatorComponent={this.renderSeparator}
                          horizontal={false}
                          refreshing={this.state.refreshingCheck}
                        />


                        <CheckBox
                          title="Create New List"
                          checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                          uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                          checked={this.state.newListChecked}
                          onPress={() => this.createNewIcon()}
                          containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
                          textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />



                      </View>
                    </ScrollView>



                    <View style={{ padding: 10 }}>


                      {this.state.newListChecked ?
                        <View style={{ height: 60, borderRadius: 10, borderColor: '#E5E5E5', marginLeft: 20, marginRight: 20, borderWidth: 1 }}>
                          <TextInput style={{ width: '60%', height: 60, paddingLeft: 15, alignItems: 'center', fontSize: 20, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}
                            placeholder="List Title"
                            returnKeyType={"done"}
                            ref={(input) => { this.password = input; }}
                            onChangeText={(listTitle) => this.setState({ listTitle: !this.state.listTitle ? listTitle.replace(/\s/g, '') : listTitle })}
                            value={this.state.listTitle} />
                        </View>
                        : null}


                      <TouchableOpacity style={styles.styleSubmit} onPress={(nn) => { this.setCreateList() }}>
                        <Text style={{ color: 'white', fontSize: 25, marginTop: 10, fontFamily: 'HelveticaNeueLTStd-Md' }}>SUBMIT</Text>
                      </TouchableOpacity>


                      <View style={{ width: '100%', paddingBottom: 10, marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />


                      <TouchableOpacity onPress={() => { this.setShowNewListModal(false, 'item') }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                        <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
                      </TouchableOpacity>

                    </View>

                  </View>
                </View>
              </Modal>
            </View>
          </Modal>




          <Modal

            animationType="slide"
            visible={this.state.newListShow}
            transparent={true}>

            <View style={{
              height: '100%',
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)'
            }}>

              <View style={{
                width: '60%',
                backgroundColor: '#fff',
                height: 'auto',
                borderRadius: 10,
                flexDirection: 'column',
              }}>



                <Text style={{ color: 'black', fontSize: 22, marginTop: 15, marginBottom: 15, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman', fontWeight: 'bold' }}>Create New List</Text>

                <View style={{ width: '100%', marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />

                <ScrollView
                  style={{ height: 300 }}>
                  <View style={{ padding: 10 }}>

                    <FlatList
                      data={this.state.userList}
                      renderItem={({ item, index }) =>
                        <CheckBox
                          title={item.listName}
                          checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                          uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                          checked={this.state.checked[index]}
                          onPress={() => this.isIconCheckedOrNot(item, index)}
                          containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
                          textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />

                      }

                      ItemSeparatorComponent={this.renderSeparator}
                      horizontal={false}
                      refreshing={this.state.refreshingCheck}
                    />


                    <CheckBox
                      title="Create New List"
                      checkedIcon={<Image source={require('../assets/images/checkbox_selected.png')} />}
                      uncheckedIcon={<Image source={require('../assets/images/checkbox.png')} />}
                      checked={this.state.newListChecked}
                      onPress={() => this.createNewIcon()}
                      containerStyle={{ backgroundColor: '#ffffff00', borderWidth: 0 }}
                      textStyle={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 10, fontSize: 22, fontWeight: '100' }} />



                  </View>
                </ScrollView>



                <View style={{ padding: 10 }}>


                  {this.state.newListChecked ?
                    <View style={{ height: 60, borderRadius: 10, borderColor: '#E5E5E5', marginLeft: 20, marginRight: 20, borderWidth: 1 }}>
                      <TextInput style={{ width: '60%', height: 60, paddingLeft: 15, alignItems: 'center', fontSize: 20, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}
                        placeholder="List Title"
                        returnKeyType={"done"}
                        ref={(input) => { this.password = input; }}
                        onChangeText={(listTitle) => this.setState({ listTitle: !this.state.listTitle ? listTitle.replace(/\s/g, '') : listTitle })}
                        value={this.state.listTitle} />
                    </View>
                    : null}


                  <TouchableOpacity style={styles.styleSubmit} onPress={(nn) => { this.setCreateList() }}>
                    <Text style={{ color: 'white', fontSize: 25, marginTop: 10, fontFamily: 'HelveticaNeueLTStd-Md' }}>SUBMIT</Text>
                  </TouchableOpacity>


                  <View style={{ width: '100%', paddingBottom: 10, marginTop: 10, borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5 }} />


                  <TouchableOpacity onPress={() => { this.setShowNewListModal(false, 'item') }} style={{ width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'center' }}>
                    <Text style={{ color: '#B8B8B8', fontSize: 25, fontFamily: 'HelveticaNeueLTStd-Md' }}>x CLOSE</Text>
                  </TouchableOpacity>

                </View>

              </View>
            </View>
          </Modal>

        </View>
      </ImageBackground>

    );
  }
}


export default ArticlesBrowseLevel;


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
  },
  imageBookmarks: {
    width: 250,
    height: 320,
    marginLeft: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  textDesStyle: {
    fontSize: 14,
    color: 'white',
    marginLeft: 20,
    marginTop: 10,
    fontFamily: 'HelveticaNeueLTStd-Roman',
    flex: 1,
    flexWrap: 'wrap',
  }, textStyle: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    marginLeft: 20,
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: 'bold',
    paddingTop: 8,
    paddingBottom: 70,
    lineHeight: 14
  },
  styleSubmit: {
    width: '94%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
    , borderRadius: 10,
    backgroundColor: '#3F67DC',
    marginTop: 15,
    marginLeft: 20
  },
  header_footer_style: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, marginBottom: 20,
  },

  noImageStyle: {
    flexDirection: 'row',
    borderRadius: 10,
    width: 250,
    height: 320,
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