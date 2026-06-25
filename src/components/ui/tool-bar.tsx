import { Fragment, type ComponentType } from "react"
import {
  RotateCw,
  ArrowRightLeft,
  ArrowLeftRight,
  PanelLeftClose,
  Columns2,
  PanelRightClose,
  ArrowLeftFromLine,
  EyeOff,
  ArrowRightFromLine,
  ArrowLeft,
  ArrowRight,
  Box,
  Sparkles,
  Type,
  Palette,
} from "lucide-react"
import { cx } from "../../lib/utils"
import { COLUMN_WIDTH as SIDEBAR_WIDTH } from "./slidable-column"
import { VisuallyHidden } from "./visually-hidden"

interface ColumnToolBarProps {
  isMobile: boolean
  leftOffset: number
  rightOffset: number
  setLeftOffset: (offset: number) => void
  setRightOffset: (offset: number) => void
  swapped: boolean
  setSwapped: (swapped: boolean) => void
  leftHidden: boolean
  setLeftHidden: (hidden: boolean) => void
  rightHidden: boolean
  setRightHidden: (hidden: boolean) => void
  activeMobileSheet?: "left" | "right" | "left-footer" | "right-footer" | null
  onLeftClick?: () => void
  onRightClick?: () => void
  onLeftFooterClick?: () => void
  onRightFooterClick?: () => void
  onPrevPanelClick?: () => void
  onNextPanelClick?: () => void
}

const btnBase = "flex items-center justify-center p-1.5 transition-colors"

function btnClass(active = false) {
  return cx(btnBase, active ? "bg-mute text-foreground" : "text-mute-fg hover:text-foreground hover:bg-mute/50")
}


export function ColumnToolBar({
  isMobile,
  leftOffset,
  rightOffset,
  setLeftOffset,
  setRightOffset,
  swapped,
  setSwapped,
  leftHidden,
  setLeftHidden,
  rightHidden,
  setRightHidden,
  activeMobileSheet,
  onLeftClick,
  onRightClick,
  onLeftFooterClick,
  onRightFooterClick,
  onPrevPanelClick,
  onNextPanelClick,
}: ColumnToolBarProps) {
  const reset = () => {
    setLeftOffset(0)
    setRightOffset(0)
    setSwapped(false)
    setLeftHidden(false)
    setRightHidden(false)
  }

  const swap = () => {
    const vw = window.innerWidth
    if (swapped) {
      setLeftOffset(0)
      setRightOffset(0)
      setSwapped(false)
    } else {
      setLeftOffset(vw - SIDEBAR_WIDTH)
      setRightOffset(-(vw - SIDEBAR_WIDTH))
      setSwapped(true)
    }
  }

  const flip = () => {
    const vw = window.innerWidth
    const rightAbsX = vw - SIDEBAR_WIDTH + rightOffset
    setLeftOffset(rightAbsX)
    setRightOffset(leftOffset - (vw - SIDEBAR_WIDTH))
    setSwapped(!swapped)
  }

  // Alignment functions always use natural-side math (left column on
  // viewport left, right column on viewport right). If the user has
  // dragged columns into a crossed-over position, alignment restores
  // them to natural sides at the requested alignment.

  const alignLeft = () => {
    const vw = window.innerWidth
    setLeftOffset(0)
    setRightOffset(-(vw - SIDEBAR_WIDTH * 2))
  }

  const alignCenter = () => {
    const vw = window.innerWidth
    setLeftOffset(vw / 2 - SIDEBAR_WIDTH)
    setRightOffset(-(vw / 2) + SIDEBAR_WIDTH)
  }

  const alignRight = () => {
    const vw = window.innerWidth
    setLeftOffset(vw - SIDEBAR_WIDTH * 2)
    setRightOffset(0)
  }

  if (isMobile) {
    // Layout convention: 6 fixed slots, semantically labelled per the
    // studio sheets they open, in left-to-right order:
    //   [Style] [Typography] [prev] [next] [Effects] [Color]
    // Slot ordering reflects the desired bar reading order; each slot
    // points at the mobile-sheet identifier its panel lives in
    // (Typography lives in "left-footer", Effects in "right-footer"
    // per studio's App.tsx). Prev/Next drive the studio's
    // preview-carousel position.
    type Item = { label: string; icon: ComponentType<{ className?: string }> | null; active?: boolean; onClick?: () => void }
    const items: Item[] = [
      { label: "Style", icon: Box, active: activeMobileSheet === "left", onClick: onLeftClick },
      { label: "Typography", icon: Type, active: activeMobileSheet === "left-footer", onClick: onLeftFooterClick },
      { label: "Prev", icon: ArrowLeft, onClick: onPrevPanelClick },
      { label: "Next", icon: ArrowRight, onClick: onNextPanelClick },
      { label: "Effects", icon: Sparkles, active: activeMobileSheet === "right-footer", onClick: onRightFooterClick },
      { label: "Color", icon: Palette, active: activeMobileSheet === "right", onClick: onRightClick },
    ]

    return (
      <div data-mobile-bar className="absolute bottom-0 left-0 right-0 h-12 bg-background border-t border-line flex items-stretch z-[60]">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <Fragment key={item.label}>
              {i > 0 && <div className="w-px self-center h-5 bg-line flex-shrink-0" />}
              {Icon ? (
                <button
                  className={cx(
                    "flex-1 flex items-center justify-center transition-colors",
                    item.active
                      ? "bg-mute text-foreground"
                      : "text-mute-fg hover:text-foreground hover:bg-mute/50"
                  )}
                  onClick={item.onClick}
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                  <VisuallyHidden>{item.label}</VisuallyHidden>
                </button>
              ) : (
                <div className="flex-1" aria-hidden="true" />
              )}
            </Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-8 bg-background border-t border-line flex items-center justify-center z-30">
      <div className="flex h-7 gap-3">
        {/* Reset / Swap / Flip */}
        <div className="flex">
          <button className={btnClass()} title="Reset positions" onClick={reset}>
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <div className="w-px bg-line" />
          <button className={btnClass()} title="Swap sidebars" onClick={swap}>
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </button>
          <div className="w-px bg-line" />
          <button className={btnClass()} title="Flip sidebars" onClick={flip}>
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Align Left / Center / Right */}
        <div className="flex">
          <button className={btnClass()} title="Align left" onClick={alignLeft}>
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
          <div className="w-px bg-line" />
          <button className={btnClass()} title="Center" onClick={alignCenter}>
            <Columns2 className="h-3.5 w-3.5" />
          </button>
          <div className="w-px bg-line" />
          <button className={btnClass()} title="Align right" onClick={alignRight}>
            <PanelRightClose className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Hide L / Hide Both / Hide R */}
        <div className="flex">
          <button
            className={btnClass(leftHidden)}
            title={leftHidden ? "Show left" : "Hide left"}
            onClick={() => setLeftHidden(!leftHidden)}
          >
            <ArrowLeftFromLine className="h-3.5 w-3.5" />
          </button>
          <div className="w-px bg-line" />
          <button
            className={btnClass(leftHidden && rightHidden)}
            title={leftHidden && rightHidden ? "Show both" : "Hide both"}
            onClick={() => {
              const bothHidden = leftHidden && rightHidden
              setLeftHidden(!bothHidden)
              setRightHidden(!bothHidden)
            }}
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
          <div className="w-px bg-line" />
          <button
            className={btnClass(rightHidden)}
            title={rightHidden ? "Show right" : "Hide right"}
            onClick={() => setRightHidden(!rightHidden)}
          >
            <ArrowRightFromLine className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  )
}
