"use client";

import {
  article,
  articleDate,
  articleLink,
  articleList,
  articleMeta,
  articleRelevance,
  articleSummary,
  articleTitle,
} from "../styles";
import {
  formatLocalTimestamp,
  formatSimilarity,
  relevanceColor,
  type EventItem,
} from "../data";

type RelatedArticlesProps = {
  events: EventItem[];
  theme: string;
};

export default function RelatedArticles({
  events,
  theme,
}: RelatedArticlesProps) {
  return (
    <div css={articleList}>
      {events.map((event) => {
        const score = event.similarities[theme];

        return (
          <article key={event.id} css={article}>
            <h4 css={articleTitle}>{event.name}</h4>
            <div css={articleMeta}>
              <p css={articleDate}>{formatLocalTimestamp(event.timestamp)}</p>
              <p
                css={articleRelevance}
                style={{ color: relevanceColor(score) }}
                title={`${theme} relevant`}
              >
                Relevance Score : {formatSimilarity(score)}
              </p>
            </div>
            <p css={articleSummary}>{event.summary}</p>
            <a
              css={articleLink}
              href={event.article_url}
              target="_blank"
              rel="noreferrer"
            >
              Link{event.source ? ` · ${event.source}` : ""}
            </a>
          </article>
        );
      })}
    </div>
  );
}
