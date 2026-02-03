import * as SelectPrimitive from "@radix-ui/react-select";
import { useState } from "react";
import React from "react";

import { ChevronDownIcon } from "./Icons";

interface SelectProps<T> {
  options: T[];
  renderOption: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
  isSelected: (option: T) => boolean;
  value: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
}

export function Select<T>(props: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectPrimitive.Root
      disabled={props.disabled}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {/* Trigger */}
      <SelectPrimitive.Trigger
        className="
          w-full
          text-sm
          bg-white
          text-black
          border border-gray-300
          py-2 px-4
          rounded-lg
          cursor-pointer
          flex items-center justify-between
          min-h-[36px]
          focus:outline-none
          focus:ring-2 focus:ring-blue-500
          disabled:opacity-50
        "
      >
        <div className={props.value ? "text-black" : "text-gray-400"}>
          {props.value ?? props.placeholder}
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
      </SelectPrimitive.Trigger>

      {/* Dropdown */}
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={5}
          className="z-50 w-[var(--radix-select-trigger-width)]"
        >
          <SelectPrimitive.Viewport
            className="
              max-h-[300px]
              overflow-y-auto
              rounded-lg
              border border-gray-300
              bg-white
              shadow-lg
              py-1
            "
          >
            {props.options.map((option, index) => {
              const selected = props.isSelected(option);

              return (
                <div
                  key={index}
                  className={`
                    px-4 py-2
                    text-sm
                    cursor-pointer
                    transition-colors
                    hover:bg-gray-100
                    ${
                      selected
                        ? "bg-gray-200 text-black font-medium"
                        : "text-gray-700"
                    }
                  `}
                  onClick={() => {
                    props.onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  {props.renderOption(option)}
                </div>
              );
            })}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
