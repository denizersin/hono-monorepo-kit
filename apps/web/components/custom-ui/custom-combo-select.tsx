"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ComboSelectOption {
  value: string;
  label: string;
  order?: number;
}

interface CustomComboSelectProps {
  value?: string | null;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  buttonClass?: string;
  data: ComboSelectOption[];
  disabled?: boolean;
  labelValueRender?: (option: ComboSelectOption) => string;
}

export function CustomComboSelect({
  value,
  onValueChange,
  defaultValue,
  placeholder = "Select an option",
  buttonClass,
  data,
  disabled = false,
  labelValueRender,
}: CustomComboSelectProps) {
  const [open, setOpen] = React.useState(false)

  const valueLabelMap: Record<string, string> = React.useMemo(() => {
    return data.reduce((acc: Record<string, string>, option) => {
      acc[option.value] = option.label
      return acc
    }, {} as Record<string, string>)
  }, [data])


  const valueLabel = React.useMemo(() => {
    if (!value) return placeholder
    const label = data.find((option) => option.value === value)
    if (!label) return placeholder
    return labelValueRender ? labelValueRender(label) : label.label
  }, [value, data, labelValueRender])

  // console.log(valueLabel, 'valueLabel')

  console.log(data, 'data')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", buttonClass)}
          disabled={disabled}
        >
          {valueLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search, keywords) => {
            return valueLabelMap[value]?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }}
        >
          <CommandInput placeholder="Search option..." />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {data.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className=""
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
