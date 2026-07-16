import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { labourers } from '../../../api/security'
import { LabourerLogEntry } from '../../../types'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

export const Route = createFileRoute('/_shell/security/labourers-log')({
  component: LabourersLogPage,
})

const columnHelper = createColumnHelper<LabourerLogEntry>()

const columns = [
  columnHelper.accessor('labourerName', { header: 'Labourer Name' }),
  columnHelper.accessor('task', { header: 'Task' }),
  columnHelper.accessor('timeIn', { header: 'Time In', cell: info => new Date(info.getValue() as string).toLocaleString() }),
  columnHelper.accessor('timeOut', { header: 'Time Out', cell: info => new Date(info.getValue() as string).toLocaleString() }),
]

function LabourersLogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['labourers-log'],
    queryFn: labourers.list,
  })

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-header tracking-tight text-primary">LabourersLog</h2>
        <button className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded shadow-sm text-xs font-bold font-header uppercase tracking-wider transition-colors border border-primary-light">
          Add New
        </button>
      </div>

      <div className="bg-surface rounded-none shadow-none border-2 border-surface-border overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-text-muted">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-surface-border border-b border-surface-border">
            <thead className="bg-surface-muted">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 text-left text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider bg-surface-muted border-b border-surface-border font-header">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-surface divide-y divide-surface-border text-sm">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-surface-active/60 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-text-primary border-b border-surface-border/50">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-text-muted">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

