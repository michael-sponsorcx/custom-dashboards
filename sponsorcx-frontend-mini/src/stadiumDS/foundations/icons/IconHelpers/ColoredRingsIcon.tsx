import * as S from './ColoredRingsIcon.styles';

interface ColoredRingsIconProps {
    innerColor: string;
    outerColor: string;
    icon: JSX.Element;
}

export const ColoredRingsIcon = ({
    innerColor,
    outerColor,
    icon,
}: ColoredRingsIconProps) => {
    return (
        <S.Ring $size={56} $color={outerColor}>
            <S.Ring $size={40} $color={innerColor}>
                {icon}
            </S.Ring>
        </S.Ring>
    );
};
