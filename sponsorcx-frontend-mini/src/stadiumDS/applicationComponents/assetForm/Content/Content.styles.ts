import styled from 'styled-components';
import colors from '@/stadiumDS/foundations/colors';

export const Container = styled.div`
    box-sizing: border-box;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const Header = styled.h3`
    color: ${colors.Base.Black};
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
    margin: 0;
    padding: 0;
`;
