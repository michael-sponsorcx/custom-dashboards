import type { Meta, StoryObj } from '@storybook/react';
import { AutoSizeTextInput } from './AutoSizeTextInput';
import { fn } from '@storybook/test';
import { useArgs } from '@storybook/preview-api';
import { StoryFn } from '@storybook/react';

const meta = {
    title: 'Shared Components/AutoSizeTextInput',
    component: AutoSizeTextInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onUpdate: fn(),
    },
} satisfies Meta<typeof AutoSizeTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Create a template that uses useArgs to make the component interactive
const Template: StoryFn<typeof AutoSizeTextInput> = (args) => {
    const [{ value }, updateArgs] = useArgs();

    const handleUpdate = (newValue: string) => {
        updateArgs({ value: newValue });
        args.onUpdate(newValue);
    };

    return (
        <AutoSizeTextInput {...args} value={value} onUpdate={handleUpdate} />
    );
};

// Basic example
export const Basic: Story = {
    render: Template,
    args: {
        value: 'This is a basic input',
    },
};

// Example with placeholder
export const WithPlaceholder: Story = {
    render: Template,
    args: {
        placeholder: 'Enter your text here...',
    },
};

// Example with custom styles
export const CustomStyling: Story = {
    render: Template,
    args: {
        styles: {
            input: {
                backgroundColor: '#f0f8ff',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '16px',
            },
        },
    },
};

// Example with label and description
export const WithLabelAndDescription: Story = {
    render: Template,
    args: {
        label: 'Feedback',
        description: 'Please provide your feedback below',
        placeholder: 'Your feedback is valuable to us...',
    },
};

// Example with disabled state
export const Disabled: Story = {
    render: Template,
    args: {
        value: 'This input is disabled',
        disabled: true,
    },
};

// Example with new lines allowed
export const WithNewLinesAllowed: Story = {
    render: Template,
    args: {
        allowNewLines: true,
        placeholder: 'Press Enter to create new lines...',
        description:
            'This input allows multiple lines of text. Press Enter to create a new line.',
        label: 'Multiline Input',
    },
};

// Example with new lines disabled (default behavior)
export const WithNewLinesDisabled: Story = {
    render: Template,
    args: {
        allowNewLines: false,
        placeholder: 'Enter key will submit, not create new lines...',
        description:
            'This input does not allow new lines. Pressing Enter will not create a new line.',
        label: 'Single-line Input',
    },
};
