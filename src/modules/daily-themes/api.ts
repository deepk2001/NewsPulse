import {
  formatThemeLabel,
  type BucketExtra,
  type Digest,
  type EventExtra,
  type EventItem,
  type ThemeOption,
} from "./data";

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://steelhacks-xiii.vercel.app";

type QueryValue = string | number | boolean | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

type ThemeCount = {
  name: string;
  event_count: number;
};

export function buildApiUrl(path: string, params: QueryParams = {}) {
  const url = new URL(path, `${apiBase.replace(/\/$/, "")}/`);

  for (const [key, value] of Object.entries(params)) {
    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item === undefined) {
        continue;
      }

      url.searchParams.append(key, String(item));
    }
  }

  return url.toString();
}

async function getJson<T>(path: string, params?: QueryParams): Promise<T> {
  const response = await fetch(buildApiUrl(path, params), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

export async function getThemes(): Promise<ThemeOption[]> {
  const themes = await getJson<ThemeCount[]>("/themes");

  return themes.map((theme) => ({
    id: theme.name,
    label: formatThemeLabel(theme.name),
    eventCount: theme.event_count,
  }));
}

export const digestArticleLimit = 8;

export async function getDigests(
  themes: string | string[],
  limit = digestArticleLimit,
  threshold?: number,
): Promise<Digest[]> {
  const themeList = Array.isArray(themes) ? themes : [themes];

  return getJson<Digest[]>("/digest", {
    theme: themeList,
    limit,
    threshold,
  });
}

export async function getBucketExtras(ids: string[]): Promise<BucketExtra[]> {
  if (ids.length === 0) {
    return [];
  }

  return getJson<BucketExtra[]>("/bucket/extra", { id: ids });
}

export async function getEventExtras(ids: string[]): Promise<EventExtra[]> {
  if (ids.length === 0) {
    return [];
  }

  return getJson<EventExtra[]>("/event/extra", { id: ids });
}

export async function getEvents(ids: string[]): Promise<EventItem[]> {
  if (ids.length === 0) {
    return [];
  }

  const [events, extras] = await Promise.all([
    getJson<EventItem[]>("/event", { id: ids }),
    getEventExtras(ids).catch(() => []),
  ]);
  const extraById = new Map(extras.map((item) => [item.id, item]));

  return events.map((event) => ({
    ...event,
    source: extraById.get(event.id)?.extra.source,
  }));
}

export function dailyDigestsIcsUrl(themes: string[], title = "News Pulse") {
  return buildApiUrl("/daily_digests.ics", {
    title,
    theme: themes,
    days: 7,
  });
}
