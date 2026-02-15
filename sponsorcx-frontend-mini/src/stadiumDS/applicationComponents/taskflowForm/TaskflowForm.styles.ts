import styled from 'styled-components';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import colors from '@/stadiumDS/foundations/colors';

export const Container = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    align-self: stretch;
    height: 100vh;
    overflow-y: hidden;
`;

export const Panel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    min-width: 0;
    height: 100vh;
    position: relative;
    overflow-y: hidden;
`;

export const SidebarPanel = styled(Panel)`
    box-sizing: border-box;
    display: flex;
    width: 320px;
    min-width: 320px;
    max-width: 320px;
    padding: 48px 24px 24px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    flex: 0 0 320px;
    border-left: 1px solid ${primaryColors.Gray[200]};
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
`;

export const TaskNameSection = styled.div`
    box-sizing: border-box;
    padding: 48px 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
`;

export const DetailsSection = styled.div`
    box-sizing: border-box;
    padding: 24px 48px 8px 48px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const DetailsHeader = styled.h3`
    color: ${colors.Base.Black};
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
    margin: 0;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    padding: 8px 48px 24px 48px;
    width: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
`;

export const HeaderButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    position: absolute;
    z-index: 1000;
    top: 16px;
    right: 16px;
    left: 16px;
`;
