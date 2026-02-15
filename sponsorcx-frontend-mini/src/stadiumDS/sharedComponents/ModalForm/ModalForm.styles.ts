import colors from '@/stadiumDS/foundations/colors';
import styled, { css } from 'styled-components';

export const Container = styled.div<{ $padding?: string }>`
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: ${(props) => props.$padding || '24px 16px'};
    position: relative;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: thin;
    text-align: left;
    overflow: visible;
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
`;

export const Title = styled.div<{ $avoidCloseButton?: boolean }>`
    font-family: Inter;
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    color: ${colors.Gray[900]};
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    ${(props) =>
        props.$avoidCloseButton &&
        css`
            padding-right: 24px;
        `}
`;

export const Description = styled.div`
    font-family: Inter;
    font-size: 14px;
    line-height: 20px;
    color: ${colors.Gray[600]};
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
`;

export const CloseIconContainer = styled.div`
    position: absolute;
    right: 16px;
    top: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: ${colors.Gray[100]};
        border-radius: 4px;
        cursor: pointer;
    }
`;

export const Underline = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${colors.Gray[200]};
`;

export const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

export const ButtonsContainer = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
`;
