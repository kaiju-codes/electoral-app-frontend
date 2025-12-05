/**
 * Reusable location selector component
 */
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"
import { useStates, useConstituencies } from "@/hooks/use-location"

interface LocationSelectorProps {
  selectedState: string
  selectedConstituency: string
  onStateChange: (state: string) => void
  onConstituencyChange: (constituency: string) => void
  required?: boolean
  description?: string
}

export function LocationSelector({
  selectedState,
  selectedConstituency,
  onStateChange,
  onConstituencyChange,
  required = false,
  description
}: LocationSelectorProps) {
  const { data: statesData, isLoading: statesLoading } = useStates()
  const { data: constituenciesData, isLoading: constituenciesLoading } = useConstituencies(selectedState)

  const handleStateChange = (state: string) => {
    onStateChange(state)
    onConstituencyChange("") // Reset constituency when state changes
  }

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="flex items-center gap-3">
          <MapPin className="size-4 text-muted-foreground" />
          <div className="flex flex-1 items-center gap-3">
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder={statesLoading ? "Loading states..." : "Select state"} />
              </SelectTrigger>
              <SelectContent>
                {statesLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                ) : statesData?.states && statesData.states.length > 0 ? (
                  statesData.states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                    No states available
                  </div>
                )}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedConstituency}
              onValueChange={onConstituencyChange}
              disabled={!selectedState || constituenciesLoading}
            >
              <SelectTrigger className="w-[400px]">
                <SelectValue 
                  placeholder={
                    !selectedState 
                      ? "Select state first" 
                      : constituenciesLoading 
                      ? "Loading constituencies..." 
                      : "Select assembly constituency"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {constituenciesLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                ) : constituenciesData?.constituencies && constituenciesData.constituencies.length > 0 ? (
                  constituenciesData.constituencies.map((constituency, index) => {
                    const uniqueValue = `${constituency.number_english}-${constituency.name_english || constituency.name_local || index}`
                    return (
                      <SelectItem key={`${constituency.number_english}-${index}`} value={uniqueValue}>
                        {constituency.display_name}
                      </SelectItem>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                    {selectedState ? "No constituencies available" : "Select state first"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {description && (
          <p className="mt-2 text-sm text-muted-foreground ml-7">
            {description}
          </p>
        )}
        
        {required && (!selectedState || !selectedConstituency) && (
          <p className="mt-2 text-sm text-muted-foreground ml-7">
            {required ? "State and assembly constituency are required." : ""}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
