"use client";

import { useState } from "react";
import { getBucketExtras, getEventExtras } from "../api";
import {
  averageTones,
  formatChangeRatio,
  formatStatus,
  parseTone,
  splitNames,
  type BucketExtra,
  type EventExtra,
} from "../data";
import {
  chevron,
  chevronOpen,
  chipRow,
  metaChip,
  plotCard,
  plotGrid,
  plotTitle,
  related,
  relatedHeading,
  relatedToggle,
  statCard,
  statLabel,
  statNote,
  statsGrid,
  statsSection,
  statValue,
  themeWindow,
} from "../styles";
import {
  ColumnChart,
  HorizontalBars,
  ToneGauge,
} from "./plots";

type ThemeStatsProps = {
  digestId: string;
  sourceIds: string[];
};

export default function ThemeStats({ digestId, sourceIds }: ThemeStatsProps) {
  const [open, setOpen] = useState(false);
  const [bucket, setBucket] = useState<BucketExtra | null>(null);
  const [extras, setExtras] = useState<EventExtra[]>([]);
  const [loading, setLoading] = useState(false);

  const sourceKey = sourceIds.join(",");

  async function handleToggle() {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);
    setLoading(true);
    setBucket(null);
    setExtras([]);

    try {
      const [buckets, events] = await Promise.all([
        getBucketExtras([digestId]),
        getEventExtras(sourceKey ? sourceKey.split(",") : []),
      ]);
      setBucket(buckets[0] ?? null);
      setExtras(events);
    } catch {
      setBucket(null);
      setExtras([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div css={related}>
      <button
        type="button"
        css={relatedToggle}
        aria-expanded={open}
        onClick={() => {
          void handleToggle();
        }}
      >
        <span css={relatedHeading}>Coverage statistics</span>
        <span css={[chevron, open ? chevronOpen : undefined]}>▾</span>
      </button>
      {open ? (
        loading ? (
          <p css={themeWindow}>Loading statistics…</p>
        ) : (
          <StatsBody
            bucket={bucket}
            extras={extras}
            sourceCount={sourceIds.length}
          />
        )
      ) : null}
    </div>
  );
}

function StatsBody({
  bucket,
  extras,
  sourceCount,
}: {
  bucket: BucketExtra | null;
  extras: EventExtra[];
  sourceCount: number;
}) {
  if (!bucket && extras.length === 0) {
    return <p css={themeWindow}>No statistics for this digest.</p>;
  }

  const activity = bucket?.extra.activity;
  const relatedTopics = bucket?.extra.direction.related_topics ?? [];
  const tones = extras
    .map((item) => parseTone(item.extra.metadata?.tone_raw))
    .filter((tone): tone is NonNullable<typeof tone> => tone !== null);
  const averageTone = averageTones(tones);
  const people = uniqueNames(extras.flatMap((item) => splitNames(item.extra.metadata?.people)));
  const organizations = uniqueNames(
    extras.flatMap((item) => splitNames(item.extra.metadata?.organizations)),
  );
  const gdeltThemes = uniqueNames(
    extras.flatMap((item) => item.extra.metadata?.gdelt_themes ?? []),
  );
  const sources = uniqueNames(
    extras.map((item) => item.extra.source).filter((value): value is string => Boolean(value)),
  );

  return (
    <div css={statsSection}>
      <div css={statsGrid}>
        <article css={statCard}>
          <p css={statLabel}>Now</p>
          <p css={statValue}>{activity?.current_count ?? sourceCount}</p>
          <p css={statNote}>Tracked articles in this bucket</p>
        </article>
        <article css={statCard}>
          <p css={statLabel}>Previous</p>
          <p css={statValue}>{activity?.previous_count ?? "—"}</p>
          <p css={statNote}>Prior window</p>
        </article>
        <article css={statCard}>
          <p css={statLabel}>Change</p>
          <p css={statValue}>{formatChangeRatio(activity?.change_ratio)}</p>
          <p css={statNote}>{activity ? formatStatus(activity.status) : "No activity data"}</p>
        </article>
        <article css={statCard}>
          <p css={statLabel}>Word count</p>
          <p css={statValue}>{averageTone ? Math.round(averageTone.wordCount) : "—"}</p>
          <p css={statNote}>
            {people.length} people · {organizations.length} orgs
          </p>
        </article>
      </div>

      {bucket ? <p css={statNote}>{bucket.extra.direction.description}</p> : null}

      <div css={plotGrid}>
        {activity && activity.previous_count !== undefined ? (
          <div css={plotCard}>
            <h4 css={plotTitle}>Article volume</h4>
            <ColumnChart
              items={[
                {
                  label: "Prev",
                  value: activity.previous_count,
                  color: "#6b5e51",
                },
                {
                  label: "Now",
                  value: activity.current_count,
                  color: "#b0893e",
                },
              ]}
            />
          </div>
        ) : null}

        {relatedTopics.length > 0 ? (
          <div css={plotCard}>
            <h4 css={plotTitle}>Related topics</h4>
            <HorizontalBars
              items={relatedTopics.map((topic) => ({
                label: topic.name,
                value: Math.round(topic.similarity * 100),
                color: "#9c3b2d",
              }))}
              max={100}
              unit="%"
            />
          </div>
        ) : null}

        {averageTone ? (
          <div css={plotCard}>
            <h4 css={plotTitle}>GDELT tone</h4>
            <ToneGauge value={averageTone.tone} />
            <HorizontalBars
              items={[
                { label: "Positive", value: averageTone.positive, color: "#0a5c26" },
                { label: "Negative", value: averageTone.negative, color: "#c41c1c" },
                { label: "Polarity", value: averageTone.polarity, color: "#b0893e" },
                { label: "Activity", value: averageTone.activity, color: "#4d5a63" },
              ]}
            />
          </div>
        ) : null}
      </div>

      {gdeltThemes.length > 0 || sources.length > 0 || people.length > 0 ? (
        <div css={plotCard}>
          <h4 css={plotTitle}>Entities & themes</h4>
          <div css={chipRow}>
            {sources.map((source) => (
              <span key={source} css={metaChip}>
                {source}
              </span>
            ))}
            {gdeltThemes.slice(0, 8).map((theme) => (
              <span key={theme} css={metaChip}>
                {formatThemeChip(theme)}
              </span>
            ))}
            {people.slice(0, 6).map((person) => (
              <span key={person} css={metaChip}>
                {person}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function uniqueNames(values: string[]) {
  return [...new Set(values)];
}

function formatThemeChip(theme: string) {
  return theme.replace(/^TAX_|^WB_\d+_|^UNGP_/, "").replace(/_/g, " ").toLowerCase();
}
