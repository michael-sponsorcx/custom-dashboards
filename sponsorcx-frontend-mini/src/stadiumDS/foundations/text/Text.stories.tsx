import type { Meta, StoryObj } from '@storybook/react';
import { Text, TextSize, TextWeight } from './Text';
import { primaryColors } from '../colors/primary';

const meta = {
    title: 'Foundations/Text',
    component: Text,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: Object.values(TextSize),
        },
        weight: {
            control: 'select',
            options: Object.values(TextWeight),
            defaultValue: TextWeight.Regular,
        },
        color: {
            control: 'color',
            defaultValue: primaryColors.Gray[900],
        },
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example stories with different content
export const Default: Story = {
    args: {
        size: TextSize.TextMd,
        weight: TextWeight.Regular,
        children: 'SponsorCX',
    },
};

// Create a story for each size and weight combination
const sizes = Object.values(TextSize);
const weights = Object.values(TextWeight);

// Generate all size and weight combinations as stories
export const AllVariants = {
    render: () => (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {sizes.map((size) =>
                weights.map((weight) => (
                    <Text key={`${size}_${weight}`} size={size} weight={weight}>
                        {`${size} ${weight}`}
                    </Text>
                ))
            )}
        </div>
    ),
};

// Example stories with different content
export const Paragraph: Story = {
    args: {
        size: TextSize.TextMd,
        weight: TextWeight.Regular,
        children:
            'This is a paragraph of text that demonstrates how the component handles longer content. It should wrap naturally and maintain proper line height.',
    },
};

export const Numbers: Story = {
    args: {
        size: TextSize.DisplayLg,
        weight: TextWeight.Bold,
        children: '123,456.789',
    },
};

export const WithEmoji: Story = {
    args: {
        size: TextSize.TextLg,
        weight: TextWeight.Medium,
        children: '👋 Hello World! 🌍',
    },
};

export const WithCustomColor: Story = {
    args: {
        size: TextSize.DisplayLg,
        weight: TextWeight.Bold,
        color: primaryColors.Brand[600],
        children: 'Custom Colored Text',
    },
};

export const ColorVariants = {
    render: () => (
        <div style={{ display: 'grid', gap: '1rem' }}>
            <Text size={TextSize.TextLg} color={primaryColors.Brand[600]}>
                Brand Color
            </Text>
            <Text size={TextSize.TextLg} color={primaryColors.Error[600]}>
                Error Color
            </Text>
            <Text size={TextSize.TextLg} color={primaryColors.Success[600]}>
                Success Color
            </Text>
            <Text size={TextSize.TextLg} color="#9333EA">
                Custom Purple
            </Text>
        </div>
    ),
};
