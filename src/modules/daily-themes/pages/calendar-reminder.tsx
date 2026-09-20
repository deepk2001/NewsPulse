"use client";

import {
  checkbox,
  chip,
  chipSelected,
  confirmation,
  digestRow,
  pickLabel,
  reminder,
  reminderTitle,
  subscribe,
  themePicks,
} from "../styles";
import type { ThemeOption } from "../data";

type CalendarReminderProps = {
  themes: ThemeOption[];
  selectedThemeIds: string[];
  dailyDigest: boolean;
  confirmationMessage: string | null;
  onToggleTheme: (id: string) => void;
  onToggleDigest: () => void;
  onSubscribe: () => void;
};

export default function CalendarReminder({
  themes,
  selectedThemeIds,
  dailyDigest,
  confirmationMessage,
  onToggleTheme,
  onToggleDigest,
  onSubscribe,
}: CalendarReminderProps) {
  const canSubscribe = selectedThemeIds.length > 0 && dailyDigest;

  return (
    <section css={reminder}>
      <h2 css={reminderTitle}>Set up a calendar reminder</h2>
      <div css={themePicks}>
        <span css={pickLabel}>Pick your themes</span>
        {themes.map((theme) => {
          const selected = selectedThemeIds.includes(theme.id);
          return (
            <button
              key={theme.id}
              type="button"
              css={[chip, selected ? chipSelected : undefined]}
              aria-pressed={selected}
              onClick={() => onToggleTheme(theme.id)}
            >
              {theme.label}
            </button>
          );
        })}
      </div>
      <label css={digestRow}>
        <input
          css={checkbox}
          type="checkbox"
          checked={dailyDigest}
          onChange={onToggleDigest}
        />
        Daily themes digest
      </label>
      <button
        type="button"
        css={subscribe}
        disabled={!canSubscribe}
        onClick={onSubscribe}
      >
        Subscribe
      </button>
      {confirmationMessage ? (
        <p css={confirmation} role="status">
          {confirmationMessage}
        </p>
      ) : null}
    </section>
  );
}
