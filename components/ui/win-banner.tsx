import { PartyPopper } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  /** Secondary line, e.g. "Completed in 12 moves and 1:04". */
  detail?: ReactNode;
}

/** End-of-game banner shared by matching, word search and hide & seek. */
function WinBanner({ title, detail }: Props) {
  return (
    <div
      role="status"
      className="mb-6 rounded-card border border-success/30 bg-success/10 p-5 text-center"
    >
      <p className="mb-1 inline-flex items-center gap-2 text-2xl font-bold text-success">
        <PartyPopper aria-hidden className="h-6 w-6" />
        {title}
      </p>
      {detail && <p className="text-text-muted">{detail}</p>}
    </div>
  );
}

export default WinBanner;
