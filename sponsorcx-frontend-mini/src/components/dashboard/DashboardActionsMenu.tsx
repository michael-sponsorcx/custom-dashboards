import { Menu, Button } from '@mantine/core';
import { IconPresentation, IconFileTypePdf, IconRefresh, IconChevronDown, IconCalendar, IconChevronRight } from '@tabler/icons-react';

interface DashboardActionsMenuProps {
  onPresent: () => void;
  onDownloadPDF: () => void;
  onCreateSchedule: () => void;
  onManageSchedules: () => void;
  onRefresh: () => void;
  disabled?: boolean;
  refreshing?: boolean;
}

export function DashboardActionsMenu({
  onPresent,
  onDownloadPDF,
  onCreateSchedule,
  onManageSchedules,
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
        <Menu
          trigger="hover"
          position="right-start"
          offset={2}
          shadow="md"
          width={200}
        >
          <Menu.Target>
            <Menu.Item
              leftSection={<IconCalendar size={16} />}
              rightSection={<IconChevronRight size={16} />}
            >
              Schedule
            </Menu.Item>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={onCreateSchedule}>Create Schedule</Menu.Item>
            <Menu.Item onClick={onManageSchedules}>Manage Schedules</Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
