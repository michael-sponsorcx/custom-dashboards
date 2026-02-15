import React from 'react';
import colors from '../../colors';
import * as S from './HoverIcon.styles';

interface HoverIconProps {
    icon: JSX.Element;
    hoverColor?: string;
}

export const HoverIcon = ({
    icon,
    hoverColor = colors.Gray[500],
}: HoverIconProps) => {
    return (
        <S.HoverIconContainer $hoverColor={hoverColor}>
            {icon}
        </S.HoverIconContainer>
    );
};
