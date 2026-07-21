import React, { useState, useMemo } from "react";
import clsx from "clsx";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: keyof T | string;
  header: string;
  /** Custom render function. Receives the row and returns a ReactNode. */
  render?: (row: T) => React.ReactNode;
  /** Whether this column is sortable. Default false. */
  sortable?: boolean;
  /** Tailwind width class, e.g. 'w-32' */
  width?: string;
  /** Alignment. Default 'left'. */
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Key used to uniquely identify each row */
  rowKey: keyof T;
  /** Placeholder when data is empty */
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  /** Show search bar above the table */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Keys to include in search (defaults to all string/number fields) */
  searchKeys?: (keyof T)[];
  /** Rows per page. Set to 0 to disable pagination. Default 20. */
  pageSize?: number;
  /** Slot for action buttons rendered top-right of the table */
  actions?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri} className="animate-pulse">
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} className="px-3 py-3 border-b border-surface-border">
              <div className="h-4 bg-surface-active rounded-sm w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({
  message,
  icon,
}: {
  message: string;
  icon?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={999}>
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
          {icon && <span className="opacity-40 text-4xl">{icon}</span>}
          <p className="text-sm font-medium">{message}</p>
        </div>
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  emptyMessage = "No records found",
  emptyIcon,
  searchable = false,
  searchPlaceholder = "Search…",
  searchKeys,
  pageSize = 20,
  actions,
  isLoading = false,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);

  // ── Search ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    const keys = searchKeys ?? (Object.keys(data[0] ?? {}) as (keyof T)[]);
    return data.filter((row) =>
      keys.some((k) =>
        String(row[k] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, query, searchKeys]);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const paged =
    pageSize > 0
      ? sorted.slice((page - 1) * pageSize, page * pageSize)
      : sorted;

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") {
      setSortDir("desc");
      return;
    }
    setSortKey(null);
    setSortDir(null);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey)
      return <ChevronsUpDown size={13} className="opacity-30" />;
    if (sortDir === "asc")
      return <ChevronUp size={13} className="text-primary" />;
    return <ChevronDown size={13} className="text-primary" />;
  };

  return (
    <div className={clsx("card flex flex-col overflow-hidden", className)}>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      {(searchable || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border-b border-surface-border">
          {searchable && (
            <div className="relative max-w-xs w-full">
              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-surface-base border border-surface-border rounded-sm
                           text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                           transition-colors"
              />
            </div>
          )}
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto flex-1">
        <table className="table-base">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === String(col.key);
                const ariaSortVal = !col.sortable
                  ? undefined
                  : isSorted
                    ? sortDir === "asc"
                      ? "ascending"
                      : sortDir === "desc"
                        ? "descending"
                        : "none"
                    : "none";

                return (
                  <th
                    key={String(col.key)}
                    tabIndex={col.sortable ? 0 : undefined}
                    role={col.sortable ? "columnheader" : undefined}
                    aria-sort={ariaSortVal}
                    className={clsx(
                      col.width,
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.sortable &&
                        "cursor-pointer select-none hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm transition-colors",
                    )}
                    onClick={
                      col.sortable
                        ? () => handleSort(String(col.key))
                        : undefined
                    }
                    onKeyDown={
                      col.sortable
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSort(String(col.key));
                            }
                          }
                        : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && <SortIcon colKey={String(col.key)} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody aria-live="polite" aria-relevant="all">
            {isLoading ? (
              <TableSkeleton cols={columns.length} />
            ) : paged.length === 0 ? (
              <EmptyState message={emptyMessage} icon={emptyIcon} />
            ) : (
              paged.map((row) => (
                <tr key={String(row[rowKey])} className="group">
                  {columns.map((col) => {
                    const raw = row[col.key as keyof T];
                    const tooltipText = typeof raw === "string" || typeof raw === "number" ? String(raw) : undefined;
                    return (
                      <td
                        key={String(col.key)}
                        title={tooltipText}
                        className={clsx(
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                          "min-w-0 truncate",
                        )}
                      >
                        {col.render ? col.render(row) : String(raw ?? "—")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────────────────────────────────── */}
      {pageSize > 0 && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-surface-border text-xs text-text-muted">
          <span aria-live="polite" className="font-medium">
            {sorted.length === 0
              ? "0"
              : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sorted.length)}`}{" "}
            of {sorted.length} records
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2 rounded-sm hover:bg-surface-active disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 font-semibold text-text-primary select-none">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2 rounded-sm hover:bg-surface-active disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
