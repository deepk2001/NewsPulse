"use client";

import { useEffect, useState } from "react";
import {
  brand,
  controlGroup,
  controls,
  dateInput,
  label,
  masthead,
  mastheadMeta,
  page,
  sectionIntro,
  sectionNote,
  sectionTitle,
  shell,
  title,
} from "./styles";
import {
  formatHeadingDate,
  getThemeLabel,
  getTodayIsoDate,
  themeDigestsForDate,
  type Digest,
  type ThemeOption,
} from "./data";
import { dailyDigestsIcsUrl, getDigests, getThemes } from "./api";
import ThemeMenu from "./pages/theme-menu";
import ThemePulse from "./pages/theme-pulse";
import CalendarReminder from "./pages/calendar-reminder";

export default function DailyThemes() {
  const today = getTodayIsoDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [allThemes, setAllThemes] = useState<ThemeOption[]>([]);
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [activeThemeId, setActiveThemeId] = useState("");
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([]);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  );
  const [digestByTheme, setDigestByTheme] = useState<Record<string, Digest>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadThemes() {
      try {
        const nextThemes = await getThemes();

        if (cancelled) {
          return;
        }

        setAllThemes(nextThemes);

        if (nextThemes.length === 0) {
          setThemes([]);
          setActiveThemeId("");
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setAllThemes([]);
          setThemes([]);
          setActiveThemeId("");
          setLoading(false);
        }
      }
    }

    void loadThemes();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (allThemes.length === 0) {
      return;
    }

    let cancelled = false;

    async function filterEmptyBuckets() {
      setLoading(true);

      try {
        const digests = await getDigests(allThemes.map((theme) => theme.id));
        const matched = themeDigestsForDate(allThemes, digests, selectedDate);
        const visible = matched.map((item) => item.theme);
        const nextDigests = Object.fromEntries(
          matched.map((item) => [item.theme.id, item.digest]),
        );

        if (cancelled) {
          return;
        }

        setThemes(visible);
        setDigestByTheme(nextDigests);
        setSelectedThemeIds((current) =>
          current.filter((id) => visible.some((theme) => theme.id === id)),
        );
        setActiveThemeId((current) =>
          visible.some((theme) => theme.id === current)
            ? current
            : (visible[0]?.id ?? ""),
        );
      } catch {
        if (!cancelled) {
          setThemes([]);
          setDigestByTheme({});
          setActiveThemeId("");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void filterEmptyBuckets();

    return () => {
      cancelled = true;
    };
  }, [allThemes, selectedDate]);

  function handleDateChange(nextDate: string) {
    setSelectedDate(nextDate);
    setThemes([]);
    setDigestByTheme({});
    setActiveThemeId("");
    setLoading(true);
    setConfirmationMessage(null);
  }

  function handleToggleTheme(id: string) {
    setSelectedThemeIds((current) =>
      current.includes(id)
        ? current.filter((themeId) => themeId !== id)
        : [...current, id],
    );
  }

  function handleSubscribe() {
    const names = themes
      .filter((theme) => selectedThemeIds.includes(theme.id))
      .map((theme) => theme.label);

    window.open(
      dailyDigestsIcsUrl(selectedThemeIds),
      "_blank",
      "noopener,noreferrer",
    );
    setConfirmationMessage(
      `Subscribed to a daily digest for ${names.join(", ")}.`,
    );
  }

  return (
    <main css={page}>
      <div css={shell}>
        <header css={masthead}>
          <div css={brand}>
            <h1 css={title}>News Pulse</h1>
          </div>
          <p css={mastheadMeta}>
            Theme-by-theme digests of today’s news, redrawn every morning.
          </p>
        </header>

        <div css={controls}>
          <div css={controlGroup}>
            <label css={label} htmlFor="digest-date">
              Date selector
            </label>
            <input
              css={dateInput}
              id="digest-date"
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => handleDateChange(event.target.value)}
            />
          </div>
          <div css={sectionIntro}>
            <h2 css={sectionTitle}>
              {selectedDate === today
                ? "Pulse of the Day"
                : `Pulse of ${formatHeadingDate(selectedDate)}`}
            </h2>
            <p css={sectionNote}>
              Updates every day 8:00 am EST 
            </p>
          </div>
        </div>

        <ThemeMenu
          themes={themes}
          selectedThemeId={activeThemeId}
          digest={digestByTheme[activeThemeId] ?? null}
          loading={loading}
          onSelect={setActiveThemeId}
        />

        <ThemePulse themes={themes} selectedDate={selectedDate} />

        <CalendarReminder
          themes={themes}
          selectedThemeIds={selectedThemeIds}
          dailyDigest={dailyDigest}
          confirmationMessage={confirmationMessage}
          onToggleTheme={handleToggleTheme}
          onToggleDigest={() => setDailyDigest((value) => !value)}
          onSubscribe={handleSubscribe}
        />
      </div>
    </main>
  );
}
