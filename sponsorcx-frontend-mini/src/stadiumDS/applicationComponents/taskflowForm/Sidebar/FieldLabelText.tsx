import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { Text, TextSize, TextWeight } from '@/stadiumDS/foundations/text/Text';
import React from 'react';

type FieldLabelTextProps = {
    children: React.ReactNode;
    truncate?: boolean;
};

export const FieldLabelText = ({ children, truncate }: FieldLabelTextProps) => (
    <Text
        color={primaryColors.Gray[500]}
        size={TextSize.TextSm}
        weight={TextWeight.Regular}
        style={
            truncate
                ? {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      minWidth: 0,
                  }
                : undefined
        }
    >
        {children}
    </Text>
);
