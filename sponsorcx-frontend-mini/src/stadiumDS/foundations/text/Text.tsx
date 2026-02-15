import styled, { css } from 'styled-components';
import { primaryColors } from '../colors/primary';
import { ReactNode } from 'react';

export enum TextSize {
    Display2xl = 'Display2xl',
    DisplayXl = 'DisplayXl',
    DisplayLg = 'DisplayLg',
    DisplayMd = 'DisplayMd',
    DisplaySm = 'DisplaySm',
    DisplayXs = 'DisplayXs',
    TextXl = 'TextXl',
    TextLg = 'TextLg',
    TextMd = 'TextMd',
    TextSm = 'TextSm',
    TextXs = 'TextXs',
}

export enum TextWeight {
    Regular = 'Regular',
    Medium = 'Medium',
    Semibold = 'Semibold',
    Bold = 'Bold',
}

export interface TextProps {
    size: TextSize;
    weight?: TextWeight;
    color?: string;
    children?: ReactNode;
}

const sizeStyles = {
    [TextSize.Display2xl]: css`
        font-size: 72px;
        line-height: 90px; /* 125% */
        letter-spacing: -1.44px;
    `,
    [TextSize.DisplayXl]: css`
        font-size: 60px;
        line-height: 72px; /* 120% */
        letter-spacing: -1.2px;
    `,
    [TextSize.DisplayLg]: css`
        font-size: 48px;
        line-height: 60px; /* 125% */
        letter-spacing: -0.96px;
    `,
    [TextSize.DisplayMd]: css`
        font-size: 36px;
        line-height: 44px; /* 122.222% */
        letter-spacing: -0.72px;
    `,
    [TextSize.DisplaySm]: css`
        font-size: 30px;
        line-height: 38px; /* 126.667% */
    `,
    [TextSize.DisplayXs]: css`
        font-size: 24px;
        line-height: 32px; /* 133.333% */
    `,
    [TextSize.TextXl]: css`
        font-size: 20px;
        line-height: 30px; /* 150% */
    `,
    [TextSize.TextLg]: css`
        font-size: 18px;
        line-height: 28px; /* 155.556% */
    `,
    [TextSize.TextMd]: css`
        font-size: 16px;
        line-height: 24px; /* 150% */
    `,
    [TextSize.TextSm]: css`
        font-size: 14px;
        line-height: 20px; /* 142.857% */
    `,
    [TextSize.TextXs]: css`
        font-size: 12px;
        line-height: 18px; /* 150% */
    `,
};

const weightStyles = {
    [TextWeight.Regular]: css`
        font-weight: 400;
    `,
    [TextWeight.Medium]: css`
        font-weight: 500;
    `,
    [TextWeight.Semibold]: css`
        font-weight: 600;
    `,
    [TextWeight.Bold]: css`
        font-weight: 700;
    `,
};

export const Text = styled.span<TextProps>`
    color: ${(props) => props.color || primaryColors.Gray[900]};
    font-family: Inter;
    font-style: normal;
    ${(props) => sizeStyles[props.size]}
    ${(props) => weightStyles[props.weight || TextWeight.Regular]}
`;
