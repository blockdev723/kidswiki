import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, ScrollView, WebView, TouchableOpacity, ImageBackground, FlatList , Alert , Linking} from 'react-native';
import { Base_Url, AppVersion } from '../constants/common';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import { Thumbnail } from 'native-base';
import { CheckBox } from 'react-native-elements';






export class Featuredlist extends Component {



  constructor(props) {
    super(props);

    this.state = {
      childs: [{ 'username': '' }],
      visible: [],
      visible1: [],
      visible2: [],
      refreshing: false,
      bgColor: [
        'red',
        'blue',
        'yellow',
      ],
      user_token: '',
      selectedChild: { username: '' },
      spinner: false,
      showLoad: true,
      featuredData: [],
      popoverShow: false,
      htmlForm: '',
      responseModal: {},
      defaultChecked: true,
      noDataFound: false,
      articlesToOpen: []

    };
  }

  componentWillReceiveProps(nextProps) {
    if (global.currenttt == 3) {
      AsyncStorage.getItem("token").then((value) => {
        AsyncStorage.getItem('childs').then((childs) => {
          AsyncStorage.getItem('globalIndex').then((index) => {

            console.log("indexList", index)

            // console.log("user_token home", value, childs)
            var childsss = JSON.parse(childs);
            global.selectedChild = childsss[global.colorIndex];
            this.setState({ user_token: value, childs: childsss, selectedChild: childsss[0] })
            this.getFeaturedData();
          }).done();
        }).done();
      }).done();
      this.setState({ popoverShow: false })
    }
  }



