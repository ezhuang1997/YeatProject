import React from "react";
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';
import axios from 'axios';

const config = {
  headers: {'Authorization': 'Bearer ***'},
};

export default class FormScreen extends React.Component {

  state = {
      approvedRestaurants: '',
      roomCode: '',
      users: '',
      userCount: '',
      approved: '',
      approvedCount: '',
      result: [],
      moreRestaurants: false,
  }

  static navigationOptions = {
  headerLeft: null
  }

  componentWillMount(){
      const { navigation } = this.props;
      const approvedRestaurants = navigation.getParam('approved', 'NO-DATA');
      const roomCode = navigation.getParam('roomCode', 'NO-DATA');
      var userCount = 0;
      var approvedCount = 0;

      this.setState({
          approvedRestaurants: approvedRestaurants,
          roomCode: roomCode
      });

      var roomRef = firebase.database().ref('rooms/' + roomCode).on('value', (snapshot)=>{

          userCount = 0;
          approvedCount = 0;

          Object.keys(snapshot.val().approved).map(function(key){
              approvedCount++;
          });

          this.setState({
              approved: snapshot.val().approved,
              approvedCount: approvedCount
          })

        console.log('GOGOGO');
        var res = [];

        Object.values(this.state.approved).map(function(app){
           console.log(app.restaurants)
           if(app.restaurants!='nothing'){
               Object.values(app.restaurants).map(function(app){
                  console.log([app.id,app.name,app.image_url,app.rating,app.distance])
                  res.push([app.id,app.name,app.image_url,app.rating,app.distance,app.location,app.categories]);
               });
           }
        });
        console.log(res)
        console.log(this.sortByFrequency(res))
        this.setState({result:this.sortByFrequency(res)})

      });

  }

  sortByFrequency(array){
    var frequency = {};

    array.forEach(function(value) { frequency[value] = 0; });

    var uniques = array.filter(function(value) {
        return ++frequency[value] == 1;
    });

    console.log(frequency)

    var sortedRestaurants = uniques.sort(function(a, b) {
        return frequency[b] - frequency[a];
    });

    sortedRestaurants.forEach(function(value) {
        console.log(value);
        console.log(frequency[value]);
        value.frequency = frequency[value]
    });

    return sortedRestaurants;
  }

  listApproved() {
    console.log(this.state.result)
    var navi = this.props.navigation;

    return this.state.result.slice(0,3).map(function(restaurant, i){

      return(
          <View key={i} style={{width:'100%',paddingLeft:10,paddingTop:10,paddingRight:10}}>
            <TouchableOpacity onPress={()=>{

                navi.navigate('Detail',{
                    busID:restaurant[0],
                    distance:restaurant[4],
                    location:restaurant[5].display_address,
                    categories:restaurant[6]
                });

            }}>
            <View style={{flexDirection:'row',width:'100%',backgroundColor:'white',borderRadius:8,overflow:'hidden',height:100}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                    <Image style={styles.img} source={{uri:restaurant[2]}}/>
                </View>
                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',padding:5}}>
                    <View style={{flex:3,flexDirection:'column',justifyContent:'flex-start',paddingLeft:3}}>
                        <Text style={{fontSize:20,fontWeight:'bold',paddingBottom:5,color:'black'}}>{restaurant[1]}</Text>
                        <Text style={{padding:0,height:'100%',color:'black'}}>{
                            restaurant[3]<1 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_0.png')}/> :
                            restaurant[3]<1.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1.png')}/> :
                            restaurant[3]<2 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1_half.png')}/> :
                            restaurant[3]<2.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2.png')}/> :
                            restaurant[3]<3 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2_half.png')}/> :
                            restaurant[3]<3.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3.png')}/> :
                            restaurant[3]<4 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3_half.png')}/> :
                            restaurant[3]<4.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4.png')}/> :
                            restaurant[3]<5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4_half.png')}/> :
                            <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_5.png')}/>
                        }</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start'}}>
                        <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-start'}}>
                            <Text style={{paddingRight:3,color:'black'}}>{(Math.round(restaurant[4])/1000).toFixed(2)}km</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <Text style={{color:'black'}}>{restaurant.frequency}</Text>
                            <Icon style={{paddingLeft:3,paddingBottom:1,paddingRight:3}} name="heart" size={15} color="#E9544F" />
                        </View>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
          </View>
      );
    });
  }

  MoreListApproved() {
    console.log(this.state.result)
    var navi = this.props.navigation;

    return this.state.result.slice(3).map(function(restaurant, i){

      return(
          <View key={i} style={{width:'100%',paddingLeft:10,paddingTop:10,paddingRight:10}}>
            <TouchableOpacity onPress={()=>{

                navi.navigate('Detail',{
                    busID:restaurant[0],
                    distance:restaurant[4],
                    location:restaurant[5].display_address,
                    categories:restaurant[6]
                });

            }}>
            <View style={{flexDirection:'row',width:'100%',backgroundColor:'white',borderRadius:8,overflow:'hidden',height:100}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                    <Image style={styles.img} source={{uri:restaurant[2]}}/>
                </View>
                <View style={{flex:3,flexDirection:'row',justifyContent:'flex-end',padding:5}}>
                    <View style={{flex:3,flexDirection:'column',justifyContent:'flex-start',paddingLeft:3}}>
                        <Text style={{fontSize:20,fontWeight:'bold',paddingBottom:5,color:'black'}}>{restaurant[1]}</Text>
                        <Text style={{padding:0,height:'100%',color:'black'}}>{
                            restaurant[3]<1 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_0.png')}/> :
                            restaurant[3]<1.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1.png')}/> :
                            restaurant[3]<2 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1_half.png')}/> :
                            restaurant[3]<2.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2.png')}/> :
                            restaurant[3]<3 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2_half.png')}/> :
                            restaurant[3]<3.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3.png')}/> :
                            restaurant[3]<4 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3_half.png')}/> :
                            restaurant[3]<4.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4.png')}/> :
                            restaurant[3]<5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4_half.png')}/> :
                            <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_5.png')}/>
                        }</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start'}}>
                        <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-start'}}>
                            <Text style={{paddingRight:3,color:'black'}}>{(Math.round(restaurant[4])/1000).toFixed(2)}km</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <Text style={{color:'black'}}>{restaurant.frequency}</Text>
                            <Icon style={{paddingLeft:3,paddingBottom:1,paddingRight:3}} name="heart" size={15} color="#E9544F" />
                        </View>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
          </View>
      );
    });
  }

  toggleOptions() {
      this.setState({
          moreRestaurants: !this.state.moreRestaurants
      })
      console.log(this.state.moreRestaurants);
  }

  render() {

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{alignItems: 'center', justifyContent:'center'}} style={{flex:1,backgroundColor:'#FAA500',width:'100%'}}>
                <Text style={styles.title}>Top 3 Results</Text>
                <View style={{flex:1,backgroundColor:'#FAA500',width:'100%'}}>
                    {this.listApproved()}
                </View>
            <TouchableOpacity onPress={()=>{this.toggleOptions()}} style={{flex:1,justifyContent:'flex-start',alignItems:'center',backgroundColor:'#FAA500',width:'100%',paddingBottom:10}}>
                {this.state.approvedRestaurants.length > 3 && <View style={{paddingTop:7}}><Icon name="chevron-down" size={30} color="#000000" /></View>}
                {this.state.moreRestaurants && this.MoreListApproved()}
            </TouchableOpacity>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  img: {
    height: '100%',
    width: '100%'
  },
  title: {
    fontSize:30,
    textAlign:'center',
    fontFamily: 'OleoScript-Regular',
    color:'white',
    padding:5
  }
});