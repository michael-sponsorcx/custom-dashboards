import { Menu, Button } from '@mantine/core';
import { IconPresentation, IconFileTypePdf, IconRefresh, IconChevronDown } from '@tabler/icons-react';

interface DashboardActionsMenuProps {
  onPresent: () => void;
  onDownloadPDF: () => void;
  onRefresh: () => void;
  disabled?: boolean;
  refreshing?: boolean;
}

export function DashboardActionsMenu({
  onPresent,
  onDownloadPDF,
  onRefresh,
  disabled = false,
  refreshing = false,
}: DashboardActionsMenuProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          size="lg"
          disabled={disabled}
          rightSection={<IconChevronDown size={18} />}
        >
          Dashboard Actions
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Dashboard Options</Menu.Label>
        <Menu.Item
          leftSection={<IconPresentation size={16} />}
          onClick={onPresent}
        >
          Present
        </Menu.Item>
        <Menu.Item
          leftSection={<IconFileTypePdf size={16} />}
          onClick={onDownloadPDF}
        >
          Download PDF
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconRefresh size={16} />}
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh All'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
