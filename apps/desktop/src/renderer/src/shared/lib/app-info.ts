type AppInfo = Awaited<ReturnType<typeof window.apostrophi.appInfo>>;

let cached: AppInfo | null = null;

export function loadAppInfo(): Promise<AppInfo> {
  if (cached) return Promise.resolve(cached);
  return window.apostrophi.appInfo().then((info) => {
    cached = info;
    return info;
  });
}
