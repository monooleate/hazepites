import { ComponentChildren } from "preact";

interface TimelineEvent {
  date: string;
  title: string;
  desc?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  title?: string;
}

export default function Timeline({ events, title }: TimelineProps) {
  return (
    <div class="mdx-timeline">
      {title && <div class="mdx-timeline-title">{title}</div>}
      <div class="mdx-timeline-track">
        {events.map((event, i) => (
          <div class="mdx-timeline-event" key={i}>
            <div class="mdx-timeline-marker">
              <div class="mdx-timeline-dot" />
              {i < events.length - 1 && <div class="mdx-timeline-line" />}
            </div>
            <div class="mdx-timeline-content">
              <span class="mdx-timeline-date">{event.date}</span>
              <strong class="mdx-timeline-event-title">{event.title}</strong>
              {event.desc && <p class="mdx-timeline-desc">{event.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
