export interface ShellOrg {
  id: string
  slug: string
  name: string
  role: string
  logo?: string
}

export interface ShellUser {
  name?: string
  email?: string
  picture?: string
}
