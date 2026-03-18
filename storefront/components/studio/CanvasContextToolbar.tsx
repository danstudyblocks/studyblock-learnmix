"use client"

import { observer } from "mobx-react-lite"
import { HistoryButtons } from "polotno/toolbar/history-buttons"
import { ZoomButtons } from "polotno/toolbar/zoom-buttons"

interface CanvasContextToolbarProps {
  store: any
}

const CanvasContextToolbar = observer(
  ({ store }: CanvasContextToolbarProps) => {
    return (
      <div className="canvas-context-toolbar canvas-context-toolbar--history-only">
        <div className="canvas-context-toolbar__rail">
          <div className="canvas-context-toolbar__scroller">
            <div className="canvas-context-toolbar__section canvas-context-toolbar__section--history">
              <div className="canvas-context-toolbar__tool-group canvas-context-toolbar__tool-group--compact">
                <HistoryButtons store={store} />
              </div>
            </div>
            <div className="canvas-context-toolbar__section canvas-context-toolbar__section--zoom">
              <div className="canvas-context-toolbar__tool-group canvas-context-toolbar__tool-group--compact canvas-context-toolbar__tool-group--zoom">
                <ZoomButtons store={store} />
              </div>
            </div>
            <div className="canvas-context-toolbar__section canvas-context-toolbar__section--spacer" />
          </div>
        </div>
      </div>
    )
  }
)

export default CanvasContextToolbar
