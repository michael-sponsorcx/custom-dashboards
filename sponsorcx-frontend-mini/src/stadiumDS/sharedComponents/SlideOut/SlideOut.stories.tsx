import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SlideOut } from './SlideOut';
import { Button } from '@mantine/core';

const meta = {
    title: 'Shared Components/Slide Out',
    component: SlideOut,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {},
    args: {
        onClose: fn(),
        onResizeWidth: fn(),
    },
} satisfies Meta<typeof SlideOut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        isOpen: true,
    },
};

export const WithHeader: Story = {
    args: {
        isOpen: true,
        headerTitle: 'Slide Out Header',
        headerSubTitle: 'Slide Out Sub Header',
    },
};

export const WithContentOnly: Story = {
    args: {
        isOpen: true,
        children: <>Slide Out Content</>,
    },
};

export const WithHeaderAndContent: Story = {
    args: {
        isOpen: true,
        headerTitle: 'Slide Out Header',
        headerSubTitle: 'Slide Out Sub Header',
        children: <>Slide Out Content</>,
    },
};

export const WithFooter: Story = {
    args: {
        isOpen: true,
        headerTitle: 'Slide Out Header',
        headerSubTitle: 'Slide Out Sub Header',
        children: <>Slide Out Content</>,
        footerContent: <Button>Save Changes</Button>,
    },
};

export const HideCloseButton: Story = {
    args: {
        isOpen: true,
        hideCloseButton: true,
    },
};
