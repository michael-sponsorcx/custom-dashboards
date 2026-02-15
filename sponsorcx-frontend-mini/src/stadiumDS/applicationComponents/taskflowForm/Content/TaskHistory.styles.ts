import colors from '@/stadiumDS/foundations/colors';
import styled, { keyframes } from 'styled-components';

export const Content = styled.div``;

export const HistoryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 16px;
`;

export const HistoryGroupHeaderText = styled.div`
    color: ${colors.Gray[600]};
    font-family: Inter;
    font-size: 12px;
    font-style: italic;
    font-weight: 400;
    line-height: 18px; /* 150% */
`;

export const HistoryGroupFooter = styled.hr`
    width: 100%;
    height: 1px;
    border: none;
    border-bottom: 1px solid ${colors.Gray[300]};
    margin: 12px 0;
`;

export const HistoryItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const HistoryContent = styled.div`
    display: flex;
    gap: 8px;
`;

export const HistoryText = styled.div`
    word-wrap: break-word;
    color: ${colors.Gray[600]};
    align-items: center;

    /* Text xs/Regular */
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 150% */
`;

export const HistoryTextToken = styled.span`
    color: ${colors.Gray[900]};

    /* Text xs/Semibold */
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;

    /* Align Property Icon with the text */
    > img,
    > svg {
        vertical-align: middle;
        margin-right: 4px;
    }

    /* TODO: Fix the Avatar component so we can have more flexibility with styling it. */
    /* Align the user Avatar with the text */
    > div {
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        margin-right: 4px;
    }
`;

export const HistoryTextUnknown = styled(HistoryTextToken)`
    color: ${colors.Gray[500]};
    font-style: italic;
`;

export const HistoryAction = styled.span`
    font-weight: 600;
`;

export const HistoryGapIndicator = styled.div`
    display: flex;
    align-items: center;
`;

export const HistoryTime = styled.div`
    font-size: 12px;
    color: ${colors.Gray[500]};
    margin-top: 2px;
`;

export const HistorySeparator = styled.div`
    width: 1px;
    height: 13px;
    border-left: 1px solid ${colors.Gray[300]};
    margin-left: 7px;
`;

export const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const AnimatedHistoryItem = styled.div<{ delay: number }>`
    animation: ${fadeIn} 0.3s ease-out;
    animation-delay: ${(props) => props.delay}s;
    animation-fill-mode: both;
`;

export const HistoryGroupCollapseButton = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;

    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    width: 16px;
    height: 16px;

    &:hover {
        background: ${colors.Gray[100]};
    }
`;

export const RotatingChevron = styled.div<{ isOpen: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(${(props) => (props.isOpen ? '90deg' : '0deg')});
    transition: transform 0.3s ease;
`;
