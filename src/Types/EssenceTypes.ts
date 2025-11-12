import type { ReactNode } from 'react';

export interface Milestone {
  year: string;
  icon: ReactNode;
  title: string;
  desc: string;
}

export interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
}
