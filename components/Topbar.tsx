"use client"

import { useQuery } from "@tanstack/react-query"
import { getSettings } from "@/actions/settings.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
export default function Topbar({ settings }: {
  settings: {
    topbar_enabled: boolean,
    topbar_bg_color: string, 
    topbar_text_color: string, 
    topbar_text: string
  }
}) {
  // const { data: settings, isLoading, isError } = useQuery({
  //   queryKey: ["settings"],
  //   queryFn: getSettings,
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  // })

  // if (isLoading) {
  //   return (
  //     <div className="bg-primary h-10 flex items-center justify-center">
  //       <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
  //     </div>
  //   )
  // }

  // if (isError) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertDescription>Failed to load topbar settings.</AlertDescription>
  //     </Alert>
  //   )
  // }

  if (!settings?.topbar_enabled) {
    return null
  }

  return (
    <div
      style={{
        backgroundColor: settings.topbar_bg_color,
        color: settings.topbar_text_color,
      }}
      className="py-2 px-4 text-center text-sm font-medium"
    >
      <p>{settings.topbar_text}</p>
    </div>
  )
}
