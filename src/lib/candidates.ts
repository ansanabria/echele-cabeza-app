import { getPayload } from 'payload'

import type { Candidate, Correction, Media } from '@/payload-types'
import config from '@/payload.config'
import candidatesData from '../../data/candidates.json'

type UnknownRecord = Record<string, unknown>
type CandidatesDataRecord = {
  candidates?: { slug?: string; xHandle?: string }[]
}

export type SectionId =
  | 'biography'
  | 'proposals'
  | 'controversies'
  | 'alliances'
  | 'record'
  | 'funding'

export type SectionConfig = {
  id: SectionId
  navLabel: string
  heading: string
  field: SectionId
}

export type CandidateSummaryField =
  | 'summaryTrajectory'
  | 'summaryProposals'
  | 'summaryControversies'
  | 'summaryAlliances'
  | 'summaryRecord'
  | 'summaryFunding'

export const SECTION_CONFIG: SectionConfig[] = [
  {
    id: 'biography',
    navLabel: 'Biografía',
    heading: 'Biografía y trayectoria',
    field: 'biography',
  },
  {
    id: 'proposals',
    navLabel: 'Propuestas',
    heading: 'Plan de gobierno y propuestas',
    field: 'proposals',
  },
  {
    id: 'controversies',
    navLabel: 'Escándalos',
    heading: 'Escándalos y controversias',
    field: 'controversies',
  },
  {
    id: 'alliances',
    navLabel: 'Alianzas',
    heading: 'Alianzas y avales',
    field: 'alliances',
  },
  {
    id: 'record',
    navLabel: 'Registro',
    heading: 'Registro legislativo y de gobierno',
    field: 'record',
  },
  {
    id: 'funding',
    navLabel: 'Patrimonio',
    heading: 'Patrimonio, financiación y campaña',
    field: 'funding',
  },
]

export async function getPayloadClient() {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

export async function getCandidatesForDirectory(): Promise<Candidate[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'candidates',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })

  return result.docs.sort((a, b) => {
    const aOrder = a.directoryOrder
    const bOrder = b.directoryOrder
    const aHasOrder = typeof aOrder === 'number'
    const bHasOrder = typeof bOrder === 'number'

    if (aHasOrder && bHasOrder && aOrder !== bOrder) {
      return aOrder - bOrder
    }

    if (aHasOrder && !bHasOrder) return -1
    if (!aHasOrder && bHasOrder) return 1

    return a.name.localeCompare(b.name, 'es-CO')
  })
}

export async function getCandidateBySlug(slug: string): Promise<Candidate | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'candidates',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0] ?? null
}

export async function getCorrectionsForCandidate(
  candidateId: string | number,
): Promise<Correction[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'corrections',
    depth: 0,
    sort: '-correctedAt',
    limit: 100,
    overrideAccess: false,
    where: {
      candidate: {
        equals: candidateId,
      },
    },
  })

  return result.docs
}

export async function getCandidatesBySlugs(slugs: string[]): Promise<Candidate[]> {
  if (!slugs.length) return []

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'candidates',
    depth: 1,
    limit: slugs.length,
    sort: 'name',
    overrideAccess: false,
    where: {
      slug: {
        in: slugs,
      },
    },
  })

  return result.docs
}

export function getCandidateImageUrl(candidate: Candidate): string | null {
  const photo = candidate.photo

  if (typeof photo === 'object' && photo !== null && 'url' in photo) {
    return (photo as Media).url ?? null
  }

  return null
}

export function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return (media as Media).url ?? null
}

const xHandleBySlug = new Map<string, string>(
  ((candidatesData as CandidatesDataRecord).candidates ?? [])
    .filter((candidate) => typeof candidate.slug === 'string' && typeof candidate.xHandle === 'string')
    .map((candidate) => [candidate.slug as string, candidate.xHandle as string]),
)

export function getCandidateXHandle(slug: string): string | null {
  const handle = xHandleBySlug.get(slug)?.trim()
  return handle ? handle : null
}

export type SocialLink = {
  platform: 'x' | 'instagram' | 'facebook' | 'youtube'
  label: string
  url: string
}

export function getCandidateSocialLinks(slug: string): SocialLink[] {
  const xHandle = getCandidateXHandle(slug)
  const normalizedHandle = xHandle?.replace(/^@/, '').trim()

  const all: (SocialLink & { isPlaceholder: boolean })[] = [
    normalizedHandle
      ? {
          platform: 'x',
          label: 'X',
          url: `https://twitter.com/${normalizedHandle}`,
          isPlaceholder: false,
        }
      : { platform: 'x', label: 'X', url: '#', isPlaceholder: true },
    { platform: 'instagram', label: 'Instagram', url: '#', isPlaceholder: true },
    { platform: 'facebook', label: 'Facebook', url: '#', isPlaceholder: true },
    { platform: 'youtube', label: 'YouTube', url: '#', isPlaceholder: true },
  ]

  return all.filter((link) => !link.isPlaceholder)
}

export function formatDate(dateValue?: unknown): string {
  if (typeof dateValue !== 'string' || !dateValue) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateValue))
}

export function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const root = (value as UnknownRecord).root
  if (!root || typeof root !== 'object') return ''

  const lines: string[] = []
  walkLexicalNode(root as UnknownRecord, lines)
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

function walkLexicalNode(node: UnknownRecord, lines: string[]) {
  const nodeType = node.type
  if (nodeType === 'text' && typeof node.text === 'string') {
    lines.push(node.text)
  }

  const children = node.children
  if (!Array.isArray(children)) return

  for (const child of children) {
    if (typeof child !== 'object' || child === null) continue
    walkLexicalNode(child as UnknownRecord, lines)

    const childType = (child as UnknownRecord).type
    if (childType === 'paragraph' || childType === 'listitem') {
      lines.push('\n')
    }
  }
}

type SourceEntry = {
  id?: string | null
  title?: string | null
  url?: string | null
  tier?: string | null
  publishedAt?: string | null
  section?: SectionId | null
}

export function getSourcesForSection(
  candidate: Candidate,
  section: SectionId,
): SourceEntry[] {
  const sources = candidate.sources ?? []
  if (!Array.isArray(sources)) return []

  return sources.filter((source) => {
    return source.section === section
  })
}
