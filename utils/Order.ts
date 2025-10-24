import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  const styles = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    PREPARING:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    READY:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    DELIVERED: "bg-muted text-muted-foreground",
    COMPLETED: "bg-muted text-muted-foreground",
  } as const;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status as keyof typeof styles] || styles.PENDING
      }`}
    >
      {status}
    </span>
  );
});

StatusBadge.displayName = "StatusBadge";
