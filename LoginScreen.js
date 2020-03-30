import React from "react";
import {Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, ActivityIndicator} from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';

export default class LoginScreen extends React.Component {

    state = {
        isAuthenticated : false,
        userEmail:'',
        userPassword:'',
        user:null,
        message:'',
        isSpinning:false,
        isError:false
    }

    static navigationOptions = {
    header: null
    }

    componentWillMount(){
        const firebaseConfig = {
            apiKey: "***",
            authDomain: "***",
            databaseURL: "***",
            projectId: "***",
            storageBucket: "***",
            messagingSenderId: "***"
        };

        firebase.initializeApp(firebaseConfig);
    }

  // onRegister = () =>{
  //     firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
  //         .then((user)=>{
  //             this.setState({
  //                 user:user,
  //                 message:'Registration Success, Try Logging in Now'
  //             });
  //             console.log('Registration Success');
  //             console.log(user);
  //             alert('Registration Success\nTry Logging in Now');
  //         }).catch((err)=>{
  //             console.log('Registration Failed');
  //             console.log(err.code);
  //             alert(`Registration Failed\n${err.message}`);
  //         })
  // }

  // onLogin = () =>{
  //     this.setState({isSpinning:true});
  //     firebase.auth().signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword)
  //         .then((user)=>{
  //             this.setState({
  //                 user:user,
  //                 message:'Login Success',
  //                 isSpinning:false,
  //                 isAuthenticated:true
  //             });
  //             console.log('Sign In Success');
  //             console.log(user);
  //             setTimeout(()=>{this.props.navigation.navigate('Home')},1000);
  //         }).catch((err)=>{
  //             console.log('Sign In Failed');
  //             this.setState({isSpinning:false,isError:true});
  //             console.log(err);
  //             alert(`Sign In Failed\n${err.message}`);
  //         })
  // }

  // onAnonymousLogin = () => {
  //     this.setState({isSpinning:true});
  //     firebase.auth().signInAnonymously()
  //         .then(()=>{
  //             console.log('success');
  //             this.setState({
  //                 isAuthenticated:true,
  //                 message:'Guest Login Success',
  //                 isSpinning:false
  //             });
  //             setTimeout(()=>{this.props.navigation.navigate('Home')},1000);
  //         })
  //         .catch((error)=>{
  //             console.log(error);
  //             this.setState({isSpinning:false,isError:true});
  //             alert(`Sign In Failed\n${err.message}`);
  //         })
  // }

  getStarted = () => {
    this.setState({isSpinning:true});
    setTimeout(()=>{this.props.navigation.navigate('Home')},1000);
    setTimeout(()=>{
      this.setState({
        isAuthenticated:true,
        isSpinning:false
      });
    },1000);
  }

  render() {
    return (
      <ImageBackground source={require('../assets/img/loginBackground.jpg')} style={styles.container}>
          <View style={styles.loginTitle}>
              <Text style={styles.title}>
                Yeat
              </Text>
          </View>
          <View style={styles.loginBox}>
              <TouchableOpacity style={styles.anonymousButton} onPress={()=>this.getStarted()}>
                  <Icon style={{paddingRight:10, color:'lightgrey'}} name="sign-in" size={20} />
                  <Text style={{color:'white', fontWeight:'bold'}}>
                  Get Started</Text>
              </TouchableOpacity>
              <View>
              {
                (this.state.isSpinning && <ActivityIndicator animating={true} size="large" color="white" />)
              }
              {this.state.isAuthenticated && !this.state.isSpinning ? <Icon style={{position:'absolute',marginLeft:-15}} name="check" size={30} color="green" /> : <Text></Text>}
              {this.state.isError && !this.state.isAuthenticated && !this.state.isSpinning ? <Icon style={{position:'absolute'}} name="close" size={30} color="red" /> : <Text></Text>}
              </View>
          </View>
      </ImageBackground>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  inputForm: {
    height: 40,
    width:'75%',
    backgroundColor:'white'
  },
  loginBox: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width:250,
    marginTop:50
  },
  title: {
    color: '#ffffff',
    fontSize: 60,
    fontFamily: 'OleoScript-Regular',
    paddingTop:50
  },
  loginTitle: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputWrapper: {
    width:250,
    margin:5,
    borderRadius:20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft:5,
  },
  registerButton: {
    width:'48%',
    height:40,
    backgroundColor:'#E9544F',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    borderRadius:20,
    elevation:5,
    shadowColor: 'rgba(0,0,0, .25)',
    shadowOffset: { height: 4, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  loginButton: {
    width:'48%',
    height:40,
    backgroundColor:'#3A589A',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    borderRadius:20,
    elevation:5,
    shadowColor: 'rgba(0,0,0, .25)',
    shadowOffset: { height: 4, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  anonymousButton: {
    width:'100%',
    height:50,
    backgroundColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    borderRadius:50,
    marginTop:10,
    marginBottom:10,
    flexDirection:'row',
    elevation:5,
    shadowColor: 'rgba(0,0,0, .25)',
    shadowOffset: { height: 4, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  }
});
