import React from "react";
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image, Dimensions} from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';
import axios from 'axios';
import { ScrollView } from "react-native-gesture-handler";
import Geolocation from '@react-native-community/geolocation';

const screenWidth = Math.round(Dimensions.get('window').width);
var config = {
  headers: {'Authorization': 'Bearer ***'},
  params: {
    sortBy:'distance',
    term:'food',
    categories:'festivals',
    location:'Toronto'
  }
};

export default class HomeScreen extends React.Component {

  state = {
    featuredEvents: [],
    hotAndNew: [],
    foodTrucks: [],
    inputLocation: '',
  }

  componentWillMount(){
    this.getLocation();
  }

  getLocation(){
    Geolocation.getCurrentPosition(
        (position)=>{
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        this.setState({inputLocation:lat + ", " + long});
        console.log(this.state.inputLocation);
        // Object.assign(config.params,{location:this.state.inputLocation});

        axios.get('https://api.yelp.com/v3/businesses/search', {
          headers: {'Authorization': 'Bearer ***'},
          params: {
            sortBy:'distance',
            term:'food',
            categories:'festivals',
            location:this.state.inputLocation
          }
        })
        .then(response => {
            console.log(response.data.businesses);
            this.setState({
                featuredEvents:response.data.businesses
            });
    
        });

        axios.get('https://api.yelp.com/v3/businesses/search', {
          headers: {'Authorization': 'Bearer ***'},
          params: {
            sortBy:'distance',
            term:'food',
            attributes:'hot_and_new',
            location:this.state.inputLocation
          }
        })
        .then(response => {
            console.log(response.data.businesses);
            this.setState({
                hotAndNew:response.data.businesses
            });
    
        });

        axios.get('https://api.yelp.com/v3/businesses/search', {
          headers: {'Authorization': 'Bearer ***'},
          params: {
            sortBy:'distance',
            term:'food',
            categories:'foodtrucks',
            location:this.state.inputLocation
          }
        })
        .then(response => {
            console.log(response.data.businesses);
            this.setState({
                foodTrucks:response.data.businesses
            });
    
        });

        },
        (error)=>{
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout : 10000,
            maximumAge: 0,
        }
    );
  }

  featured(array){ 
    const navi = this.props.navigation;
    return Object.values(array).map(function(featured, i){console.log(featured);
      if (featured.image_url) {
        return(
          <TouchableOpacity key={i} style={styles.featuredItem} onPress={()=>{navi.navigate('Detail',{
              busID:featured.id,
              distance:featured.distance,
              location:featured.location.display_address,
              categories:featured.categories,
            })}}>
            <View>
              <Image style={styles.img} source={{uri:featured.image_url}}/>
            </View>
            <View style={styles.featuredItemDetail}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                <View style={{flex:3,alignItems:'flex-start'}}>
                  <Text style={{color:'black'}} key={i}>{featured.name}</Text>
                </View>
                <View style={{flex:1,alignItems:'flex-end'}}>
                  <Text style={{color:'black'}} key={i}>{Math.round(featured.distance/1000)}km</Text>
                </View>
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                <View style={{flex:1,alignItems:'flex-start'}}>
                  {
                  featured.rating<1 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_0.png')}/> :
                  featured.rating<1.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1.png')}/> :
                  featured.rating<2 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1_half.png')}/> :
                  featured.rating<2.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2.png')}/> :
                  featured.rating<3 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2_half.png')}/> :
                  featured.rating<3.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3.png')}/> :
                  featured.rating<4 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3_half.png')}/> :
                  featured.rating<4.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4.png')}/> :
                  featured.rating<5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4_half.png')}/> :
                  <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_5.png')}/>
                  }
                </View>
                <View style={{flex:1,alignItems:'flex-end'}}>
                  <Text style={{color:'black'}} key={i}>{featured.price}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    });
  }

  onYeat() {
    this.props.navigation.navigate('Form');
  }

  spinner() {
    return (
    <View style={{width: screenWidth,justifyContent: 'center',alignItems: 'center',}}>
        <ActivityIndicator animating={true} size="large" color="white"/>
    </View>
    );
  }

  render() {

    return (
        <View style={styles.container}>
          
          <View style={styles.display}>
          <ScrollView>

            <Text style={styles.title}>Upcoming Events</Text>
            <View style={styles.featuredSections}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {
                this.state.featuredEvents.length?
                this.featured(this.state.featuredEvents):
                this.spinner()
                }
                <View style={{width:20}}></View>
              </ScrollView>
            </View>

            <Text style={styles.title}>Hot and New</Text>
            <View style={styles.featuredSections}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {
                this.state.hotAndNew.length?
                this.featured(this.state.hotAndNew):
                this.spinner()
                }
                <View style={{width:20}}></View>
              </ScrollView>
            </View>

            <Text style={styles.title}>Food Trucks</Text>
            <View style={styles.featuredSections}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {
                this.state.foodTrucks.length?
                this.featured(this.state.foodTrucks):
                this.spinner()
                }
                <View style={{width:20}}></View>
              </ScrollView>
            </View>
            
            <View style={{height:20}}></View>
          </ScrollView>
          </View>
          <TouchableOpacity style={styles.panel} onPress={()=>this.onYeat()}>
            <Text style={styles.yeatit}>Yeat it!</Text>
          </TouchableOpacity>

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
  img: {
    height: 200,
    width: 300,
  },
  display: {
    height:'100%',
    width:'100%',
    flex:8,
    backgroundColor: 'orange',
  },
  panel: {
    flex:1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    elevation: 5,
  },
  featuredSections: {
    alignSelf:'baseline',
    height:260,
    marginTop:10,
  },
  featuredItem: {
    marginLeft: 20,
    alignSelf:'baseline',
    borderRadius:10,
    overflow: 'hidden',
    width: 300,
  },
  featuredItemDetail: {
    backgroundColor:'white',
    paddingTop: 5,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    width:'100%',
    flex:1,
  },
  title: {
    marginLeft: 20,
    marginTop:20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  yeatit: {
    fontSize:25,
    color:'black',
    fontFamily: 'OleoScript-Regular'
  }
});