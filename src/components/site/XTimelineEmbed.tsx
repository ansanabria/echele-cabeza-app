'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (el?: HTMLElement | null) => void
      }
    }
  }
}

type XTimelineEmbedProps = {
  handle: string
}

const SCRIPT_ID = 'twitter-wjs'
const SCRIPT_SRC = 'https://platform.twitter.com/widgets.js'

export function XTimelineEmbed({ handle }: XTimelineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const normalizedHandle = handle.replace(/^@/, '').trim()

  useEffect(() => {
    const el = containerRef.current

    function triggerLoad() {
      window.twttr?.widgets?.load(el)
    }

    // If widgets.js is already initialized, just load widgets inside our container.
    if (window.twttr?.widgets) {
      triggerLoad()
      return
    }

    // Inject the script if it's not on the page yet.
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = SCRIPT_SRC
      script.async = true
      script.charset = 'utf-8'
      script.onload = triggerLoad
      document.body.appendChild(script)
      return
    }

    // Script tag already exists but twttr hasn't initialized yet — poll briefly.
    let attempts = 0
    const timer = setInterval(() => {
      if (window.twttr?.widgets) {
        clearInterval(timer)
        triggerLoad()
      } else if (++attempts >= 20) {
        clearInterval(timer)
      }
    }, 250)

    return () => clearInterval(timer)
  }, [normalizedHandle])

  if (!normalizedHandle) return null

  return (
    <>
      <div ref={containerRef}>
        <a
          className="twitter-timeline"
          data-dnt="true"
          data-chrome="noheader nofooter noborders transparent"
          data-tweet-limit="3"
          href={`https://twitter.com/${normalizedHandle}?ref_src=twsrc%5Etfw`}
        >
          Tweets de @{normalizedHandle}
        </a>
      </div>
      <a
        href={`https://twitter.com/${normalizedHandle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Ver perfil en X →
      </a>
    </>
  )
}
