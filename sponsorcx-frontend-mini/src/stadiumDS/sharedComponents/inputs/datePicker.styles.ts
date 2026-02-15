import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const DateText = styled.div<{ $color?: string; $weight?: string }>`
    font-size: 12px;
    line-height: 18px;
    font-weight: ${({ $weight }) => $weight || 400};
    color: ${({ $color }) => $color || colors.Gray[600]};
    font-family: Inter;
    cursor: pointer;
`;
