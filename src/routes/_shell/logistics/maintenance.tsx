import { Wrench } from "lucide-react";
import { validateFormWithZod } from "../../../lib/zodValidator";
import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenance, trucks as trucksApi } from "../../../api/logistics";
import { MaintenanceLogEntry } from "../../../types";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { Badge } from "../../../components/ui/Badge";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Modal } from "../../../components/ui/Modal";
import { FormField } from "../../../components/ui/FormField";
import { SelectField } from "../../../components/ui/SelectField";

export const Route = createFileRoute("/_shell/logistics/maintenance")({
  component: MaintenancePage,
});

const columns: Column<MaintenanceLogEntry>[] = [
  { key: "date", header: "Date", sortable: true },
  {
    key: "truckNo",
    header: "Truck No",
    sortable: true,
    render: (row: MaintenanceLogEntry) => (
      <span className="font-bold text-primary">{row.truckNo}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (row: MaintenanceLogEntry) => (
      <Badge status={row.type === "fuel" ? "active" : "maintenance"} />
    ),
  },
  {
    key: "cost",
    header: "Cost (₦)",
    sortable: true,
    render: (row: MaintenanceLogEntry) => `₦ ${row.cost.toLocaleString()}`,
  },
  {
    key: "odometerReading",
    header: "Odometer",
    render: (row: MaintenanceLogEntry) => `${row.odometerReading.toLocaleString()} km`,
  },
  { key: "notes", header: "Notes" },
];

const schema = z.object({
  truckNo: z.string().min(1, "Required"),
  type: z.enum(["fuel", "maintenance"]),
  date: z.string().min(1, "Required"),
  cost: z.number().positive("Must be > 0"),
  odometerReading: z.number().min(0, "Must be >= 0"),
  notes: z.string().optional(),
});

function MaintenancePage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["maintenance"],
    queryFn: maintenance.list,
  });

  const { data: trucks } = useQuery({
    queryKey: ["trucks"],
    queryFn: trucksApi.list,
  });

  const truckOptions = useMemo(() => {
    return (trucks || []).map((t) => ({
      label: t.truckNo,
      value: t.truckNo,
    }));
  }, [trucks]);

  const filteredData =
    data?.filter((row) => {
      const matchesSearch = row.truckNo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "All" || row.type === typeFilter;
      return matchesSearch && matchesType;
    }) || [];

  const totalCost = filteredData.reduce((acc, row) => acc + row.cost, 0);
  const fuelCost = filteredData
    .filter((r) => r.type === "fuel")
    .reduce((acc, row) => acc + row.cost, 0);
  const maintenanceCost = filteredData
    .filter((r) => r.type === "maintenance")
    .reduce((acc, row) => acc + row.cost, 0);

  const mutation = useMutation({
    mutationFn: (payload: Omit<MaintenanceLogEntry, "id">) =>
      maintenance.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setIsModalOpen(false);
    },
    onError: () => {
      setErrorMsg("Failed to save record. Please try again.");
    },
  });



  const form = useForm({
    defaultValues: {
      truckNo: "",
      type: "fuel" as "fuel" | "maintenance",
      date: "",
      cost: 0,
      odometerReading: 0,
      notes: "",
    },
    validators: {
      onChange: validateFormWithZod(schema),
    },
    onSubmit: async ({ value }) => {
      setErrorMsg("");
      await mutation.mutateAsync(value);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header tracking-tight text-primary">
            Fleet Maintenance & Fuel
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Track operational expenses and repair logs for all trucks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-text-inverse px-4 py-2 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light"
        >
          Log Expense
        </button>
      </div>

      {/* Summary Strip & Filters */}
      <div className="panel p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">
              Total Expense
            </div>
            <div className="text-lg font-bold text-primary">
              ₦ {totalCost.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">
              Fuel Costs
            </div>
            <div className="text-lg font-bold text-status-warning">
              ₦ {fuelCost.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-text-muted font-header">
              Repairs
            </div>
            <div className="text-lg font-bold text-status-danger">
              ₦ {maintenanceCost.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search truck no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-surface-border rounded bg-surface-muted focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="fuel">Fuel</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="panel-table flex flex-col flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          isLoading={isLoading}
          emptyMessage={
            searchTerm || typeFilter !== "All"
              ? "We couldn't find any logs matching your current filters. Try adjusting your search criteria."
              : "There are currently no expense records. Log the first fuel or maintenance expense."
          }
          emptyIcon={<Wrench size={48} className="text-surface-border/50" />}
          actions={
            !searchTerm &&
            typeFilter === "All" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
              >
                Log Expense
              </button>
            )
          }
        />
        {/*
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-surface-border border-t-primary rounded-full animate-spin"></div>
            <div className="text-sm font-medium text-text-muted">Loading maintenance logs...</div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-surface-border border-b border-surface-border">
            <thead className="bg-surface-muted">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 text-left text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider border-b border-surface-border font-header">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-surface divide-y divide-surface-border text-sm">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-surface-active/60 transition-colors group cursor-pointer">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-text-primary border-b border-surface-border/50">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Wrench size={48} className="text-surface-border/50 mb-2" strokeWidth={1.5} />
                      <h3 className="text-base font-bold text-primary font-header">No maintenance logs found</h3>
                      <p className="text-sm text-text-muted max-w-sm">
                        {searchTerm || typeFilter !== 'All' 
                          ? "We couldn't find any logs matching your current filters. Try adjusting your search criteria."
                          : "There are currently no expense records. Log the first fuel or maintenance expense."}
                      </p>
                      {(!searchTerm && typeFilter === 'All') && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover border border-primary px-4 py-2 rounded transition-colors"
                        >
                          Log Expense
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )} */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Maintenance Log"
      >
        {errorMsg && (
          <div className="mb-4 text-sm bg-status-danger/10 border border-status-error/20 text-status-danger font-medium p-2 rounded">
            {errorMsg}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="truckNo"
            children={(field) => (
              <SelectField
                field={field as any}
                label="Truck No"
                options={truckOptions}
              />
            )}
          />

          <form.Field
            name="type"
            children={(field) => (
              <SelectField
                field={field as any}
                label="Type"
                options={[
                  { label: "Fuel", value: "fuel" },
                  { label: "Maintenance", value: "maintenance" },
                ]}
              />
            )}
          />

          <form.Field
            name="date"
            children={(field) => (
              <FormField field={field as any} label="Date" type="date" />
            )}
          />
          <form.Field
            name="cost"
            children={(field) => (
              <FormField field={field as any} label="Cost" type="number" />
            )}
          />
          <form.Field
            name="odometerReading"
            children={(field) => (
              <FormField
                field={field as any}
                label="Odometer Reading"
                type="number"
              />
            )}
          />
          <form.Field
            name="notes"
            children={(field) => (
              <FormField field={field as any} label="Notes (Optional)" />
            )}
          />

          <div className="flex justify-end pt-4 border-t border-surface-border gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-secondary hover:bg-surface-active border border-surface-border rounded transition-colors"
            >
              Cancel
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="px-3 py-1.5 text-xs font-bold font-header uppercase tracking-wider text-text-inverse bg-primary hover:bg-primary-hover rounded shadow-sm border border-primary-light disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Logging..." : "Log Maintenance"}
                </button>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
