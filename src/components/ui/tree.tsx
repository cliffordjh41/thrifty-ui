
import * as React from "react"
import { createContext, useContext, useState } from "react"
import { ChevronRight } from "lucide-react"
import { cx } from "../../lib/utils"

const DepthContext = createContext(0)

interface TreeProps {
  children: React.ReactNode
  className?: string
}

function Tree({ children, className }: TreeProps) {
  return (
    <div className={cx("py-1", className)}>
      {children}
    </div>
  )
}

interface TreeItemProps {
  // A component that renders an icon (lucide-react icons, or any component
  // taking className). Deliberately NOT React.ElementType: that unions over
  // every intrinsic JSX element, and a consumer whose program augments
  // JSX.IntrinsicElements (e.g. react-three-fiber) collapses the rendered
  // className prop to `never`. A ComponentType slot is immune to that.
  icon: React.ComponentType<{ className?: string }>
  label: string
  children?: React.ReactNode
  defaultOpen?: boolean
  onSelect?: () => void
  selected?: boolean
}

function TreeItem({ icon: Icon, label, children, defaultOpen = true, onSelect, selected }: TreeItemProps) {
  const depth = useContext(DepthContext)
  const hasChildren = !!children
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setOpen(!open)
          else onSelect?.()
        }}
        className={cx(
          "w-full flex items-center gap-1.5 py-1 transition-colors",
          hasChildren ? "text-mute-fg hover:text-foreground hover:bg-mute/50 cursor-default" : "cursor-pointer hover:bg-mute/50",
          selected ? "text-foreground bg-mute/30" : "text-mute-fg hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <ChevronRight
            className={cx(
              "h-3 w-3 shrink-0 transition-transform text-mute-fg/50",
              open && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3" />
        )}
        <Icon className="h-3 w-3 shrink-0 text-mute-fg/70" />
        <span className="text-[10px] truncate">{label}</span>
      </button>
      {hasChildren && open && (
        <DepthContext.Provider value={depth + 1}>
          {children}
        </DepthContext.Provider>
      )}
    </div>
  )
}

export { Tree, TreeItem }
