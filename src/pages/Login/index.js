import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

import * as S from './styles';

const Login = () => {
   const [emailOrCpf, setEmailOrCpf] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [validationErrors, setValidationErrors] = useState({});
   const navigation = useNavigation();
   const { signIn } = useAuth();

   const handleSignIn = async () => {
      try {
         setValidationErrors({});

         const schema = Yup.object().shape({
            emailOrCpf: Yup.string().required("Email ou CPF obrigatório"),
            password: Yup.string().required("Senha obrigatória"),
         });

         let data = { emailOrCpf, password };

         await schema.validate(data, { abortEarly: false });

         await signIn(data);
         
         navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      } catch (err) {
         if (err instanceof Yup.ValidationError) {
            err.inner.forEach((error) => {
               setValidationErrors((state) => {
                  return {
                     ...state,
                     [error.path || ""]: error.message,
                  };
               });
            });

            return Toast.show({
               type: "error",
               text1: "Erro",
               text2: err.inner[0].message,
            });
         }   

         Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possível entrar na sua conta.",
         });
      }
   };

   return (
      <ScrollView>
         <S.Container>
            <S.Title>Entrar</S.Title>
            <S.SubTitle>O seu passaporte para o futuro</S.SubTitle>

            <Input
               placeholder="E-mail ou CPF"
               selectTextOnFocus
               textContentType="name"
               error={!!validationErrors["emailOrCpf"]}
               value={emailOrCpf}
               onChangeText={(text) => setEmailOrCpf(text)}
            />
            <Input
               placeholder="Senha"
               textContentType="password"
               selectTextOnFocus
               secureTextEntry={!showPassword}
               error={!!validationErrors["password"]}
               value={password}
               onChangeText={(text) => setPassword(text)}
            >
               <TouchableWithoutFeedback
                  onPress={() => setShowPassword((state) => !state)}
               >
                  {showPassword ? (
                     <Ionicons name="eye" color="rgba(3, 1, 76, 0.2)" size={24} />
                  ) : (
                     <Ionicons name="eye-off" color="rgba(3, 1, 76, 0.2)" size={24} />
                  )}
               </TouchableWithoutFeedback>
            </Input>

            <Button onPress={handleSignIn}>Login</Button>

            <S.ParagraphText>
               Esqueceu a senha?{" "}
               <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("ForgotPassword")}
               >
                  <S.ParagraphLinkText>Clique aqui</S.ParagraphLinkText>
               </TouchableWithoutFeedback>
            </S.ParagraphText>

            <S.ParagraphText>
               Não possui uma conta?{" "}
               <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("Register")}
               >
                  <S.ParagraphLinkText>Registrar-se</S.ParagraphLinkText>
               </TouchableWithoutFeedback>
            </S.ParagraphText>
         </S.Container>
      </ScrollView>
   );
};

export default Login;
