import type { Meta, StoryObj } from '@storybook/react';
import { StadiumCombobox, StadiumComboboxOption } from './StadiumCombobox';
import { fn } from '@storybook/test';
import Circle from '@/stadiumDS/foundations/icons/Shapes/Circle';
import colors from '@/stadiumDS/foundations/colors';

const meta = {
    title: 'Shared Components/Dropdowns/StadiumCombobox',
    component: StadiumCombobox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onUpdate: fn(),
        searchable: false,
    },
} satisfies Meta<typeof StadiumCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockOptions: StadiumComboboxOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
];

export const Basic: Story = {
    args: {
        options: mockOptions,
    },
};

export const WithValue: Story = {
    args: {
        options: mockOptions,
        value: '1',
    },
};

export const Clearable: Story = {
    args: {
        options: mockOptions,
        value: '1',
        clearable: true,
    },
};

export const Searchable: Story = {
    args: {
        options: mockOptions,
        value: '1',
        searchable: true,
    },
};

export const CustomOption: Story = {
    args: {
        options: mockOptions,
        value: '1',
        renderOption: ({ option }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Circle size={'20'} color={colors.Gray[950]} />
                {option.label}
            </div>
        ),
    },
};

export const Scrollable: Story = {
    args: {
        options: Array.from({ length: 100 }, (_, index) => ({
            value: `Option ${index + 1}`,
            label: `Option ${index + 1}`,
        })),
        value: 'Option 42',
        renderOption: ({ option }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Circle size={'20'} color={colors.Gray[950]} />
                {option.label}
            </div>
        ),
    },
};
