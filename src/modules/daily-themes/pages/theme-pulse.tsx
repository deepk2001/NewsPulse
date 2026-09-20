"use client";

import { useEffect, useState } from "react";
import { getBucketExtras, getDigests } from "../api";
import {
  digestHasArticles,
  formatChangeRatio,
  pickDigest,
  relevanceColor,
  type BucketExtra,
  type ThemeOption,
} from "../data";
import {
  plotCaption,
  pulseChart,
  pulseHeader,
  pulseSection,
  pulseTitle,
  themeWindow,
} from "../styles";
import { HorizontalBars } from "./plots";

type ThemePulseProps = {
  themes: ThemeOption[];
  selectedDate: string;
};

export default function ThemePulse({ themes, selectedDate }: ThemePulseProps) {
  const [extras, setExtras] = useState<BucketExtra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (themes.length === 0) {
      setExtras([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPulse() {
      setLoading(true);
      setExtras([]);

      try {
        const digests = await getDigests(themes.map((theme) => theme.id));
        const matched = themes.flatMap((theme) => {
          const digest = pickDigest(
            digests.filter((item) => item.theme === theme.id),
            selectedDate,
          );
          return digestHasArticles(digest) && digest ? [digest] : [];
        });
        const nextExtras = await getBucketExtras(matched.map((digest) => digest.id));

        if (!cancelled) {
          setExtras(nextExtras);
        }
      } catch {
        if (!cancelled) {
          setExtras([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPulse();

    return () => {
      cancelled = true;
    };
  }, [themes, selectedDate]);

  const items = extras
    .filter((item) => item.extra.activity.current_count > 0)
    .map((item) => ({
      label: item.extra.name,
      value: item.extra.activity.current_count,
      color: relevanceColor(normalizeChange(item.extra.activity.change_ratio)),
    }));
  const maxCount = Math.max(...items.map((item) => item.value), 1);

  return (
    <section css={pulseSection} aria-label="Theme coverage pulse">
      <div css={pulseHeader}>
        <h2 css={pulseTitle}>Coverage pulse</h2>
        <p css={plotCaption}>Article volume, colored by change</p>
      </div>
      {loading ? (
        <p css={themeWindow}>Loading coverage pulse…</p>
      ) : items.length === 0 ? (
        <p css={themeWindow}>No coverage data available.</p>
      ) : (
        <>
          <div css={pulseChart}>
            <HorizontalBars items={items} max={maxCount} layout="wide" />
          </div>
          <p css={plotCaption}>
            {extras
              .filter((item) => item.extra.activity.current_count > 0)
              .map((item) => {
                const change = formatChangeRatio(item.extra.activity.change_ratio);
                return `${item.extra.name} ${change}`;
              })
              .join(" · ")}
          </p>
        </>
      )}
    </section>
  );
}

function normalizeChange(ratio: number | undefined) {
  if (ratio === undefined) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, 0.5 + ratio));
}
