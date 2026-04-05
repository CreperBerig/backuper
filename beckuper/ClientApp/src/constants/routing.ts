export const ROUTES = {
  home: "/",
  dashboard: (id: number) => `/dashboard/${id}`,
  settings: {
    index: "/settings",
    local: "/settings/local",
    app: "/settings/app",
  }
}