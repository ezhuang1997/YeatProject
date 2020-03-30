import React from "react";
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Share, ActivityIndicator, Picker, Alert} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator, createAppContainer } from "react-navigation";
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';
import Geolocation from '@react-native-community/geolocation';

var config = {
  headers: {'Authorization': 'Bearer ***'},
  params: {
    sortBy:'distance',
    term:'food'
  }
};

export default class FormScreen extends React.Component {

    state = {
        restaurants:[],
        inputRadius: '',
        inputLocation: '',
        inputLimit: '',
        inputCategory: '',
        roomCode: '',
        createRoom: false,
        joinRoom: false,
        submitView: false,
        categoryPicker: '',
        toggleCategoryPicker: false,
        toggleShowOpen: true,
        searchError: false,
    };

    static navigationOptions = {
    headerLeft: null
    }

  componentWillMount() {
    this.setState({
        restaurants:[],
        inputRadius: '',
        inputLocation: '',
        inputLimit: '',
        inputCategory: '',
        roomCode: '',
        createRoom: false,
        joinRoom: false,
        submitView: false,
        categoryPicker: '',
        toggleCategoryPicker: false,
        toggleShowOpen: true,
        searchError: false,
    })
  }

  shareCode(){
      Share.share({
          message:`Go to yeat.app on your browser and join with the code: ${this.state.roomCode}`
      }).then((res)=>{
          console.log(res)
      });
  }

  getLocation(){
      this.setState({loadingLocation:true});
      Geolocation.getCurrentPosition(
          (position)=>{
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          this.setState({inputLocation:lat + ", " + long,loadingLocation:false});
          console.log(this.state.inputLocation);
          },
          (error)=>{
              console.log(error);
              this.setState({loadingLocation:false});
          },
          {
              enableHighAccuracy: true,
              timeout : 10000,
              maximumAge: 0,
          }
      );
  }

  listRestaurants() {
    return this.state.restaurants.map(function(restaurant, i){
      return(
        <View key={i}>
          <Text>{restaurant.name}</Text>
        </View>
      );
    });
  }

  displayCategoryPicker() {
    
    if (Platform.OS === "android") {
        return (
            <Picker style={styles.categoryPicker} selectedValue={this.state.categoryPicker} onValueChange={(itemValue) => this.setState({categoryPicker: itemValue, inputCategory: itemValue})}>
            <Picker.Item label="Select Category" value=""/>
            <Picker.Item label="Brunch" value="breakfast_brunch"/>
            <Picker.Item label="Cafes" value="cafes"/>
            <Picker.Item label="Bars" value="bars"/>
            <Picker.Item label="Burgers" value="burgers"/>
            <Picker.Item label="Ice Cream" value="icecream"/>
            <Picker.Item label="Buffets" value="buffets"/>
            <Picker.Item label="Comfort Food" value="comfortfood"/>
            <Picker.Item label="Fast Food" value="hotdogs"/>
            <Picker.Item label="Steakhouses" value="steak"/>
            <Picker.Item label="Canadian" value="newcanadian"/>
            <Picker.Item label="Chinese" value="chinese"/>
            <Picker.Item label="Japanese" value="japanese"/>
            <Picker.Item label="Korean" value="korean"/>
            <Picker.Item label="Indian" value="indpak"/>
            <Picker.Item label="Italian" value="italian"/>
            <Picker.Item label="Middle Eastern" value="mideastern"/>
            <Picker.Item label="Mediterranean" value="mediterranean"/>
            </Picker>
        );
    }

    if (this.state.toggleCategoryPicker) {
        return (
            <Picker style={styles.categoryPicker} selectedValue={this.state.categoryPicker} onValueChange={(itemValue) => this.setState({categoryPicker: itemValue, inputCategory: itemValue})}>
            <Picker.Item label="Select Category" value=""/>
            <Picker.Item label="Brunch" value="breakfast_brunch"/>
            <Picker.Item label="Cafes" value="cafes"/>
            <Picker.Item label="Bars" value="bars"/>
            <Picker.Item label="Burgers" value="burgers"/>
            <Picker.Item label="Ice Cream" value="icecream"/>
            <Picker.Item label="Buffets" value="buffets"/>
            <Picker.Item label="Comfort Food" value="comfortfood"/>
            <Picker.Item label="Fast Food" value="hotdogs"/>
            <Picker.Item label="Steakhouses" value="steak"/>
            <Picker.Item label="Canadian" value="newcanadian"/>
            <Picker.Item label="Chinese" value="chinese"/>
            <Picker.Item label="Japanese" value="japanese"/>
            <Picker.Item label="Korean" value="korean"/>
            <Picker.Item label="Indian" value="indpak"/>
            <Picker.Item label="Italian" value="italian"/>
            <Picker.Item label="Middle Eastern" value="mideastern"/>
            <Picker.Item label="Mediterranean" value="mediterranean"/>
            </Picker>
        );
    } else {
        return (
        <Text style={{marginLeft: -3,paddingTop: 10, fontSize: 16, color:'lightgrey'}}>{this.state.categoryPicker ? this.state.categoryPicker : 'Select Category'}</Text>);
    }
  }

