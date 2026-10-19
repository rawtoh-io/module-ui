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
import { useIsPhone } from "../hooks/use-mobile"
import { cn } from "../lib/utils"
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
  const isPhone = useIsPhone()

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

  // Phones get the compact page header instead of a sidebar: back arrow, org
  // name, current section, and tabs when the module has several sections.
  if (isPhone) {
    const current = nav.find((item) => item.active)
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to={backTo}>
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="size-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{org.name}</h1>
            {current && (
              <p className="text-muted-foreground text-sm">{current.label}</p>
            )}
          </div>
        </div>
        {headerEnd && <div className="flex mb-4">{headerEnd}</div>}
        {nav.length > 1 && (
          <nav className="flex gap-1 overflow-x-auto mb-4 -mx-1 px-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
                  item.active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        {children}
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
