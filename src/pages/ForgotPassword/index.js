import React, { useState } from 'react';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';

import Button from '../../components/Button';
import Input from '../../components/Input';

import * as S from './styles';

const ForgotPassword = () => {
   const [email, setEmail] = useState("");

   const navigation = useNavigation();

   return (
      <ScrollView>
         <S.Container>
            <S.Title>Esqueci minha senha</S.Title>

            <Input
               placeholder="E-mail"
               keyboardType="email-address"
               selectTextOnFocus
               textContentType="emailAddress"
               autoCapitalize="none"
               autoCompleteType="email"
               value={email}
               onChangeText={(text) => setEmail(text)}
            />

            <Button>Enviar</Button>

            <S.ParagraphText>
               Já possui uma conta?{" "}
               <TouchableWithoutFeedback 
                  onPress={() => navigation.goBack()}
               >
                  <S.ParagraphLinkText>Entrar</S.ParagraphLinkText>
               </TouchableWithoutFeedback>
            </S.ParagraphText>
         </S.Container>
      </ScrollView>
   );
};

export default ForgotPassword;
