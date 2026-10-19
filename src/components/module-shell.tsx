import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"
import { ArrowLeftIcon } from "lucide-react"
import { OrgSwitcher } from "./org-switcher"
import { UserNav } from "./user-nav"
import { AccessDenied } from "./access-denied"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from "./ui/sidebar"
import { Separator } from "./ui/separator"
import { TooltipProvider } from "./ui/tooltip"
import { Button } from "./ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import type { ShellOrg, ShellUser } from "../types"

export interface ShellNavItem {
  label: string
  icon: LucideIcon
  /** Resolved path, e.g. `/o/acme/accounts`. */
  to: string
  active: boolean
}

export interface ModuleShellProps {
  user: ShellUser
  orgs: ShellOrg[]
  /** Slug from the URL; the shell resolves it against `orgs`. */
  orgSlug: string | undefined
  nav: ShellNavItem[]
  onSelectOrg: (org: ShellOrg) => void
  onLogout: () => void
  /** Named in the access-denied message, e.g. "Twitch accounts". */
  resource: string
  /** Where the access-denied screen links back to; the module home by default. */
  backTo?: string
  /** Extra header content, right-aligned (status, warnings). */
  headerEnd?: ReactNode
  contentClassName?: string
  children: ReactNode
}

/**
 * Owner-only admin shell shared by every module site: org switcher, nav,
 * user menu, breadcrumb header. Non-owners get the access-denied notice
 * instead of pages full of 403s.
 */
export function ModuleShell({
  user,
  orgs,
  orgSlug,
  nav,
  onSelectOrg,
  onLogout,
  resource,
  backTo = "/",
  headerEnd,
  contentClassName = "flex-1 overflow-hidden p-6 flex flex-col",
  children,
}: ModuleShellProps) {
  const org = orgs.find((o) => o.slug === orgSlug)

  if (!org)
    return <p className="text-muted-foreground p-8">Organization not found.</p>

  if (org.role !== "owner") {
    return (
      <div className="max-w-xl mx-auto px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to={backTo}>
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="size-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{org.name}</h1>
        </div>
        <AccessDenied role={org.role} orgName={org.name} resource={resource} />
      </div>
    )
  }

  // Sidebar tooltips need a provider; hosts without one at their root still work.
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <OrgSwitcher
              orgs={orgs.filter((o) => o.role === "owner")}
              currentOrg={org}
              onSelect={onSelectOrg}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.active}
                        tooltip={item.label}
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <UserNav user={user} onLogout={onLogout} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{org.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {headerEnd}
          </header>
          <div className={contentClassName}>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
