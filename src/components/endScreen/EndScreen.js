import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../../constants'


const Number = ({number,label})=>(
  <View style={{alignItems:'center',margin:10}}>
    <Text style={{color:colors.lightgrey,fontSize:40,fontWeight:'bold'}}>{number}</Text>
    <Text style={{color:colors.lightgrey,fontSize:14}}>{label}</Text>
  </View>
)

const GuessDistrubutionLine = ({position , amount})=>{
  return(
    <View style={{flexDirection:'row',alignItems:'center'}}>
      <Text style={{color:colors.lightgrey}}>{position}</Text>
      <View style={{width:'100%',backgroundColor:colors.grey,margin:5,padding:5}}>
        <Text style={{color:colors.lightgrey}}>{amount}</Text>
      </View>
    </View>
  )
}

export default function EndScreen({won=false}) {
  return (
    <View>
      <Text style={styles.title}>{won ? "Congrates" : "Heh , try again tomrrow"}</Text>
      <Text style={styles.subTitle} >
        Statistics
      </Text>
      <View style={{flexDirection:'row'}}>
        <Number number={2} label={"Played"}/>
        <Number number={2} label={"Win %"}/>
        <Number number={2} label={"Cur Streak"}/>
        <Number number={2} label={"Max Streak"}/>
      </View>
      <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>
      <GuessDistrubutionLine position={0} amount={2}/>
    </View>
  )
}

const styles = StyleSheet.create({
  title:{
    fontSize:30,
    color:'white',
    textAlign:'center',
    marginVertical:20,
  },
  subTitle:{
    fontSize:20,
    color:colors.lightgrey,
    textAlign:'center',
    marginVertical:15,
    fontWeight:'bold'
  }
})