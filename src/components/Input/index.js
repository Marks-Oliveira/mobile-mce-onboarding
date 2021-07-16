import React from 'react';

import * as S from './styles';

const Input = ({ error = false, children, ...rest }) => {
  return (
    <S.Container isErrored={error}>
      <S.InputText {...rest} />
      {children}
    </S.Container>
  );
};

export default Input;
