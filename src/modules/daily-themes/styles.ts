import { css } from "@emotion/react";

export const page = css`
  min-height: 100vh;
  padding: 32px 20px 80px;
  background:
    radial-gradient(circle at top left, rgba(176, 137, 62, 0.12), transparent 32%),
    linear-gradient(180deg, #f6f1e8 0%, #efe6d8 100%);
  color: #171410;
  font-family: var(--font-sans), "Source Sans 3", system-ui, sans-serif;
`;

export const shell = css`
  width: min(960px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 28px;
`;

export const masthead = css`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 3px solid #171410;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: start;
  }
`;

export const brand = css`
  display: grid;
  gap: 4px;
`;

export const kicker = css`
  margin: 0;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 700;
  color: #9c3b2d;
`;

export const title = css`
  margin: 0;
  font-family: var(--font-serif), Fraunces, Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 650;
  letter-spacing: -0.04em;
  line-height: 0.95;
`;

export const mastheadMeta = css`
  margin: 0;
  max-width: 220px;
  text-align: right;
  font-size: 0.88rem;
  line-height: 1.35;
  color: #4d5a63;

  @media (max-width: 720px) {
    text-align: left;
  }
`;

export const controls = css`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
`;

export const controlGroup = css`
  display: grid;
  gap: 8px;
`;

export const label = css`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5b5046;
`;

export const dateInput = css`
  height: 44px;
  padding: 0 12px;
  border: 1.5px solid #171410;
  background: #fffaf3;
  color: #171410;
  font: inherit;
  font-size: 1rem;
  box-shadow: 3px 3px 0 #171410;
`;

export const sectionIntro = css`
  display: grid;
  gap: 4px;
  min-width: 0;
  max-width: min(420px, 100%);
`;

export const sectionTitle = css`
  margin: 0;
  font-family: var(--font-serif), Fraunces, Georgia, serif;
  font-size: 1.7rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const sectionNote = css`
  margin: 0;
  color: #5b5046;
  font-size: 0.95rem;
`;

export const themePicker = css`
  display: grid;
  gap: 0;
`;

export const themeMenu = css`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 4px;
  background: #171410;
  scrollbar-width: thin;
`;

export const themeMenuItem = css`
  flex: 1 0 auto;
  min-height: 46px;
  padding: 0 18px;
  border: 0;
  background: transparent;
  color: #f6f1e8;
  font: inherit;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: rgba(246, 241, 232, 0.12);
  }

  &:focus-visible {
    outline: 2px solid #b0893e;
    outline-offset: -2px;
  }
`;

export const themeMenuItemSelected = css`
  background: #fffaf3;
  color: #171410;
  font-weight: 800;
`;

export const themePanel = css`
  display: grid;
  gap: 20px;
  padding: 22px;
  background: #fffaf3;
  border: 1.5px solid #171410;
  border-top: 0;
`;

export const themeCopy = css`
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
`;

export const themeSummary = css`
  margin: 0;
  font-family: var(--font-serif), Fraunces, Georgia, serif;
  font-size: 1.12rem;
  line-height: 1.45;
  text-align: justify;
`;

export const themeWindow = css`
  margin: 0;
  color: #5b5046;
  font-size: 0.92rem;
`;

export const related = css`
  border-top: 1px solid #d9cfc0;
  padding-top: 12px;
`;

export const relatedHeading = css`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const relatedToggle = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0 8px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #b0893e;
    outline-offset: 4px;
  }
`;

export const chevron = css`
  display: inline-block;
  font-size: 1rem;
  transition: transform 160ms ease;
`;

export const chevronOpen = css`
  transform: rotate(180deg);
`;

export const articleList = css`
  display: grid;
  gap: 10px;
  padding: 8px 0 6px;
`;

export const article = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 6px 16px;
  min-width: 0;
  padding-top: 12px;
  border-top: 1px dashed #d0c4b2;
`;

