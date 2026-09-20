import { digestArticleLimit } from "./api";
import fuegoResponse from "./fuego-response.json";

export type Digest = {
  id: string;
  summary: string;
  theme: string;
  begin_timestamp: string;
  end_timestamp: string;
  sources: string[];
};

export type EventItem = {
  id: string;
  name: string;
  summary: string;
  themes: string[];
  similarities: Record<string, number>;
  article_url: string;
  timestamp: string;
  source?: string;
};

export type ThemeOption = {
  id: string;
  label: string;
  eventCount?: number;
};

export type RelatedTopic = {
  name: string;
  similarity: number;
};

export type BucketActivity = {
  change_ratio?: number;
  current_count: number;
  previous_count?: number;
  status: string;
};

export type BucketExtra = {
  id: string;
  extra: {
    activity: BucketActivity;
    description: string;
    direction: {
      description: string;
      related_topics: RelatedTopic[];
    };
    generated_at: string;
    name: string;
    source_bucket_id: string;
    type: string;
  };
};

export type EventTone = {
  tone: number;
  positive: number;
  negative: number;
  polarity: number;
  activity: number;
  selfReference: number;
  wordCount: number;
};

export type EventExtra = {
  id: string;
  extra: {
    metadata?: {
      gdelt_themes?: string[];
      organizations?: string;
      people?: string;
      publication_date_raw?: number;
      record_id?: string;
      tone_raw?: string;
    };
    semantic_text?: string;
    source?: string;
  };
};

type FuegoBucket = (typeof fuegoResponse)["buckets"][number];
type FuegoArticle = (typeof fuegoResponse)["articles"][number];

function themeFromBucket(bucket: FuegoBucket) {
  return bucket.name.toLowerCase();
}

function convertFuegoResponse(payload: typeof fuegoResponse) {
  const themeByBucketId = new Map(
    payload.buckets.map((bucket) => [bucket.id, themeFromBucket(bucket)]),
  );
  const articleById = new Map(
    payload.articles.map((article) => [article.id, article]),
  );

  const themeOptions: ThemeOption[] = payload.buckets.map((bucket) => ({
    id: themeFromBucket(bucket),
    label: bucket.name,
  }));

  const events: EventItem[] = payload.articles.map((article: FuegoArticle) => {
    const similarities: Record<string, number> = {};
    const themes: string[] = [];

    for (const membership of article.buckets) {
      const theme = themeByBucketId.get(membership.bucket_id);
      if (!theme) {
        continue;
      }
      themes.push(theme);
      similarities[theme] = membership.similarity;
    }

    return {
      id: article.id,
      name: article.title,
      summary: article.summary,
      themes,
      similarities,
      article_url: article.url,
      timestamp: article.published_at,
    };
  });

  const digests: Digest[] = payload.buckets.map((bucket) => {
    const members = [...bucket.members].sort((left, right) => left.rank - right.rank);
    const timestamps = members.flatMap((member) => {
      const article = articleById.get(member.article_id);
      return article ? [article.published_at] : [];
    });
    const begin =
      timestamps.length > 0
        ? timestamps.reduce((earliest, value) =>
            value < earliest ? value : earliest,
          )
        : payload.generated_at;
    const end =
      timestamps.length > 0
        ? timestamps.reduce((latest, value) =>
            value > latest ? value : latest,
          )
        : payload.generated_at;

    return {
      id: bucket.id,
      summary: bucket.summary,
      theme: themeFromBucket(bucket),
      begin_timestamp: begin,
      end_timestamp: end,
      sources: members.map((member) => member.article_id),
    };
  });

  return { themeOptions, digests, events };
}

const dummy = convertFuegoResponse(fuegoResponse);

export const themeOptions = dummy.themeOptions;

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayIsoDate() {
  return toIsoDate(new Date());
}

