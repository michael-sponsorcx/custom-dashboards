import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const Container = styled.div<{ $scale: number }>`
    position: relative;
    scale: ${({ $scale }) => $scale};
`;

export const FileType = styled.div<{ $color: string }>`
    position: absolute;
    bottom: 10px;
    left: -6px;
    background-color: ${({ $color }) => $color};
    color: ${colors.Base.White};
    padding: 2px 3px;
    border-radius: 2px;
    font-size: 8px;
    font-weight: 700;
    line-height: 10px;
`;
