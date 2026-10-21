import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ChevronsUpDownIcon } from "lucide-react"
import type { ShellOrg } from "../types"

function orgInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function OrgSwitcher({
  orgs,
  currentOrg,
  onSelect,
}: {
  orgs: ShellOrg[]
  currentOrg: ShellOrg
  onSelect: (org: ShellOrg) => void
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar shape="square">
                <AvatarImage src={currentOrg.logo} alt={currentOrg.name} />
                <AvatarFallback>{orgInitials(currentOrg.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentOrg.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentOrg.role}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => onSelect(org)}
                className="gap-2 p-2"
              >
                <Avatar size="sm" shape="square">
                  <AvatarImage src={org.logo} alt={org.name} />
                  <AvatarFallback>{orgInitials(org.name)}</AvatarFallback>
                </Avatar>
                {org.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