  onSubmit() {console.log(this.state.toggleShowOpen);

    if (this.state.searchError) {
        this.setState({
            searchError: false
        });
    }

    this.setState({
        restaurants: [],
        searchError: false,
    });

      if(this.state.roomCode===''){
          this.setState({
              roomCode: Math.random().toString(36).substring(2, 5).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase()
          });
      }

      Object.assign(config.params,{location:this.state.inputLocation});

      if(this.state.inputRadius!=''){
          Object.assign(config.params,{radius:this.state.inputRadius});
      }

      if(this.state.inputLimit!=''){
          Object.assign(config.params,{limit:this.state.inputLimit});
      }

      if(this.state.inputCategory!=''){
          Object.assign(config.params,{categories:this.state.inputCategory});
      }

      if(this.state.toggleShowOpen!=''){
        Object.assign(config.params,{open_now:this.state.toggleShowOpen});
      }

      console.log(config);
      axios.get('https://api.yelp.com/v3/businesses/search', config)
      .then(response => {

        if (response.data.businesses.length == 0) {
            Alert.alert('We did not find any results, try increasing the search radius');
            this.setState({
                searchError: true
            });
        } else {
            console.log(response.data.businesses);
            this.setState({
                restaurants:response.data.businesses,
            });
        }

          firebase.database().ref('rooms/' + this.state.roomCode.toUpperCase()).set({
            location: this.state.inputLocation,
            radius: this.state.inputRadius,
            limit: this.state.inputLimit,
            category: this.state.inputCategory,
            roomCode: this.state.roomCode.toUpperCase(),
            restaurants : this.state.restaurants
          });
      });

      this.setState({submitView: true});
  }

  enterRoom = () => {
      const form = this;
      var ref = firebase.database().ref('rooms/' + this.state.roomCode.toUpperCase());
      ref.once("value")
        .then(function(snapshot) {
        if (snapshot.exists()) { 
            form.props.navigation.navigate('Swipe', {roomCode: form.state.roomCode.toUpperCase()});
        } else {
            Alert.alert('Invalid Room Code');
        }
      });

  }

