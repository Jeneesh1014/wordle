import { StyleSheet, Text, View,ScrollView,Alert, ActivityIndicator} from 'react-native';
import { CLEAR, ENTER, colors, colorsToEmoji } from '../../constants';
import Keyboard from '../Keyboard/Keyboard';
import React , {useState,useEffect} from 'react';
import * as Clipboard from 'expo-clipboard';
import words from '../../words';
import styles from './Game.styles'
import { copyArray , getDayOfTheYear ,getDayKey} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EndScreen from '../endScreen/EndScreen';

const NUMBER_OF_TRIES = 6;

const dayOfTheYear = getDayOfTheYear();


const game = {
  // day_15:{
  //   rows:[[],[]],
  //   curRow:4,
  //   curCol:2,
  //   gameState:'won', 
  // },
  // day_16:{
  //   rows:[[],[]],
  //   curRow:4,
  //   curCol:2,
  //   gameState:'won', 
  // }
  
}

export default function Game() {


  const dayKey = getDayKey();

  const word = words[dayOfTheYear];
  const letters = word.split("");

  const [rows,setRows] = useState(new Array(NUMBER_OF_TRIES).fill(
    new Array(letters.length).fill("")
  ))
  
  const [curRow , setCurRow] = useState(0);
  const [curCol , setCurCol] = useState(0);
  const [gameState,setGameState] =useState('playing');
  const [loaded,setLoaded] = useState(false);

  useEffect(()=>{
    if(curRow>0){
      checkGameState();
    }
  },[curRow])

  useEffect(()=>{
    if(loaded){
      persistState();
    }
  },[rows,curRow,curCol,gameState])


  useEffect(()=>{
    readState();
  },[])

  const persistState = async () =>{

    const dataForToday = {
      rows,
      curRow,
      curCol,
      gameState
    };

    try{
      const existingStateString = await AsyncStorage.getItem('@game');
      const existingState = existingStateString 
      ? JSON.parse(existingStateString)
      : {};
     
      existingState[dayKey]=dataForToday;

      const dataString = JSON.stringify(existingState);
      await AsyncStorage.setItem('@game',dataString);
    }catch(e){
      console.log("you got error to fix");
    }

  }
  const readState = async ()=>{
    const dataString = await AsyncStorage.getItem('@game');
    try{
      const data  = JSON.parse(dataString);
      const day = data[dayKey]
      setRows(day.rows);
      setCurCol(day.curCol);
      setCurRow(day.curRow);
      setGameState(day.gameState);
    }catch(e){
      console.log("Couldn't parse the state");
    }
    setLoaded(true)
  }

  const checkGameState = ()=>{
    if(checkIfWon() && gameState!=='won'){
      Alert.alert("Huraaay" , "You Won!",[{text:'Share',onPress:sharescore}])
      setGameState('Won')
    }else if(checkIfLost() && gameState!=='lost'){
      Alert.alert("Heh","Try again tomorrow!");
      setGameState('lost')
    }
  }
  const sharescore = ()=>{
    const textShare = rows.map((row , i )=>row.map((cell,j)=>colorsToEmoji[getCellBGColor(i,j)]).join(""))
    .filter((row)=>row)
    .join("\n");
    Clipboard.setString(textShare);
    Alert.alert("Copied Successfully","Share your score on your social media");
  }

  const checkIfWon = () =>{
    const row=rows[curRow-1];

    return row.every((letter,i)=>letter===letters[i]);
  }
  const checkIfLost = () =>{
     return !checkIfLost && curRow===rows.length;
  }

  const onKeyPressed = (key)=>{
    if(gameState!=="playing") return;
    const updatedRows = copyArray(rows);

    if(key===CLEAR){
      const prevCol = curCol-1;
      if(prevCol >= 0){
        updatedRows[curRow][prevCol]="";
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }
    if(key==ENTER){
      if(curCol===rows[0].length){
        setCurRow(curRow+1);
      setCurCol(0);
      }
      
      return;
    }
    if(curCol< rows[0].length){
        updatedRows[curRow][curCol] = key;
        setRows(updatedRows);
        setCurCol(curCol+1);
    }
    
  }


  const isCellActive = (row,col)=>{
    return row ===curRow && col ===curCol;
  }

  const getCellBGColor = (row , col )=>{
    const letter = rows[row][col];
    if(row>= curRow){
      return colors.black;
    }
    if(letter=== letters[col]){
      return colors.primary;
    }
    if(letters.includes(letter)){
      return colors.secondary;
    }
    return colors.darkgrey;
  }


  const getAlllettersWithColor = (color)=>{
    return rows.flatMap((row,i)=>row.filter((cell,j)=>getCellBGColor(i,j)===color))
  }
  const greenCaps = getAlllettersWithColor(colors.primary);
  const yellowCaps = getAlllettersWithColor(colors.secondary);
  const greyCaps = getAlllettersWithColor(colors.darkgrey);


  if(!loaded){
    return (<ActivityIndicator />)
  }

  if(gameState!=='playing'){
    return (<EndScreen won={gameState!=='won'} />)
  }
  return (
    <>
      <ScrollView style={styles.map} >
        {rows.map((row,rowIndex)=>(
           <View style={styles.row} key={rowIndex}>
           {row.map((cell,colIndex)=>( 
             <View 
             key={colIndex}
             style={[styles.cell,
             {borderColor:isCellActive(rowIndex,colIndex)
              ? colors.lightgrey
              : colors.darkgrey,
              backgroundColor:getCellBGColor(rowIndex , colIndex),
            
            }]} 
              >
              <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
           ))}
         </View>
        ))}
       
      </ScrollView>
      <Keyboard 
      onKeyPressed={onKeyPressed}
      greenCaps={greenCaps}
      yellowCaps={yellowCaps}
      greyCaps={greyCaps}
      />
      </>
  );
}

