import { Page } from '@/stadiumDS/foundations/icons/General/Page';
import * as S from './FileIcon.styles';
import colors from '@/stadiumDS/foundations/colors';

const availableColors = [
    colors.Blue[600],
    colors.Yellow[600],
    colors.Purple[600],
    colors.Green[600],
    colors.Rose[600],
    colors.Cyan[600],
    colors.Orange[600],
    colors.Fuchsia[600],
    colors.BlueDark[600],
    colors.Pink[600],
    colors.Violet[600],
    colors.Teal[600],
    colors.GreenLight[600],
    colors.LightBlue[600],
];

const getFileTypeColor = (fileType: string) => {
    let total = 0;
    for (let i = 0; i < fileType.length; i++) {
        total += fileType.charCodeAt(i);
    }
    const index = total % availableColors.length;
    return availableColors[index];
};

interface FileIconProps {
    fileType: string;
    scale?: number;
    handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const FileIcon = ({
    fileType,
    scale = 1,
    handleClick,
}: FileIconProps) => {
    const color = getFileTypeColor(fileType);
    return (
        <S.Container
            $scale={scale}
            onClick={(e) => {
                handleClick?.(e);
            }}
        >
            <Page height={32} />
            <S.FileType $color={color}>{fileType.toUpperCase()}</S.FileType>
        </S.Container>
    );
};