export const articleTitle = css`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
`;

export const articleDate = css`
  margin: 0;
  color: #6b5e51;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

export const articleMeta = css`
  display: grid;
  justify-items: end;
  align-content: start;
  gap: 4px;
`;

export const articleRelevance = css`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
`;

export const articleSummary = css`
  margin: 0;
  grid-column: 1 / -1;
  color: #3d352d;
  line-height: 1.4;
  text-align: justify;
`;

export const articleLink = css`
  grid-column: 1 / -1;
  width: fit-content;
  color: #9c3b2d;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: #171410;
  }
`;

export const emptyState = css`
  padding: 28px;
  border: 1.5px dashed #171410;
  background: rgba(255, 250, 243, 0.7);
`;

export const reminder = css`
  display: grid;
  gap: 18px;
  padding: 24px;
  background: #171410;
  color: #f6f1e8;
`;

export const reminderTitle = css`
  margin: 0;
  font-family: var(--font-serif), Fraunces, Georgia, serif;
  font-size: 1.8rem;
`;

export const themePicks = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

export const pickLabel = css`
  margin-right: 6px;
  font-size: 0.9rem;
`;

export const chip = css`
  min-height: 38px;
  padding: 0 14px;
  border: 1.5px solid #f6f1e8;
  background: transparent;
  color: #f6f1e8;
  font: inherit;
  cursor: pointer;
`;

export const chipSelected = css`
  background: #b0893e;
  border-color: #b0893e;
  color: #171410;
  font-weight: 700;
`;

export const digestRow = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
`;

export const checkbox = css`
  width: 18px;
  height: 18px;
  accent-color: #b0893e;
`;

export const subscribe = css`
  justify-self: start;
  min-height: 52px;
  padding: 0 28px;
  border: 0;
  background: #b0893e;
  color: #171410;
  font: inherit;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0 #9c3b2d;

  &:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 #9c3b2d;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const confirmation = css`
  margin: 0;
  padding: 10px 12px;
  background: #2a2622;
  color: #f6f1e8;
  font-size: 0.95rem;
`;

export const statsSection = css`
  display: grid;
  gap: 16px;
  padding-top: 4px;
`;

export const statsHeading = css`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const statsGrid = css`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const statCard = css`
  display: grid;
  gap: 4px;
  min-width: 0;
  padding: 12px;
  border: 1.5px solid #171410;
  background: #f6f1e8;
`;

export const statLabel = css`
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5b5046;
`;

export const statValue = css`
  margin: 0;
  font-family: var(--font-serif), Fraunces, Georgia, serif;
  font-size: 1.45rem;
  font-weight: 650;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
`;

export const statNote = css`
  margin: 0;
  color: #5b5046;
  font-size: 0.82rem;
  line-height: 1.35;
`;

export const plotGrid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const plotCard = css`
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1.5px solid #171410;
  background: #fffaf3;
`;

export const plotTitle = css`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const plotCaption = css`
  margin: 0;
  min-width: 0;
  color: #5b5046;
  font-size: 0.82rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const chartFrame = css`
  width: 100%;
  overflow: visible;
  display: block;
`;

export const chipRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const metaChip = css`
  padding: 4px 8px;
  border: 1px solid #171410;
  background: #f6f1e8;
  font-size: 0.78rem;
`;

export const pulseSection = css`
  display: grid;
  gap: 12px;
  padding: 18px 22px;
  background: #fffaf3;
  border: 1.5px solid #171410;
`;

export const pulseHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  min-width: 0;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: start;
    gap: 2px;
  }
`;

export const pulseTitle = css`
  margin: 0;
  min-width: 0;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const pulseChart = css`
  width: 100%;
  line-height: 0;

  svg {
    width: 100%;
    height: auto;
    max-height: 180px;
  }
`;

export const barLabel = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6b5e51;
  font-size: 11px;
  line-height: 20px;
  font-family: inherit;
`;
