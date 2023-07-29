import { StyleSheet } from "react-native";
import { colors } from "../../constants";
export default StyleSheet.create({
  map:{
    height:100,
    alignSelf:'stretch',
    marginVertical:20

  },
  row:{
    alignSelf:'stretch',
    flexDirection:'row',
    justifyContent:'center'
  },
  cell:{
    flex:1,
    aspectRatio:1,
    borderWidth:2,
    borderColor:colors.darkgrey,
    margin:3,
    maxWidth:70,
    justifyContent:'center',
    alignItems:'center'
  },
  cellText:{
    color:colors.lightgrey,
    fontWeight:'bold',
    fontSize:28,

  }
});


