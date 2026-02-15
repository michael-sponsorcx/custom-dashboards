import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const EmptyPlusContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px dashed ${colors.Gray[300]};
`;

export const AvatarContainer = styled.div<{ $zIndex: number }>`
    margin-right: -5px;
    border-radius: 50%;
    border: 1px solid ${colors.Base.White};
    z-index: ${({ $zIndex }) => $zIndex};
`;

export const PlusContainer = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid ${colors.Gray[200]};
    background-color: ${colors.Gray[100]};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    color: ${colors.Gray[600]};
    text-align: center;
`;
