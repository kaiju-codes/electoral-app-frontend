/**
 * Simple, reusable filter component
 */
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, RefreshCw, SortAsc, SortDesc } from "lucide-react"

interface FilterField {
  key: string
  label: string
  type: 'text' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
  className?: string
}

interface SimpleFiltersProps {
  fields: FilterField[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onClear: () => void
  onRefresh?: () => void
  sortBy?: string
  sortOrder?: string
  onSortChange?: (field: string, order: string) => void
  sortOptions?: { value: string; label: string }[]
}

export function SimpleFilters({
  fields,
  values,
  onChange,
  onClear,
  onRefresh,
  sortBy,
  sortOrder = "asc",
  onSortChange,
  sortOptions = []
}: SimpleFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="space-y-4">
          {/* Filter Fields */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <div key={field.key} className={field.className}>
                <label className="text-sm font-medium mb-2 block">{field.label}</label>
                {field.type === 'text' ? (
                  <div className="relative">
                    {field.key === 'search' && (
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    )}
                    <Input
                      placeholder={field.placeholder}
                      value={values[field.key] || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      className={field.key === 'search' ? 'pl-9' : ''}
                    />
                  </div>
                ) : (
                  <Select 
                    value={values[field.key] || ''} 
                    onValueChange={(value) => onChange(field.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          {/* Sort and Actions */}
          <div className="flex items-center justify-between">
            {onSortChange && sortOptions.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={(value) => onSortChange(value, sortOrder)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSortChange(sortBy || sortOptions[0]?.value, sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="size-4" /> : <SortDesc className="size-4" />}
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClear}>
                Clear
              </Button>
              {onRefresh && (
                <Button variant="outline" onClick={onRefresh}>
                  <RefreshCw className="mr-2 size-4" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
