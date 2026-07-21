import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { ScanFace, UserCheck, UserMinus } from "lucide-react";

import { attendance } from "../../../api/core";
import { Button } from "../../../components/ui/Button";

export const Route = createFileRoute("/_shell/security/attendance-scanner")({
  component: AttendanceScannerPage,
});

function AttendanceScannerPage() {
  const [scanInput, setScanInput] = useState("");
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount to allow barcode scanner devices to work seamlessly
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const mutation = useMutation({
    mutationFn: attendance.scan,
    onSuccess: (data: any) => {
      setStatusMsg({
        type: "success",
        text: `Successfully clocked ${data.action.toUpperCase()} for ${data.staffName} at ${new Date(data.time).toLocaleTimeString()}`,
      });
      setScanInput("");
      inputRef.current?.focus();
    },
    onError: (error: any) => {
      setStatusMsg({ type: "error", text: error.message || "Scan failed" });
      setScanInput("");
      inputRef.current?.focus();
    },
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    setStatusMsg(null);
    mutation.mutate(scanInput.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ScanFace size={22} className="text-primary opacity-80" />
            Attendance Scanner
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Scan Staff ID or Barcode to clock in/out
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border/40 rounded-xl p-8 max-w-xl mx-auto shadow-sm">
        <form onSubmit={handleScan} className="space-y-6 text-center">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Scan or Enter Staff ID
            </label>
            <input
              ref={inputRef}
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="w-full text-center text-2xl tracking-widest font-mono p-4 rounded-lg bg-background border border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="e.g. 5f8d0a..."
              autoComplete="off"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            size="md"
            isLoading={mutation.isPending}
            className="w-full py-4 text-lg shadow-md"
          >
            Process Scan
          </Button>

          {statusMsg && (
            <div
              className={`p-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
                statusMsg.type === "success"
                  ? "bg-success/10 text-success-foreground"
                  : "bg-danger/10 text-danger-foreground"
              }`}
            >
              {statusMsg.type === "success" ? (
                statusMsg.text.includes("IN") ? (
                  <UserCheck size={20} />
                ) : (
                  <UserMinus size={20} />
                )
              ) : null}
              {statusMsg.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
