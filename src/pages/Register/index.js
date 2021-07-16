import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import { validateCPF } from 'validations-br';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import api from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';

import * as S from './styles';

const Register = () => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [cpf, setCpf] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [validationErrors, setValidationErrors] = useState({});

   const navigation = useNavigation();

   const handleSaveRegister = async () => {
      try {
         setValidationErrors({});

         const schema = Yup.object().shape({
            email: Yup.string()
               .required("Email obrigatório")
               .email("O email precisa ser válido"),
            name: Yup.string()
            .required("Nome obrigatório")
            .min(3, "Nome muito curto"),
            cpf: Yup.string()
               .required("CPF obrigatório")
               .test("isCpf", "CPF inválido", (value) => validateCPF(String(value))),
            password: Yup.string()
               .required("Senha obrigatória")
               .min(6, "A senha precisa no mínimo ter 6 caracteres"),
            confirmPassword: Yup.string().oneOf(
               [Yup.ref("password"), null],
               "As senhas precisam ser iguais"
            ),
         });

         let data = { email, name, cpf, password, confirmPassword };
         await schema.validate(data, { abortEarly: false });

         let parameters = { email, name, cpf, password }
         await api.post("/user/signup", parameters);

         Toast.show({
            type: "success",
            text1: "Sucesso",
            text2: "Cadastro realizado com sucesso!"
         });

         navigation.goBack();
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
            text2: "Não foi possível realizar o cadastro, tente novamente",
         });
      }
   };

   return (
      <ScrollView>
         <S.Container>
            <S.Title>Cadastre-se</S.Title>

            <Input
               placeholder="E-mail"
               keyboardType="email-address"
               selectTextOnFocus
               textContentType="emailAddress"
               autoCapitalize="none"
               autoCompleteType="email"
               error={!!validationErrors["email"]}
               value={email}
               onChangeText={(text) => setEmail(text)}
            />

            <Input
               placeholder="Nome"
               selectTextOnFocus
               textContentType="name"
               autoCapitalize="words"
               autoCompleteType="name"
               error={!!validationErrors["name"]}
               value={name}
               onChangeText={(text) => setName(text)}
            />

            <Input
               placeholder="CPF"
               keyboardType="numeric"
               selectTextOnFocus
               autoCapitalize="none"
               error={!!validationErrors["cpf"]}
               value={cpf}
               onChangeText={(text) => setCpf(text)}
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

            <Input
               placeholder="Confirmar senha"
               textContentType="password"
               selectTextOnFocus
               secureTextEntry={!showConfirmPassword}
               error={!!validationErrors["confirmPassword"]}
               value={confirmPassword}
               onChangeText={(text) => setConfirmPassword(text)}
            >
               <TouchableWithoutFeedback
                  onPress={() => setShowConfirmPassword((state) => !state)}
               >
                  {showConfirmPassword ? (
                     <Ionicons name="eye" color="rgba(3, 1, 76, 0.2)" size={24} />
                  ) : (
                     <Ionicons name="eye-off" color="rgba(3, 1, 76, 0.2)" size={24} />
                  )}
               </TouchableWithoutFeedback>
            </Input>

            <Button onPress={handleSaveRegister}>Cadastrar</Button>

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

export default Register;