  createOpen(){
      return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
      }
  }

  createClose(){
      return {
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
      }
  }

  joinOpen(){
      return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
      }
  }

  joinClose(){
      return {
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
      }
  }

  submitOpen(){
      return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
      }
  }

  submitClose(){
      return {
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
      }
  }

  showOpen() {
      return {
        backgroundColor:'green',padding:5,borderRadius:20,marginRight:3,
      }
  }

  showClosed() {
      return {
        backgroundColor:'red',padding:5,borderRadius:20,marginLeft:3,
      }
  }

  showOpenDisabled() {
        return {
        backgroundColor:'grey',padding:5,borderRadius:20,marginRight:3,
      }
  }

  showClosedDisabled() {
        return {
        backgroundColor:'grey',padding:5,borderRadius:20,marginLeft:3,
        }
    }

  render() {

  var createOpen = this.createOpen();
  var createClose = this.createClose();

  var joinOpen = this.joinOpen();
  var joinClose = this.joinClose();

  var submitOpen = this.submitOpen();
  var submitClose = this.submitClose();

  var showOpen = this.showOpen();
  var showClosed = this.showClosed();

  var showOpenDisabled = this.showOpenDisabled();
  var showClosedDisabled = this.showClosedDisabled();

    return (

      <ScrollView style={styles.container} contentContainerStyle={{alignItems: 'center'}}>
      <View style={styles.wrapper}>
        <View>
            <TouchableOpacity onPress={()=>{!this.state.createRoom ? this.setState({createRoom:true,joinRoom:false}) : this.setState({createRoom:false})}} style={styles.roomButton}>
                <View>
                    <Text style={styles.text}>Create Room</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{!this.state.joinRoom ? this.setState({joinRoom:true,createRoom:false}) : this.setState({joinRoom:false})}} style={styles.roomButton}>
                <View>
                    <Text style={styles.text}>Join Room</Text>
                </View>
            </TouchableOpacity>
        </View>

        <View style={this.state.createRoom ? createOpen : createClose}>
            <View style={styles.formWrapper}>
                <TouchableOpacity onPress={()=>this.getLocation()}>
                    <View style={styles.createButton}>
                        <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>Get Current Location</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.inputWrapper}>
                    <Icon style={styles.formIcon} name="map-marker" size={20} color="black" />
                    <TextInput
                    style={styles.inputForm}
                    onChangeText={(text) => this.setState({inputLocation:text})}
                    value={this.state.inputLocation}
                    placeholder = 'Enter Location *'
                    placeholderTextColor={'lightgrey'}
                    />
                    {this.state.loadingLocation && <View style={{zIndex:1000,justifyContent:'center',alignContent:'center',marginLeft:-12}}>
                    <ActivityIndicator animating={true} size="small" color="black" />
                    </View>}
                </View>

                <View style={styles.inputWrapper}>
                    <Icon style={styles.formIcon} name="location-arrow" size={20} color="black" />
                    <TextInput
                    style={styles.inputForm}
                    onChangeText={(text) => this.setState({inputRadius:text})}
                    value={this.state.inputRadius}
                    placeholder = 'Enter Radius (Metres)'
                    placeholderTextColor={'lightgrey'}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Icon style={styles.formIcon} name="sort" size={20} color="black" />
                    <TextInput
                    style={styles.inputForm}
                    onChangeText={(text) => this.setState({inputLimit:text})}
                    value={this.state.inputLimit}
                    placeholder = 'Amount of Results (Max 50)'
                    placeholderTextColor={'lightgrey'}
                    />
                </View>

                {
                    Platform.OS === 'android' ?
                    <View style={styles.dropdownInput} onPress={()=>Platform.OS === 'ios' ? this.setState({toggleCategoryPicker: !this.state.toggleCategoryPicker}) : null}>
                    <Icon style={styles.formIcon} name="cutlery" size={20} color="black" />
                    {this.displayCategoryPicker()}
                    </View> :
                    <TouchableOpacity style={styles.dropdownInput} onPress={()=>Platform.OS === 'ios' ? this.setState({toggleCategoryPicker: !this.state.toggleCategoryPicker}) : null}>
                    <Icon style={styles.formIcon} name="cutlery" size={20} color="black" />
                    {this.displayCategoryPicker()}
                    </TouchableOpacity>
                }

                <View style={styles.inputWrapper}>
                    <Icon style={styles.formIcon} name="key" size={20} color="black" />
                    <TextInput
                    style={styles.inputForm}
                    onChangeText={(text) => this.setState({roomCode:text})}
                    value={this.state.roomCode}
                    placeholder = 'Room Code'
                    autoCapitalize = 'none'
                    placeholderTextColor={'lightgrey'}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Icon style={styles.formIcon} name="clock-o" size={20} color="black" />
                    <View style={{display:'flex', flexDirection:'row'}}>
                        <View style={{width:'42%',justifyContent:'center',alignContent:'center',marginLeft:-2}}><Text style={{fontSize:16,color:'lightgrey'}}>Open Now</Text></View>
                        <TouchableOpacity onPress={()=>{this.setState({toggleShowOpen:true})}} style={{width:'25%',justifyContent:'center',alignContent:'center'}}>
                            <View style={this.state.toggleShowOpen ? showOpen : showOpenDisabled}>
                                <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>Yes</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.setState({toggleShowOpen:false})}} style={{width:'25%',justifyContent:'center',alignContent:'center'}}>
                            <View style={this.state.toggleShowOpen ? showClosedDisabled : showClosed}>
                                <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>No</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={()=>this.onSubmit()}>
                    <View style={styles.createButton}>
                        <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>Create</Text>
                    </View>
                </TouchableOpacity>

                <View style={!this.state.restaurants.length==0?{display:'none'}:{marginTop:20}}>
                {
                    (this.state.submitView && this.state.restaurants.length==0 && !this.state.searchError &&
                    <ActivityIndicator animating={true} size="large" color="white" />)
                }
                </View>
    
                <View style={this.state.submitView && !this.state.restaurants.length==0 ? submitOpen : submitClose}>
                    <View>
                        <Text style={{fontSize:60,fontWeight:'bold',color:'black'}}>{this.state.roomCode}</Text>
                    </View>
                    
                    <TouchableOpacity onPress={()=>this.shareCode()} style={styles.roomButton}>
                        <View style={styles.createButton}>
                            <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>Share Code</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity disabled={!this.state.restaurants.length ? true : false} onPress={()=>this.props.navigation.navigate('Swipe', {roomCode: this.state.roomCode.toUpperCase()})} style={styles.roomButton}>
                        <View style={styles.createButton}>
                            <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>Start Swiping!</Text>
                        </View>
                    </TouchableOpacity>

                    <View>
                        <Text style={{fontWeight:'bold',marginTop:5,color:'black'}}>We have found {this.state.restaurants.length} results</Text>
                    </View>
                </View>
            </View>
        </View>

        <View style={this.state.joinRoom ? joinOpen : joinClose}>
            <View style={styles.inputWrapper}>
                <Icon style={styles.formIcon} name="key" size={20} color="black" />
                <TextInput
                style={styles.inputForm}
                onChangeText={(text) => this.setState({roomCode:text})}
                value={this.state.roomCode}
                placeholder = 'Room Code'
                autoCapitalize = 'none'
                placeholderTextColor={'lightgrey'}
                />
            </View>
            <TouchableOpacity onPress={()=>this.enterRoom()} style={styles.roomButton}>
                <View style={styles.createButton}>
                    <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>Submit</Text>
                </View>
            </TouchableOpacity>
        </View>
      </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    backgroundColor: '#FAA500',
    overflow: 'scroll',
  },
  wrapper: {
    padding: 40,
    width:'100%',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  formWrapper:{
    padding:0,
    width:'100%',
  },
  roomButton: {
      width:'100%',
      height:40,
      backgroundColor:'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:20,
      marginTop:5,
      marginBottom:5,
      flexDirection:'row',
      shadowColor: 'rgba(0,0,0, .25)',
      shadowOffset: { height: 4, width: 2 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 5,
  },
  createButton: {
      width:'100%',
      height:40,
      backgroundColor:'green',
      justifyContent: 'center',
      alignItems: 'center',
      padding:10,
      borderRadius:20,
      marginTop:5,
      marginBottom:5,
      flexDirection:'row',
      shadowColor: 'rgba(0,0,0, .25)',
      shadowOffset: { height: 4, width: 2 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation:5,
  },
  inputWrapper: {
    width:'100%',
    borderRadius:20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft:5,
    marginTop:5,
    marginBottom:5,
  },
  dropdownInput: {
    width:'100%',
    borderRadius:20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft:5,
    marginTop:5,
    marginBottom:5,
    zIndex:100
  },
  inputForm: {
    fontSize:16,
    zIndex: 10,
    height: 30,
    width:'80%',
    backgroundColor:'white',
    marginTop:5,
    marginBottom:5,
    marginLeft: -3,
    marginRight: 0,
    paddingVertical:0,
    paddingHorizontal:0,
  },
  formIcon: {
    padding:10,
    color:'lightgrey',
    width:40,
  },
  text: {
    fontWeight: 'bold',
    color: 'black'
  },
  categoryPicker: {
    zIndex: 1000,
    width:'90%',
    height:'100%',
    color: 'lightgrey',
    padding: 0,
    margin:0,
    marginLeft: Platform.OS === 'android' ? -10 : '-10%',
  }
});