import styled from 'styled-components';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';

export const Container = styled.div<{
    $isOpen: boolean;
    $zIndex: number;
}>`
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: ${(props) => props.$zIndex};
    transform: translateX(${(props) => (props.$isOpen ? '0' : '100%')})
        translateZ(0px);
    transition-duration: 200ms;
    transition-timing-function: ease;
    transition-property: transform;
    overflow: hidden;
    background: ${primaryColors.Base.White};
    border-left: 2px solid ${primaryColors.Gray[200]};
    box-shadow: ${(props) =>
        props.$isOpen
            ? `0px 20px 24px -4px rgba(10, 13, 18, 0.08),
               0px 8px 8px -4px rgba(10, 13, 18, 0.03),
               0px 3px 3px -1.5px rgba(10, 13, 18, 0.04)`
            : 'none'};
`;

export const Handle = styled.div`
    position: absolute;
    background: transparent;
    top: 0;
    left: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    z-index: 1;
`;

export const Content = styled.div<{
    $noPadding?: boolean;
    $offsetHeight?: number;
}>`
    height: calc(100% - ${(props) => props.$offsetHeight}px);
    width: 100%;
    overflow: auto;
    scrollbar-width: thin;
    padding: ${(props) => (props.$noPadding ? '0' : '16px 24px')};
    margin: 0;
    position: relative;
`;

export const CloseButtonContainer = styled.div`
    position: absolute;
    z-index: 1000;
    top: 16px;
    right: 16px;
`;

export const SlideOutHeader = styled.div<{ $slideOutHasTabs?: boolean }>`
    box-sizing: border-box;
    padding: ${({ $slideOutHasTabs }) =>
        $slideOutHasTabs ? '24px 24px 12px' : '24px'};
    border-bottom: ${({ $slideOutHasTabs }) =>
        $slideOutHasTabs ? 'none' : `1px solid ${primaryColors.Gray[200]}`};
    background: ${primaryColors.Base.White};
`;

export const SlideOutHeaderTitle = styled.h2`
    font-family: Inter;
    font-size: '20px';
    font-style: normal;
    font-weight: '600';
    color: ${primaryColors.Base.Black};
    line-height: '30px';
    margin: 0;
    padding: 0;
`;

export const SlideOutHeaderSubTitle = styled.h3`
    color: ${primaryColors.Gray[600]};
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 150% */
    margin-top: 4px;
    padding: 0;
`;

export const SlideOutContent = styled.div`
    box-sizing: border-box;
    padding: 24px 48px;
`;

export const SlideOutBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const SlideOutFooter = styled.div`
    box-sizing: border-box;
    padding: 16px 24px;
    border-top: 1px solid ${primaryColors.Gray[200]};
    background: ${primaryColors.Base.White};
    position: sticky;
    bottom: 0;
    width: 100%;
`;
