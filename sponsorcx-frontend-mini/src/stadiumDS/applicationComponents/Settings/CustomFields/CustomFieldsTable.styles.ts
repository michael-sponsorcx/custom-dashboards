import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const OptionContainer = styled.div<{ $maxWidth: number }>`
    display: flex;
    padding: 2px 6px;
    border-radius: 6px;
    background-color: ${colors.Base.White};
    border: 1px solid ${colors.Gray[300]};
    color: ${colors.Gray[700]};
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: ${({ $maxWidth }) => $maxWidth}px;
`;

export const RemainingOptionsContainer = styled.div`
    display: flex;
    padding: 2px 8px;
    border-radius: 16px;
    background-color: ${colors.Gray[50]};
    border: 1px solid ${colors.Gray[200]};
    color: ${colors.Gray[700]};
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
