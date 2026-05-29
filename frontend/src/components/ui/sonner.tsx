// import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
//   const { theme = "system" } = useTheme?.() ?? {} 

  return (
    <Sonner
    //   theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg font-body",
          description: "group-[.toast]:text-text-secondary font-caption",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-on-primary font-medium",
          cancelButton:
            "group-[.toast]:bg-surface-container-low group-[.toast]:text-text-secondary font-medium",
          error: "group-[.toaster]:bg-error/10 group-[.toaster]:text-error group-[.toaster]:border-error/20",
          success: "group-[.toaster]:bg-success/10 group-[.toaster]:text-success group-[.toaster]:border-success/20",
          warning: "group-[.toaster]:bg-warning/10 group-[.toaster]:text-warning group-[.toaster]:border-warning/20",
          info: "group-[.toaster]:bg-primary/10 group-[.toaster]:text-primary group-[.toaster]:border-primary/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }