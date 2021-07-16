import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import { validateCPF } from 'validations-br';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input'

import * as S from './styles';
import { Keyboard } from 'react-native';

const EditProfile = () => {
    const { user, token, updateUserData } = useAuth();
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [cpf, setCpf] = useState(user?.cpf);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigation = useNavigation();

    const handleUpdateUser = async () => {
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
                password: Yup.string().notRequired().min(6, "A senha deve ter pelo menos 6 caracteres"),
                confirmPassword: Yup.string()
                    .when("password", {
                        is: (value) => !!value.length,
                        then: Yup.string().required("Confirmação da senha é obrigatória"),
                        otherwise: Yup.string(),
                    })
                    .oneOf(
                        [Yup.ref("password"), undefined],
                        "As senhas precisam ser iguais"
                    ),
            });
    
            let data = { email, name, cpf, password, confirmPassword };
    
            await schema.validate(data, { abortEarly: false });
    
            if (password === "") data = { email, name, cpf };
            else data = { email, name, cpf, password };

            const config = {
                headers: {
                   Authorization: token
                }
            };
    
            await api.put(`user/update/${user?.id}`, data, config);
        
            Toast.show({
                type:"success",
                text1: "Sucesso",
                text2: "Perfil atualizado",
            });
    
            Keyboard.dismiss();
            setPassword("");
            setConfirmPassword("");
    
            updateUserData(user?.id);
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
            text2: "Não foi possível atualizar o perfil",
            });
        }
    };

  return (
    <ScrollView>
        <S.Container>
            <S.Title>Editar perfil</S.Title>

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
                placeholder="*** (Trocar a senha?)"
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
                placeholder="Confirme a nova senha"
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

            <Button onPress={handleUpdateUser}>Salvar</Button>  

           
            <TouchableWithoutFeedback 
                onPress={() => navigation.goBack()}
            >
                <S.BackButtonText>Voltar</S.BackButtonText>
            </TouchableWithoutFeedback>

        </S.Container>
    </ScrollView>
  );
};

export default EditProfile;
