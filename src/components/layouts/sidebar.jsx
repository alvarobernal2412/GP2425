import { Calendar, Home, Search, ChevronRight, ChevronsUpDown, LogOut, CalendarCheck, UserPen, ClipboardPlus, Stethoscope } from 'lucide-react';
import { Link } from 'react-router';
import { MoreHorizontal } from 'lucide-react';
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import ModdeToggle from '@/components/mode-toggle';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import userData from '@/utils/userData';

// Menu items.
const data = [
  {
    type: 'group',
    title: 'Application',
    items: [
      {
        title: 'Home',
        url: '/',
        icon: Home,
      },
      {
        title: 'My staff profile',
        url: '/app/staff/me',
        icon: Stethoscope,
        roles: ['doctor'],
      },
      {
        title: 'Register a new doctor',
        url: '/app/register-staff',
        icon: ClipboardPlus,
        roles: ['clinicadmin'],
      },
      {
        title: 'Patient creation',
        url: '/app/patients/register-patient',
        icon: UserPen,
        roles: ['doctor','admin','clinicadmin'],
      },
      {
        title: 'Appointments',
        url: '/app/appointments',
        icon: CalendarCheck,
        roles: ['patient'],
      },
      {
        title: 'Edit patient profile',
        url: '/app/patients/edit',
        icon: UserPen,
        roles: ['patient'],
      },
      {
        title: 'Calendar',
        url: '/app/calendar',
        icon: Calendar,
        roles: ['doctor'],
      },
      {
        title: 'Search',
        url: '#',
        icon: Search,
        active: false,
        items: [
          {
            title: 'Search doctor',
            url: '/app/search-staff',
          },
        ],
      },
    ]
  },
  {
    type: 'footer',
    title: 'Footer',
    // TODO: Add user attrs.
    items: [
      {
        type: 'toggle',
        component: ModdeToggle,
        props: {
          variant: 'text',
          positioning: 'start',
          className: 'w-full px-2 py-1.5'
        },
      },
      {
        type: 'separator',
      },
      {
        type: 'item',
        title: 'Logout',
        url: '/logout',
        icon: LogOut,
      },
    ]
  }
];

export function AppSidebar() {
  const {
    open,
    isMobile,
  } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      side={
        isMobile ? 'right' : 'left'
      }
    >
      <SidebarContent className="space-y-6 sm:space-y-3">
        {data.filter((item) => item.type === 'group').map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>
              <span className="text-sm font-medium primary">{group.title}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-4 sm:space-y-2">
                {group.items.map((item) => (
                  (item.roles && item.roles.some(r => userData.roles.includes(r)) || item.roles == undefined) && (
                    item.items ? (
                      <CollapsibleItem key={item.title} item={item} />
                    ) : (
                      <NonCollapsibleItem key={item.title} item={item} />
                    )
                  )
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {(open || isMobile) ? (
                    <FooterButton />
                  ) : null}
                  <ChevronsUpDown className="m-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                {data.filter((item) => item.type === 'footer').map((item) => (
                  item.items.map((item, index) => (
                    <FooterItem key={item.title ? item.title : index} item={item} />
                  ))
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function NonCollapsibleItem({ item, ...props }) {
  return (
    <SidebarMenuItem key={props.key ? props.key : null}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <Link to={item.url}>
          <item.icon />
          <span className="text-base font-medium primary">{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {item.actions && !item.items ? (
        <DropdownMenu className="hidden">
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            {item.actions.map((action) => (
              <DropdownMenuItem key={`${action.title}`}>
                <span onClick={action.onClick} className="font-small primary">{action.title}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </SidebarMenuItem>
  );
}

function CollapsibleItem({ item, ...props }) {
  return (
    <Collapsible asChild defaultOpen={item.active ? item.active : false} key={props.key ? props.key : null} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton asChild tooltip={item.title}>
            <Link to={item.url}>
              <item.icon />
              <span className="text-base font-medium primary">{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </Link>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="pt-4 sm:pt-2 space-y-2 sm:space-y-1">
            {item.items && item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link to={subItem.url} className="text-base font-medium primary">{subItem.title}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function FooterItem({ item, ...props }) {
  return (
    item.type === 'separator' ? (
      <DropdownMenuSeparator key={props.key ? props.key : null} />
    ) :
      item.type === 'item' ? (
        <DropdownMenuItem asChild key={props.key ? props.key : null} className="hover:cursor-pointer">
          <Link to={item.url}>
            <item.icon />
            <span className="text-base font-medium primary">{item.title}</span>
          </Link>
        </DropdownMenuItem>
      ) :
        item.type === 'toggle' ? (
          <item.component {...item.props} key={props.key ? props.key : null} />
        ) : null
  );
}

function FooterButton() {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">
        {userData && userData.email}
      </span>
      <span className="truncate text-xs">
        {userData && userData.roles.join(', ')}
      </span>
    </div>
  );
}
