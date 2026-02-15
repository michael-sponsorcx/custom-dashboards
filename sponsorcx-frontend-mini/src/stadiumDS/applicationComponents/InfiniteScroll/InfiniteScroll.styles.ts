import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    width: 100%;
    padding: 16px;
    align-items: center;
    justify-content: center;
`;

export const LoadMoreButton = styled.div`
    cursor: pointer;
    color: ${colors.Brand[400]};
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
`;