export function formatThemeLabel(name: string) {
  return name
    .split(" ")
    .map((word) => {
      if (word === "&") {
        return "&";
      }

      if (word.toLowerCase() === "ai") {
        return "AI";
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getThemeLabel(themeId: string, themes: ThemeOption[] = []) {
  return (
    themes.find((theme) => theme.id === themeId)?.label ??
    formatThemeLabel(themeId)
  );
}

function digestDate(digest: Digest) {
  const match = digest.id.match(/(\d{4}-\d{2}-\d{2})$/);
  return match?.[1] ?? null;
}

export function pickDigest(digests: Digest[], isoDate: string) {
  const withArticles = digests.filter((digest) => digest.sources.length > 0);

  if (withArticles.length === 0) {
    return null;
  }

  const byBucketDate = withArticles.find(
    (digest) => digestDate(digest) === isoDate,
  );
  if (byBucketDate) {
    return byBucketDate;
  }

  return (
    withArticles.find(
      (digest) =>
        digestDate(digest) === null && digestOverlapsDate(digest, isoDate),
    ) ?? null
  );
}

export function digestHasArticles(digest: Digest | null) {
  return Boolean(digest && digest.sources.length > 0);
}

export function themeDigestsForDate(
  themes: ThemeOption[],
  digests: Digest[],
  isoDate: string,
) {
  return themes
    .flatMap((theme) => {
      const digest = pickDigest(
        digests.filter((item) => item.theme === theme.id),
        isoDate,
      );

      return digestHasArticles(digest) && digest ? [{ theme, digest }] : [];
    })
    .sort((left, right) => {
      if (left.digest.sources.length !== right.digest.sources.length) {
        return right.digest.sources.length - left.digest.sources.length;
      }

      return (right.theme.eventCount ?? 0) - (left.theme.eventCount ?? 0);
    });
}

export function themesWithArticles(
  themes: ThemeOption[],
  digests: Digest[],
  isoDate: string,
) {
  return themeDigestsForDate(themes, digests, isoDate).map((item) => item.theme);
}

export function digestOverlapsDate(digest: Digest, isoDate: string) {
  const dayStart = new Date(`${isoDate}T00:00:00`);
  const dayEnd = new Date(`${isoDate}T23:59:59.999`);
  const begin = new Date(digest.begin_timestamp);
  const end = new Date(digest.end_timestamp);
  return begin <= dayEnd && end >= dayStart;
}

export function getDummyDigests(theme: string, limit = digestArticleLimit) {
  return dummy.digests
    .filter((digest) => digest.theme === theme)
    .slice(0, limit);
}

export function getDummyEvents(ids: string[]) {
  const byId = new Map(dummy.events.map((event) => [event.id, event]));
  return ids.flatMap((id) => {
    const event = byId.get(id);
    return event ? [event] : [];
  });
}

export function formatLocalTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatHeadingDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatSimilarity(score: number | undefined) {
  if (score === undefined) {
    return "—";
  }

  return `${Math.round(score * 100)}%`;
}

function mixChannel(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

export function relevanceColor(score: number | undefined) {
  const value = Math.min(1, Math.max(0, score ?? 0));
  const red = { r: 196, g: 28, b: 28 };
  const darkYellow = { r: 166, g: 124, b: 0 };
  const darkGreen = { r: 10, g: 92, b: 38 };
  const from = value < 0.5 ? red : darkYellow;
  const to = value < 0.5 ? darkYellow : darkGreen;
  const amount = value < 0.5 ? value * 2 : (value - 0.5) * 2;

  return `rgb(${mixChannel(from.r, to.r, amount)} ${mixChannel(from.g, to.g, amount)} ${mixChannel(from.b, to.b, amount)})`;
}

export function parseTone(raw?: string): EventTone | null {
  if (!raw) {
    return null;
  }

  const parts = raw.split(",").map((part) => Number(part.trim()));

  if (parts.length < 7 || parts.some((value) => Number.isNaN(value))) {
    return null;
  }

  return {
    tone: parts[0],
    positive: parts[1],
    negative: parts[2],
    polarity: parts[3],
    activity: parts[4],
    selfReference: parts[5],
    wordCount: parts[6],
  };
}

export function splitNames(value?: string) {
  return (value ?? "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export function formatChangeRatio(ratio: number | undefined) {
  if (ratio === undefined) {
    return "—";
  }

  const percent = Math.round(ratio * 100);
  return `${percent > 0 ? "+" : ""}${percent}%`;
}

export function averageTones(tones: EventTone[]): EventTone | null {
  if (tones.length === 0) {
    return null;
  }

  const total = tones.reduce(
    (sum, tone) => ({
      tone: sum.tone + tone.tone,
      positive: sum.positive + tone.positive,
      negative: sum.negative + tone.negative,
      polarity: sum.polarity + tone.polarity,
      activity: sum.activity + tone.activity,
      selfReference: sum.selfReference + tone.selfReference,
      wordCount: sum.wordCount + tone.wordCount,
    }),
    {
      tone: 0,
      positive: 0,
      negative: 0,
      polarity: 0,
      activity: 0,
      selfReference: 0,
      wordCount: 0,
    },
  );
  const count = tones.length;

  return {
    tone: total.tone / count,
    positive: total.positive / count,
    negative: total.negative / count,
    polarity: total.polarity / count,
    activity: total.activity / count,
    selfReference: total.selfReference / count,
    wordCount: total.wordCount,
  };
}
