import { RouterProvider } from "react-router"
import { router } from "@/router"

export default function App() {
  return (
    <div className="h-dvh w-full bg-surface-container-highest flex items-center justify-center overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      <div className="w-full max-w-[448px] h-dvh bg-surface-bright shadow-2xl relative overflow-hidden flex flex-col">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}
