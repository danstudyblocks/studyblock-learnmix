import Skeleton from "../ui/Skeleton"

const EditorLoading = () => {
  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 h-16 p-4">
          <Skeleton className="h-8 w-full" />
        </div>

        <div className="flex-1 flex">
          <div className="w-[300px] border-r border-gray-200 bg-white p-4">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="flex-1 p-8">
            <div className="h-full w-full rounded-lg bg-white flex items-center justify-center">
              <Skeleton className="h-[80%] w-[80%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorLoading
