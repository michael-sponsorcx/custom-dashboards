import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '@/components/Button';

const meta = {
    title: 'Shared Components/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        label: 'This is a tooltip',
        children: <span>Hover me</span>,
    },
};

export const WithButton: Story = {
    args: {
        label: 'Click this button to save changes',
        children: <Button variant="primary">Save</Button>,
    },
};

export const LongContent: Story = {
    args: {
        label: 'This is a longer tooltip that explains something in more detail. It might wrap to multiple lines.',
        children: <span>Hover for more info</span>,
    },
};

export const WithIcon: Story = {
    args: {
        label: 'Help information',
        children: <span style={{ cursor: 'help' }}>ℹ️</span>,
    },
};
