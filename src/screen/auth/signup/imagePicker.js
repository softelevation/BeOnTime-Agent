import React, {useState} from 'react';
import {FlatList,View,TouchableOpacity,Image} from 'react-native';
import {Block, Button, CustomButton, Text} from '../../../components';
import {t1, t3, w5} from '../../../components/theme/fontsize';
export const IMAGENAME = require('../../../assets/icons/ProfileS.png'); 


const ImagePicker = ({state, setValues, closeModal,uploadImage,renderGallaryImage}) => {
    return(
        <View style={{flex:1,height:400,flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity onPress={()=>uploadImage('gallary')} style={{height:50,borderWidth:0.5,borderColor:"#fff",backgroundColor:"#000",width:'70%',alignItems:"center",justifyContent:"center",borderRadius:50,}}>
         <Text style={{color:"#fff"}}>Gallary</Text></TouchableOpacity>
         
         <TouchableOpacity  onPress={()=>uploadImage('camera')} style={{height:50,borderWidth:0.5,borderColor:"#fff",backgroundColor:"#000",width:'70%',alignItems:"center",justifyContent:"center",borderRadius:50,}}>
         <Text style={{color:"#fff"}}>Camera</Text></TouchableOpacity>
         <View style={{height:200,backgroundColor:"transparent",width:200,alignItems:"center",justifyContent:"center"}}>
       {renderGallaryImage()}
     

         </View>
        </View>
    )
}
export default ImagePicker;
