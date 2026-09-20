"use client";

import { useState } from "react";
import {
  chevron,
  chevronOpen,
  related,
  relatedHeading,
  relatedToggle,
  themeCopy,
  themeMenu,
  themeMenuItem,
  themeMenuItemSelected,
  themePanel,
  themePicker,
  themeSummary,
  themeWindow,
} from "../styles";
import { type Digest, type EventItem, type ThemeOption } from "../data";
import { getEvents } from "../api";
import RelatedArticles from "./related-articles";
import ThemeStats from "./theme-stats";

type ThemeMenuProps = {
  themes: ThemeOption[];
  selectedThemeId: string;
  digest: Digest | null;
  loading: boolean;
  onSelect: (id: string) => void;
};

export default function ThemeMenu({
  themes,
  selectedThemeId,
  digest,
  loading,
  onSelect,
}: ThemeMenuProps) {
  return (
    <section css={themePicker}>
      <div css={themeMenu} role="tablist" aria-label="Themes">
        {themes.map((theme) => {
          const selected = theme.id === selectedThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              role="tab"
              css={[themeMenuItem, selected ? themeMenuItemSelected : undefined]}
              aria-selected={selected}
              onClick={() => onSelect(theme.id)}
            >
              {theme.label}
            </button>
          );
        })}
      </div>
      <div css={themePanel} role="tabpanel">
        {loading ? (
          <p css={themeWindow}>Loading digest…</p>
        ) : digest ? (
          <>
            <div css={themeCopy}>
              <p css={themeSummary}>{digest.summary}</p>
            </div>
            <ThemeStats
              key={`${selectedThemeId}:${digest.id}`}
              digestId={digest.id}
              sourceIds={digest.sources}
            />
            <RelatedArticlesDropdown
              key={`${selectedThemeId}:${digest.id}:articles`}
              digest={digest}
            />
          </>
        ) : (
          <p css={themeWindow}>
            {themes.length === 0
              ? "No themes available."
              : "No digest for this theme on the selected date."}
          </p>
        )}
      </div>
    </section>
  );
}

function RelatedArticlesDropdown({ digest }: { digest: Digest }) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  async function handleToggleRelated() {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);
    setEventsLoading(true);
    setEvents([]);

    try {
      const result = await getEvents(digest.sources);
      setEvents(result);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  return (
    <div css={related}>
      <button
        type="button"
        css={relatedToggle}
        aria-expanded={open}
        onClick={() => {
          void handleToggleRelated();
        }}
      >
        <span css={relatedHeading}>Related Articles</span>
        <span css={[chevron, open ? chevronOpen : undefined]}>▾</span>
      </button>
      {open ? (
        eventsLoading ? (
          <p css={themeWindow}>Loading articles…</p>
        ) : events.length === 0 ? (
          <p css={themeWindow}>No events in this digest.</p>
        ) : (
          <RelatedArticles events={events} theme={digest.theme} />
        )
      ) : null}
    </div>
  );
}
