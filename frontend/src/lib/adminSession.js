export function getAdminSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem("luxe-admin") ?? "null");
    return session && typeof session.token === "string" ? session : null;
  } catch {
    return null;
  }
}
