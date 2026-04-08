export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export type QueueItem = {
  id: string;
  status: "SUCCESS" | "FAILED" | "PENDING" | "IN_PROGRESS";
  domain: string;
  failureReason?: string;
  createdAt: string;
  updatedAt?: string;
};

export interface ProcessActivity {
  total: number;
  contacted: number;
  failed: number;
  queue: QueueItem[] | null;
  page: number;
  setPage(page: number): void;
  setQueue(queue: QueueItem[]): void;
}

export type StatsData = {
  total: number;
  successful: number;
  failed: number;
  contacted: number;
  recentActivity: QueueItem[];
};

export type HistoryResponse = {
  message: string;
  data: {
    queue: QueueItem[];
    total: number;
  };
};
