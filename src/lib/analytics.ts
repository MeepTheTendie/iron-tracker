declare global {
  interface Window {
    gtag?: (...args: Array<unknown>) => void
    dataLayer?: Array<unknown>
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function () {
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export function trackPageView(path: string) {
  if (!window.gtag) return
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}
