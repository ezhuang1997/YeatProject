import React from "react";
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Easing, Image} from 'react-native';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SwipeScreen extends React.Component {

    state = {
        list : [],
        approved : [],
        passed: [],
        xValue : new Animated.Value(0),
        marginValue: new Animated.Value(6),
        prevCard : [],
        disabledButton: false,
        roomCode: '',
        userId: '',
        bussinessId: ''
    };

    static navigationOptions = {
    headerLeft: null
    }

    componentWillMount(){
        const { navigation } = this.props;
        const roomId = navigation.getParam('roomCode', 'NO-CODE');
        console.log(roomId);
        this.setState({roomCode: roomId});

        var roomRef = firebase.database().ref('rooms/' + roomId).once('value', (snapshot)=>{
            this.setState({list: snapshot.val().restaurants});
            console.log(this.state.list);
        });

    }


    slideRightAnimation() {

        this.setState({disabledButton:true});

        Animated.timing(this.state.xValue,{
            toValue:800,
            duration:1000,
            easing: Easing.linear
        }).start();

        Animated.timing(this.state.marginValue,{
            toValue:0,
            duration:500,
            easing: Easing.linear
        }).start();

        setTimeout(()=>{
        this.setState({
            xValue:new Animated.Value(0),
            marginValue:new Animated.Value(6),
            approved: [...this.state.approved, this.state.list[this.state.list.length-1]],
            disabledButton:false
        })

        var tempArr = this.state.list;
        tempArr.splice(tempArr.length-1, 1);
        this.setState({list:tempArr})

        if(!this.state.list.length){

            if(this.state.approved.length){
                firebase.database().ref('rooms/' + this.state.roomCode + '/approved/').push({
                  restaurants: this.state.approved
                });
            }else{
                firebase.database().ref('rooms/' + this.state.roomCode + '/approved/').push({
                  restaurants: 'nothing'
                });
            }

            this.props.navigation.navigate('Result',{approved: this.state.approved, roomCode: this.state.roomCode});
        }

        },1000);
    }

    slideLeftAnimation() {

        this.setState({disabledButton:true});

        Animated.timing(this.state.xValue,{
            toValue:-800,
            duration:1000,
            easing: Easing.linear
        }).start();

        Animated.timing(this.state.marginValue,{
            toValue:0,
            duration:500,
            easing: Easing.linear
        }).start();

        setTimeout(()=>{
        this.setState({
            xValue:new Animated.Value(0),
            marginValue:new Animated.Value(6),
            passed: [...this.state.passed, this.state.list[this.state.list.length-1]],
            disabledButton:false
        })

        var tempArr = this.state.list;
        tempArr.splice(tempArr.length-1, 1);
        this.setState({list:tempArr});

        if(!this.state.list.length){

            if(this.state.approved.length){
                firebase.database().ref('rooms/' + this.state.roomCode + '/approved/').push({
                  restaurants: this.state.approved
                });
            }else{
                firebase.database().ref('rooms/' + this.state.roomCode + '/approved/').push({
                  restaurants: 'nothing'
                });
            }

            this.props.navigation.navigate('Result',{approved: this.state.approved, roomCode: this.state.roomCode});
        }

        },1000);
    }

    topCard(){
        var xPos = this.state.xValue;
        return {
            height: '100%',
            width: '100%',
            left:xPos,
            justifyContent: 'center',
            alignItems: 'center',
            position:'absolute',
            borderRadius:20,
            overflow:'hidden',
            borderColor: 'lightgrey',
            borderWidth:0.5,
            marginTop:0,
        }
    }

    prevCards(){
        var slowMargin = this.state.marginValue;
        return {
            height: '100%',
            width: '100%',
            left:0,
            justifyContent: 'center',
            alignItems: 'center',
            position:'absolute',
            borderRadius:20,
            overflow:'hidden',
            borderColor: 'lightgrey',
            borderWidth:0.5,
            marginTop: slowMargin,
        }
    }

    displayNone(){
        return {
            height: '100%',
            width: '100%',
            left:0,
            justifyContent: 'center',
            alignItems: 'center',
            position:'absolute',
            borderRadius:20,
            overflow:'hidden',
            display:'none'
        }
    }

    listRestaurants() {
      var top = this.topCard();
      var prev = this.prevCards();
      var displayNone = this.displayNone();
      var index = this.state.list.length-1;

      return this.state.list.map(function(restaurant, i){
        return(
            <Animated.View key={i} style={index==i ? top : i>=(index-2) ? prev : displayNone}>
              <View style={styles.swipeImage}>
                  <Image
                   source={{ uri: restaurant.image_url }}
                   style={styles.img}
                  />
                  <Image
                   source={require('../assets/img/Yelp_trademark_RGB.png')}
                   style={{position:'absolute',width:80,height:40,marginTop:5}}
                  />
              </View>
              <View style={styles.swipeDesc}>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:3,flexDirection:'row',justifyContent:'flex-start'}}><Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>{restaurant.name}</Text></View>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}><Text style={{color:'black'}}>{(Math.round(restaurant.distance)/1000).toFixed(2)}km</Text></View>
                </View>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>{
                      restaurant.rating<1 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_0.png')}/> :
                      restaurant.rating<1.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1.png')}/> :
                      restaurant.rating<2 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_1_half.png')}/> :
                      restaurant.rating<2.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2.png')}/> :
                      restaurant.rating<3 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_2_half.png')}/> :
                      restaurant.rating<3.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3.png')}/> :
                      restaurant.rating<4 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_3_half.png')}/> :
                      restaurant.rating<4.5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4.png')}/> :
                      restaurant.rating<5 ? <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_4_half.png')}/> :
                      <Image source={require('../assets/img/yelp_stars/web_and_ios/regular/regular_5.png')}/>
                  }<Text style={{color:'black'}}> {restaurant.review_count} Reviews</Text></View>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}><Text style={{color:'black'}}>{restaurant.price}</Text></View>
                </View>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}><Text style={{color:'black'}}>{restaurant.categories.map(function(category,i){return(<Text style={{color:'black'}} key={i}>{category.title} </Text>)})}</Text></View>
                </View>
              </View>
            </Animated.View>
        );
      });
    }

    listResults(){
        if(!this.state.list.length){
            console.log("Approved: ");
            console.log(this.state.approved);
            console.log("Passed: ");
            console.log(this.state.passed);
        }
    }

    render(){

        return(
            <View style={styles.container}>
                <View style={styles.swipeSection}>
                    <TouchableOpacity disabled={this.state.disabledButton}
                    onPress={()=>{
                        console.log(this.state.list[this.state.list.length-1].id);
                        this.props.navigation.navigate('Detail',{
                            busID:this.state.list[this.state.list.length-1].id,
                            distance:this.state.list[this.state.list.length-1].distance,
                            location:this.state.list[this.state.list.length-1].location.display_address,
                            categories:this.state.list[this.state.list.length-1].categories
                        });
                    }}
                    style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <View style={styles.swipeAbsolute}>

                        {this.listRestaurants()}
                        {this.state.list.length<=0 ? this.listResults() : null}

                    </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.decisionPanel}>
                    <View style={styles.leftPanel}>
                        <TouchableOpacity disabled={this.state.disabledButton} style={styles.leftButton} onPress={()=>this.slideLeftAnimation()}>
                            <View>
                                <Icon style={{paddingLeft:3,paddingRight:3}} name="close" size={30} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightPanel}>
                        <TouchableOpacity disabled={this.state.disabledButton} style={styles.rightButton} onPress={()=>this.slideRightAnimation()}>
                            <View>
                                <Icon style={{}} name="check" size={30} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
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
  swipeSection: {
    height:'100%',
    width:'100%',
    flex:8,
    justifyContent:'center',
    alignItems:'center',
  },
  swipeAbsolute:{
    height:'95%',
    width:'90%',
  },
  decisionPanel: {
    flex:1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPanel: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:10,
    paddingRight:50
  },
  leftPanel: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:10,
    paddingLeft:50
  },
  rightButton:{
    backgroundColor:'orange',
    padding: Platform.OS === 'android' ? 15 : 20,
    borderRadius:50,
    shadowColor: 'rgba(0,0,0, .25)',
    shadowOffset: { height: 4, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation:5,
  },
  leftButton: {
    backgroundColor:'red',
    padding: Platform.OS === 'android' ? 15 : 20,
    borderRadius:50,
    shadowColor: 'rgba(0,0,0, .25)',
    shadowOffset: { height: 4, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation:5,
  },
  swipeImage: {
    flex:4,
    height: '100%',
    width: '100%',
  },
  swipeDesc :{
    flex:1,
    backgroundColor:'white',
    height: '100%',
    width: '100%',
    padding: 15
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
