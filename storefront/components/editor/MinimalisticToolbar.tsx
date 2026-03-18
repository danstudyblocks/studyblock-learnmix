import { observer } from "mobx-react-lite"
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  Download
} from "lucide-react"

export const MinimalisticToolbar = observer(({ store }: { store: any }) => {
  const handleUndo = () => {
    store.history.undo()
  }

  const handleRedo = () => {
    store.history.redo()
  }

  const handleZoomIn = () => {
    const currentZoom = store.scale
    store.setScale(Math.min(currentZoom + 0.1, 3))
  }

  const handleZoomOut = () => {
    const currentZoom = store.scale
    store.setScale(Math.max(currentZoom - 0.1, 0.1))
  }

  const handleDownload = () => {
    store.saveAsImage({
      fileName: 'design.png',
      pixelRatio: 2,
    })
  }

  return (
    <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4">
      <div className="flex items-center gap-2">
        {/* Undo */}
        <button
          onClick={handleUndo}
          disabled={!store.history.canUndo}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={handleRedo}
          disabled={!store.history.canRedo}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Download */}
        <button
          onClick={handleDownload}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
})
