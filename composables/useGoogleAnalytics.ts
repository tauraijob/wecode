export const useGoogleAnalytics = () => {
  const config = useRuntimeConfig()
  const googleAnalyticsId = config.public.googleAnalyticsId

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (process.client && googleAnalyticsId) {
      gtag('event', eventName, parameters)
    }
  }

  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (process.client && googleAnalyticsId) {
      gtag('config', googleAnalyticsId, {
        page_path: pagePath,
        page_title: pageTitle
      })
    }
  }

  const trackFormSubmission = (formName: string) => {
    trackEvent('form_submit', {
      form_name: formName,
      event_category: 'engagement'
    })
  }

  const trackContactForm = () => {
    trackEvent('contact_form_submit', {
      event_category: 'lead_generation',
      event_label: 'contact_form'
    })
  }

  const trackTrainingRequest = () => {
    trackEvent('training_request', {
      event_category: 'lead_generation',
      event_label: 'training_request'
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackFormSubmission,
    trackContactForm,
    trackTrainingRequest
  }
}