import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const Header = styled.div`
    padding: 24px;
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    color: ${colors.Gray[900]};
    border-bottom: 1px solid ${colors.Gray[200]};
`;

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: flex-start;
    width: 100%;
`;

export const RowItem = styled.div`
    flex: 1 1 0;
    min-width: 0; /* Prevents overflow */
`;

export const LogoLabel = styled.div`
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${colors.Gray[700]};
`;
