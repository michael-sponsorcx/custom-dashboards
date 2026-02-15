import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: ${colors.Base.White};
    border-radius: 12px;
    box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
    overflow: hidden;
`;

export const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    padding: 20px 24px;
    gap: 16px;
    background-color: ${colors.Base.White};
    z-index: 2;
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const HeaderExtraContent = styled.div`
    flex-shrink: 0;
`;

export const TableWrapper = styled.div`
    overflow: auto;
    scrollbar-width: thin;
`;