  _getRandomColor() {
    var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
    this.setState({
      selectedColor: item,
    })
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
          this.setState({ showData: true, banData: responseJson.data });
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }

      }).catch((error) => {
        console.log(error);
      });

  }



  getFeaturedData() {
    var timzone = DeviceInfo.getTimezone();
    this.setState({ timzone: timzone });
    if (this.state.showLoad) {
      this.setState({ spinner: true })
    }

    fetch(Base_Url + 'getUserListArticles', {
      method: "POST",
      headers: {
        'appVersion': AppVersion,
        'timezone': timzone,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.user_token
      },
      body: JSON.stringify({
        childId: global.selectedChild.id,
      })

    })
      .then((response) => {
        if (response.status === 200) {
          console.log("FeaturedDataSUCCESSS")
          return response.json();
        } else if (response.status === 401) {
          this.setState({ spinner: false });
          return response.json();
        }
        else if (response.status === 423) {
          return response.json();
        }
      })
      .then((responseJson) => {
        this.data = responseJson;

        if (responseJson.status == 1) {
          this.setState({ showData: true, spinner: false, featuredData: responseJson.data, showLoad: false });

          this._getRandomColor()
          this.getBannledList();

          let that = this;
          setTimeout(function () { that.setState({ noDataFound: true }) }, 2000);

        }
        else {

          if (responseJson.app_version_error_code === '423') {
            this.showAppUpdateAlert(responseJson.url)

          } else {
          this.setState({ spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
          }
        }

        console.log(this.state.featuredData == 0)

      }).catch((error) => {
        this.setState({ spinner: false });
        console.log(error);
      });

  }


  setPopupVisible(visible) {
    this.setState({ popoverShow: !this.state.popoverShow });

  }


  selectChild = (item, index) => {
    if (item.id !== global.selectedChild.id) {
      this.setPopupVisible(false)
      global.selectedChild = item;
      global.colorIndex = index;
      AsyncStorage.setItem("globalIndex", JSON.stringify(index));
      this.setState({ selectedChild: item, spinner: true })
      let that = this;
      setTimeout(function () { that.getFeaturedData() }, 500);
    } else {
      this.setPopupVisible(false)
    }

  }



  _onPress = (screen) => {
    this.props.navigation.navigate(screen)
  }


  setShowDescriptionModal(item, index, key) {
    var articlesToOpen = this.state.articlesToOpen;
    articlesToOpen.push(item.title);

    this.setState({ visibleModal: 'sliding', htmlForm: '', responseModal: '', articlesToOpen: articlesToOpen, seachedItem: item, selectedIndex: index, selectedKey: key, popoverShow: false, transparentModal: true });

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
        title: item.title,
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
                // console.log("ayaaaa")
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



          this.setState({ htmlForm: openFacts, responseModal: responseJson, htmlFormPrev: openFacts, spinnerModal: false });


          var htmlString = this.state.htmlForm;
          var n = htmlString.indexOf("</head>");
          var kkkkk = new Date();
          var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
          this.setState({ defaultChecked: false, customChecked: true, htmlForm: new_string });


          if (responseJson.status == 1) {
          }
          else {
            this.setState({ spinnerModal: false });
          }
        }

      }).catch((error) => {
        setTimeout(function () { that.setState({ spinnerModal: false }) }, 1000);
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
          var new_string = htmlString.slice(0, n) + "<link rel=\"stylesheet\" href=\"http://68.183.237.82:8000/media/uploadedcss/uploaded_css_file.css?" + kkkkk + "\" type=\"text/css\" >" + htmlString.slice(n);
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



  addToFavorite(item, index, key) {
    console.log("addtofacvttttttt dataaaa", this.state.responseModal)
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
        childId: global.selectedChild.id,
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
          this.setState({ showData: true, spinner: false });
          Toast.show(responseJson.message, Toast.SHORT);
        }
        else {
          Toast.show(responseJson.message, Toast.SHORT);
        }
      }).catch((error) => {
        console.log(error);
      });

  }

  hideSpinner() {
    console.log("MY_List Spinner")
    this.setState({ spinnerModal: false });
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



      <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'row' }} onPress={() => this.setState({ popoverShow: false })}>
        <Spinner
          visible={this.state.spinner} />
        <View style={{ width: '100%', height: '100%' }}>
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 35, left: 20, right: 20, zIndex: 999 }}>
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
              <Text style={{ textTransform: 'uppercase', color: '#527CF3', fontSize: 25, fontFamily: 'BigJohn', marginLeft: 5 }}>My Lists</Text>
              <View style={{ width: '71%', flexDirection: 'row', marginTop: 5, marginLeft: 5, borderBottomColor: '#BDBDBD', borderBottomWidth: 2 }} />

            </View>

            <View style={{ position: 'absolute', right: 30, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { this.props._onClickSearch('Mysearch'); this.setState({ popoverShow: false }) }} style={styles.iconBackground}>
                <Image style={{ width: 27, height: 27 }} source={require('../assets/images/search.png')} />
              </TouchableOpacity>

            


              <TouchableOpacity style={[styles.circle, { backgroundColor: global.colorIndex == 0 ? '#527CF3' : global.colorIndex == 1 ? '#F45C5F' : global.colorIndex == 2 ? '#62C677' : global.colorIndex == 3 ? '#05e6f0' : '#800080' }]} onPress={() => { this.setPopupVisible(true) }}>
                <Text style={{ fontSize: 22, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md', textAlign: 'center', marginTop: 8, marginLeft: 1 }}>{global.selectedChild.username.substring(0, 1)}</Text>
              </TouchableOpacity>

            </View>

          </View>


          <ImageBackground source={require('../assets/images/new_bg.png')} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 60 }}>


            {this.state.featuredData == 0 ?

              <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                {this.state.noDataFound ?
                  <View >
                    <Text style={{
                      fontSize: 18, color: 'black', marginLeft: 15,
                      marginTop: 5, fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: 'bold',
                    }}>No Data Found</Text>
                  </View>
                  : null}
              </View>

              :

              <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ marginBottom: 70, marginTop: 30 }}>
                {this.state.featuredData.map((mainItem, key) => (
                  <TouchableOpacity activeOpacity={1} style={{ marginLeft: 15, marginBottom: 20 }}>

                    <View>
                      <View style={{ flexDirection: 'row', marginLeft: 15, marginBottom: 10 }}>
                        <Text style={{ fontSize: 22, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', fontWeight: '400' }}>{mainItem.listName}</Text>
                      </View>

                      <FlatList
                        data={mainItem.articles}
                        renderItem={({ item, index }) =>
                          <TouchableOpacity style={{ width: 220, height: 190, flexDirection: 'column', marginRight: 5, marginLeft: 5 }} onPress={() => this.setShowDescriptionModal(item, index, key)}>
                            {item.image ? <View style={{ height: 160 }}>
                              < Image style={styles.imageAnimals} source={{ uri: item.image }} />
                              <Image source={require('../assets/images/gradient.png')} style={{ width: 220, height: 80, position: 'absolute', borderRadius: 10, bottom: 0 }} />
                            </View> :
                              <ImageBackground style={[styles.noImageStyle]}>
                                <Text style={{ fontFamily: 'BigJohn', fontSize: 22, color: 'white', textAlign: 'center' }}>No Image</Text>
                              </ImageBackground>}


                            <Text numberOfLines={1} style={styles.textStyle}>{item.displayTitle}</Text>
                          </TouchableOpacity>

                        }
                        ItemSeparatorComponent={this.renderSeparator}
                        numColumns={4}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>

                  </TouchableOpacity>

                ))}

              </ScrollView>


            }

          </ImageBackground>

        </View>

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
            {/* <Spinner
              visible={this.state.spinnerModal} /> */}

            <TouchableOpacity activeOpacity={1} style={{ width: '15%', backgroundColor: this.state.transparentModal ? 'rgba(255, 255, 255 ,0.0)' : 'rgba(255,255,255,0.5)' }} onPress={() => this.setState({ visibleModal: false, transparentModal: true, defaultChecked: true, customChecked: false, articlesToOpen: [] })} />
            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>

              <TouchableOpacity style={{ marginLeft: 20, marginTop: 15 }} onPress={() => this.backDetail()}>
                <Image source={require('../assets/images/left_arrowblack.png')} style={{ width: 40, height: 30 }} />
              </TouchableOpacity>

              <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
               
              </View>

              <View style={{ position: 'absolute', marginTop: 15, right: 10, flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginRight: 15, zIndex: 9999 }} onPress={(nn) => this.addToFavorite(this.state.seachedItem, this.state.selectedIndex, this.state.selectedKey)}>
                  <Image style={{ width: 30, height: 31 }} source={require('../assets/images/star_plus.png')} />
                </TouchableOpacity>
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
                    this.setState({ articlesToOpen: articlesToOpen })
                    this.showArticleDetailForLinks(article_name);
                  }
                }} />

            </View>
          </View>
        </Modal>
      </TouchableOpacity>





    );
  }
}


export default Featuredlist;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageAnimals: {
    width: 220,
    height: 160,
    borderRadius: 10,

  }, textStyle: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'HelveticaNeueLTStd-Md',
    fontWeight: 'bold',
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
    marginRight: 10

  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
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
    borderRadius: 100 / 2,
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

  noImageStyle: {
    flexDirection: 'row',
    borderRadius: 10,
    height: 160,
    marginLeft: 5,
    marginRight: 5,
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

