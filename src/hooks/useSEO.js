import { useEffect } from 'react'

const SITE_NAME = 'Cuerpo de Bomberos de Guática'
const SITE_URL = 'https://jhojan777jh.github.io'
const BASE_PATH = import.meta.env.BASE_URL

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
}

export default function useSEO({ title, description, noindex = false, path }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Panel Administrativo`
    document.title = fullTitle

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description })
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow',
    })

    const url = path
      ? `${SITE_URL}${BASE_PATH}${path.replace(/^\//, '')}`
      : `${window.location.origin}${window.location.pathname}`
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, noindex, path])
}
