
import * as React from "react"
import { createContext, useContext } from "react"
import { cx } from "../../lib/utils"
import {
  useSortable,
  type SortableItemData,
  type UseSortableConfig,
  type UseSortableReturn,
} from "../../hooks/use-sortable"

interface SortableContextValue<T extends SortableItemData = SortableItemData>
  extends UseSortableReturn<T> {
  direction: "vertical" | "horizontal"
}

const SortableContext = createContext<SortableContextValue | null>(null)

function useSortableContext() {
  const context = useContext(SortableContext)
  if (!context) {
    throw new Error("Sortable components must be used within a Sortable")
  }
  return context
}

export interface SortableProps<T extends SortableItemData = SortableItemData>
  extends UseSortableConfig<T> {
  children: React.ReactNode
  className?: string
  containerId?: string
}

function Sortable<T extends SortableItemData = SortableItemData>({
  children,
  className,
  containerId,
  direction = "vertical",
  ...config
}: SortableProps<T>) {
  const sortable = useSortable({ ...config, direction })
  const dropProps = sortable.getDropProps(containerId)

  return (
    <SortableContext.Provider
      value={{ ...sortable, direction } as SortableContextValue}
    >
      <div
        className={cx(
          "relative",
          direction === "vertical" ? "flex flex-col" : "flex flex-row",
          className
        )}
        {...dropProps}
      >
        {children}
      </div>
    </SortableContext.Provider>
  )
}

export interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
  handle?: boolean
  disabled?: boolean
  dragClassName?: string
  dropClassName?: string
}

function SortableItem({
  id,
  children,
  className,
  handle = false,
  disabled = false,
  dragClassName = "opacity-50",
  dropClassName = "ring-2 ring-action ring-offset-2",
}: SortableItemProps) {
  const { getDragProps, isDragging, isDropTarget, direction } = useSortableContext()
  const dragProps = handle || disabled ? {} : getDragProps(id)
  const dragging = isDragging(id)
  const dropTarget = isDropTarget(id)

  return (
    <div
      className={cx(
        "relative transition-all duration-150",
        !handle && !disabled && "cursor-grab active:cursor-grabbing",
        dragging && dragClassName,
        dropTarget && dropClassName,
        className
      )}
      data-sortable-id={id}
      data-dragging={dragging}
      data-drop-target={dropTarget}
      data-direction={direction}
      {...dragProps}
    >
      {children}
    </div>
  )
}

export interface SortableHandleProps {
  id: string
  children: React.ReactNode
  className?: string
}

function SortableHandle({ id, children, className }: SortableHandleProps) {
  const { getDragProps } = useSortableContext()
  const dragProps = getDragProps(id)

  return (
    <div
      className={cx("cursor-grab active:cursor-grabbing", className)}
      {...dragProps}
    >
      {children}
    </div>
  )
}

export {
  Sortable,
  SortableItem,
  SortableHandle,
  useSortableContext,
}
