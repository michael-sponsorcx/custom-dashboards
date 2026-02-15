import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta = {
    title: 'Shared Components/Switch',
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        label: 'Basic Switch',
    },
};

export const Checked: Story = {
    args: {
        label: 'Checked Switch',
        defaultChecked: true,
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Switch with Description',
        description: 'This is a description for the switch',
    },
};

export const WithError: Story = {
    args: {
        label: 'Switch with Error',
        error: 'This is an error message',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Switch',
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        label: 'Disabled Checked Switch',
        disabled: true,
        defaultChecked: true,
    },
};

export const DifferentSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Switch size="xs" label="Extra Small" />
            <Switch size="sm" label="Small" />
            <Switch size="md" label="Medium" />
            <Switch size="lg" label="Large" />
            <Switch size="xl" label="Extra Large" />
        </div>
    ),
};

export const WithInnerLabels: Story = {
    args: {
        label: 'Switch with Inner Labels',
        onLabel: 'ON',
        offLabel: 'OFF',
        size: 'md',
    },
};

export const LabelPositions: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Switch
                label="Label on the right (default)"
                labelPosition="right"
            />
            <Switch label="Label on the left" labelPosition="left" />
        </div>
    ),
};

export const Required: Story = {
    args: {
        label: 'Required Switch',
        required: true,
    },
};
