import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

import * as S from './styles';
import { colors } from '../../styles/colors';
import developerImage from '../../assets/developer-activity.png';

const Home = () => {
   const navigation = useNavigation();
   const { token, user, setUser, signOut } = useAuth();
   
   useEffect(() => {
      const config = {
         headers: {
            Authorization: token
         }
      };

      api.get("user/getUser", config)
         .then((response) => {
            setUser(response.data.user);
         })
         .catch(() => {
            Toast.show({
               type: "error",
               text1: "Erro",
               text2: "Não foi possivel buscar usuário",
           });
         })
   }, []);

   const handleLogout = async() => {
      try {
         await signOut();

         navigation.reset({ routes: [{ name: "Login" }] });
      } catch (error) {
         Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Não foi possivel deslogar do app",
        });
      }
   };

   return (
      <S.Container>
         <S.Header>
            <S.LogoutButton onPress={handleLogout}>
               <S.LogoutButtonText>Logout</S.LogoutButtonText>

               <Ionicons name="md-arrow-back" color={colors.blue500} size={25} />
            </S.LogoutButton>
         </S.Header>

         <S.ProfileContent>
            <S.ProfileContentImage source={developerImage} />

            <S.ProfileUserContent>
               <S.UserWelcomeText>
                  Bem vindo(a), {" "}
                  <S.UserWelcomeSpanText>
                     {user?.name.split(" ")[0]}
                  </S.UserWelcomeSpanText>
               </S.UserWelcomeText>

               <S.UserEmail>{user?.email}</S.UserEmail>

               <S.EditProfileButton onPress={() => navigation.navigate("EditProfile")}>
                  <S.EditProfileButtonText>Editar perfil</S.EditProfileButtonText>
               </S.EditProfileButton>
            </S.ProfileUserContent>
         </S.ProfileContent>
      </S.Container>
   );
};

export default Home;
