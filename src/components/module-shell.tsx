import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"
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
  /** Shown under the access-denied notice, e.g. a link to what the role may see. */
  accessDeniedAction?: ReactNode
  /** Extra header content, right-aligned (status, warnings). */
  headerEnd?: ReactNode
  contentClassName?: string
  children: ReactNode
}

/**
 * Admin shell shared by every module site: org switcher, nav, user menu,
 * breadcrumb header. Non-owners keep the shell but get the access-denied
 * notice in place of the page, instead of pages full of 403s. On phones the
 * sidebar becomes a left-hand sheet opened from the header button.
 */
export function ModuleShell({
  user,
  orgs,
  orgSlug,
  nav,
  onSelectOrg,
  onLogout,
  resource,
  accessDeniedAction,
  headerEnd,
  contentClassName = "flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0",
  children,
}: ModuleShellProps) {
  const org = orgs.find((o) => o.slug === orgSlug)
  const page = nav.find((item) => item.active)?.label
  const content =
    org && org.role !== "owner" ? (
      <div className="flex flex-col items-start gap-4">
        <AccessDenied role={org.role} orgName={org.name} resource={resource} />
        {accessDeniedAction}
      </div>
    ) : (
      children
    )

  if (!org)
    return <p className="text-muted-foreground p-8">Organization not found.</p>

  // Sidebar tooltips need a provider; hosts without one at their root still work.
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <OrgSwitcher orgs={orgs} currentOrg={org} onSelect={onSelectOrg} />
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
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex flex-1 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2" />
              <Breadcrumb>
                <BreadcrumbList>
                  {page && (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink asChild>
                          <Link to={`/o/${org.slug}`}>{org.name}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{page ?? org.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {headerEnd}
            </div>
          </header>
          <div className={contentClassName}>{content}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
