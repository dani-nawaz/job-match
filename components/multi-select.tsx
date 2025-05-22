"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select options..." }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option))
  }

  const selectables = options.filter((option) => !selected.includes(option.value))

  return (
    <div className="relative">
      <div
        className={cn(
          "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          open && "ring-2 ring-ring ring-offset-2",
        )}
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            const selectedOption = options.find((o) => o.value === option)
            return (
              <Badge key={option} variant="secondary" className="rounded-sm">
                {selectedOption?.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground ml-2"
            placeholder={selected.length === 0 ? placeholder : ""}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setOpen(false)
              setInputValue("")
            }}
          />
        </div>
      </div>
      {open && selectables.length > 0 && (
        <Command className="absolute z-10 w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
          <CommandList className="max-h-[200px] overflow-auto">
            <CommandGroup>
              {selectables
                .filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      onChange([...selected, option.value])
                      setInputValue("")
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  )
}
