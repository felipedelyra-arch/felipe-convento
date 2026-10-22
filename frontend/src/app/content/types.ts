export type Mode = 'dev' | 'sec';

export interface Link {
  label: string;
  href: string;
  icon?: string;
}

export interface Tech {
  name: string;
  /** Key in core/icon.ts; omitted when the brand has no published mark. */
  icon?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Short context line: who it is for and what it is. */
  kind: string;
  status: 'live' | 'building' | 'scope';
  /** Verified status, shown as written. */
  statusLabel: string;
  /** What it is and what I did, in my own words. */
  text: string;
  /** Optional extras worth reading first. */
  points: string[];
  /** Primary link (verified). Omitted when there is no public destination. */
  link?: Link;
  details: string[];
  stack: Tech[];
  media?: 'keyhound-cli' | 'pandavip' | 'mercadog' | 'labsoc';
}

/** lab = done in my own lab, practice = applied in real projects, study = in progress. */
export type SkillLevel = 'lab' | 'practice' | 'study';

export interface SkillGroup {
  title: string;
  /** What the area means in practice, one sentence. */
  desc: string;
  items: { name: string; level: SkillLevel; icon?: string }[];
}

export interface StackGroup {
  title: string;
  items: Tech[];
}

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  kind: 'work' | 'degree' | 'course';
  status: 'done' | 'ongoing';
  note?: string;
}
