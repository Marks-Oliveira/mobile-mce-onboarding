import React from 'react';

import * as S from './styles';

const Button = ({ children, ...rest }) => {
   return (
      <S.Container {...rest}>
         <S.ButtonText>{children}</S.ButtonText>
      </S.Container>
   );
};

export default Button;
