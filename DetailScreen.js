import React from "react";
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Linking, Dimensions} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import axios from 'axios';
import SwiperFlatList from 'react-native-swiper-flatlist';

const config = {
  headers: {'Authorization': 'Bearer ***'},
};

export default class DetailScreen extends React.Component {

  state = {
    businessData:'',
    businessPhotos: '',
    businessReviews: '',
    businessDistance: '',
    businessLocation: '',
    bussinessCategories: ''
  };

  componentWillMount(){
  const { navigation } = this.props;
  const bus = navigation.getParam('busID', 'NO-ID');
  const dist = navigation.getParam('distance', 'NO-ID');
  const loca = navigation.getParam('location', 'NO-ID');
  const cata = navigation.getParam('categories', 'NOCATA')
  console.log(bus)
  console.log(dist)
  console.log(loca)
  console.log(cata)

  this.setState({
      businessDistance: dist,
      businessLocation: loca,
      bussinessCategories: cata
  })

  axios.get(`https://api.yelp.com/v3/businesses/${bus}`, config)
      .then(response => {
          this.setState({
              businessPhotos:response.data.photos,
              businessData:response.data
          })
          console.log(response.data)
      })
      .catch((err)=>{
          console.log(err)
      });

  axios.get(`https://api.yelp.com/v3/businesses/${bus}/reviews`, config)
      .then(response => {
          this.setState({businessReviews:response.data.reviews})
          console.log(response.data.reviews)
      })
      .catch((err)=>{
          console.log(err)
      });
  }

  displayReviews(){
      return Object.values(this.state.businessReviews).map(function(review, i){
          return(
              <View key={i} style={styles.reviews}>
                <View style={{flexDirection:'row',width:'100%'}}>
                    <View style={{flex:2,flexDirection:'row',justifyContent:'flex-start',width:'100%'}}><Text style={{marginTop:-3,color:'black'}}>{review.user.name}</Text></View>
                    <View style={styles.reviewRatings}><Text style={{width:'100%',paddingBottom:10}}>{
                        review.rating<1 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_0.png')}/> :
                        review.rating<1.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_1.png')}/> :
                        review.rating<2 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_1_half.png')}/> :
                        review.rating<2.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_2.png')}/> :
                        review.rating<3 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_2_half.png')}/> :
                        review.rating<3.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_3.png')}/> :
                        review.rating<4 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_3_half.png')}/> :
                        review.rating<4.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_4.png')}/> :
                        review.rating<5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_4_half.png')}/> :
                        <Image source={require('../assets/img/yelp_stars/web_and_ios/small/small_5.png')}/>
                    }</Text></View>
                </View>
                <View>
                <Text style={{color:'black',marginTop:-10}}>{"\n"}{review.text}</Text>
                </View>
              </View>
          );
      });
  }

  render() {

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{alignItems:'center',width:'100%'}}>

            <View style={styles.container}>
              <SwiperFlatList
                index={0}
                showPagination
                paginationStyle={{paddingBottom:5}}
              >
                <View style={[styles.child, { backgroundColor: 'white' }]}>
                <Image style={styles.img} source={{uri:this.state.businessPhotos[0]}}/>
                </View>
                <View style={[styles.child, { backgroundColor: 'white' }]}>
                <Image style={styles.img} source={{uri:this.state.businessPhotos[1]}}/>
                </View>
                <View style={[styles.child, { backgroundColor: 'white' }]}>
                <Image style={styles.img} source={{uri:this.state.businessPhotos[2]}}/>
                </View>

              </SwiperFlatList>
            </View>

                <View style={{flex:1,padding:15,width:'100%'}}>
                    <View style={{flexDirection:'row',width:'100%'}}>
                      <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start',color:'black'}}><Text style={{fontSize:25,fontWeight:'bold',marginTop:-2,color:'black'}}>{this.state.businessData.name}</Text></View>
                      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',color:'black'}}><Text style={{color:'black'}}>{(Math.round(this.state.businessDistance)/1000).toFixed(2)}km</Text></View>
                    </View>


                    <View style={{flexDirection:'row',width:'100%'}}>
                      <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start'}}><Text>
                      {
                          this.state.businessData.rating<1 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_0.png')}/> :
                          this.state.businessData.rating<1.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1.png')}/> :
                          this.state.businessData.rating<2 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1_half.png')}/> :
                          this.state.businessData.rating<2.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2.png')}/> :
                          this.state.businessData.rating<3 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2_half.png')}/> :
                          this.state.businessData.rating<3.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3.png')}/> :
                          this.state.businessData.rating<4 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3_half.png')}/> :
                          this.state.businessData.rating<4.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4.png')}/> :
                          this.state.businessData.rating<5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4_half.png')}/> :
                          <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_5.png')}/>
                      }<Text style={{color:'black'}}> {this.state.businessData.review_count} Reviews</Text>
                      </Text>
                      </View>
                      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}><Text style={{color:'black'}}>{this.state.businessData.price}</Text></View>

                    </View>

                    <View style={{flexDirection:'row',width:'100%'}}>
                        {Object.values(this.state.bussinessCategories).map(function(cata, i){
                            return(
                                <Text style={{color:'black'}} key={i}>{cata.title} </Text>
                            );
                        })}
                    </View>

                    <View style={{flexDirection:'column',width:'100%'}}>
                        {Object.values(this.state.businessLocation).map(function(loca, i){
                            return(
                                <Text style={{color:'black'}} key={i}>{loca} </Text>
                            );
                        })}
                    </View>
                    <View>
                        <Text style={{color:'black'}}>{this.state.businessData.phone}</Text>
                    </View>


                    <View style={{flexDirection:'row',width:'100%',marginTop:5}}>
                      <TouchableOpacity onPress={()=>Linking.openURL(this.state.businessData.url)} style={{flex:1,flexDirection:'row',justifyContent:'center',paddingTop:5,paddingBottom:10,borderRadius:5,width:'100%',height:'100%'}}>

                      <View style={{flexDirection:'row',width:'100%',height:'100%'}}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',width:'100%',height:'100%',backgroundColor:'#BF4541',borderTopLeftRadius:5,borderBottomLeftRadius:5,padding:5}}>
                        <Image
                         source={require('../assets/img/Yelp_trademark_RGB.png')}
                         style={{width:80,height:40,marginTop:-2}}
                        /></View>
                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',width:'100%',height:'100%',backgroundColor:'#E9544F',borderTopRightRadius:5,borderBottomRightRadius:5,padding:5}}><Text style={{color:'white',fontWeight:'bold'}}>Visit Site</Text></View>
                      </View>

                      </TouchableOpacity>
                    </View>

                    {this.displayReviews()}
                </View>
            </ScrollView>
        </View>
    );
  }
}
export const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  wrapper: {
      height:300
  },
  img: {
    height: '100%',
    width: '100%'
  },
  slide: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  reviews: {
    borderColor:'lightgrey',
    borderTopWidth:1,
    padding:10,
  },
  reviewRatings: {
    flex:0.8,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    width:'100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  child: {
    height: height * 0.5,
    width,
    justifyContent: 'center'
  },
  text: {
    fontSize: width * 0.5,
    textAlign: 'center'
  }
})
