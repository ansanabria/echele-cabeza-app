import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { getPayload } from 'payload'
import type { Candidate } from '../src/payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const CANDIDATES_DATA_PATH = path.resolve(dirname, '../data/candidates.json')
const CORRECTIONS_DATA_PATH = path.resolve(dirname, '../data/corrections.json')
const PLACEHOLDER_ALT = '__seed_placeholder_candidate_photo__'
const CANDIDATE_PHOTO_ALT_PREFIX = '__seed_candidate_photo__'
const CANDIDATE_IMAGES_DIR = path.resolve(dirname, '../media')
const CANDIDATE_LOCAL_PHOTOS_BY_SLUG: Record<string, string> = {
  'ivan-cepeda': 'ivan-cepeda.webp',
  'abelardo-de-la-espriella': 'abelardo-espriella.webp',
  'sergio-fajardo': 'sergio-fajardo.webp',
}
/** Parties/coalitions and endorsers per candidate, derived from alliances content. Placeholder media used for logos and photos. */
const ALLIANCE_DATA_BY_SLUG: Record<
  string,
  { parties: { name: string }[]; endorsers: { name: string }[] }
> = {
  'ivan-cepeda': {
    parties: [
      { name: 'Consulta del Frente Amplio' },
      { name: 'Pacto Histórico' },
      { name: 'Colombia Humana' },
    ],
    endorsers: [{ name: 'Gustavo Petro' }],
  },
  'abelardo-de-la-espriella': {
    parties: [{ name: 'Salvación Nacional' }],
    endorsers: [
      { name: 'Enrique Gómez Martínez' },
      { name: 'Jaime Andrés Beltrán' },
      { name: 'Marco Acosta' },
      { name: 'Sara Castellanos' },
      { name: 'Wilson Ruiz Orejuela' },
      { name: 'General (r) Jorge Mora' },
      { name: 'Silvestre Dangond' },
    ],
  },
  'sergio-fajardo': {
    parties: [{ name: 'Coalición de centro' }],
    endorsers: [],
  },
}

const CANDIDATE_DIRECTORY_ORDER_BY_SLUG: Record<string, number> = {
  'ivan-cepeda': 1,
  'abelardo-de-la-espriella': 2,
  'sergio-fajardo': 3,
}
const ENV_PATH = path.resolve(dirname, '../.env')
const ENV_LOCAL_PATH = path.resolve(dirname, '../.env.local')

type SourceSection =
  | 'biography'
  | 'proposals'
  | 'controversies'
  | 'alliances'
  | 'record'
  | 'funding'
type SourceTier = 'oficial' | 'prensa' | 'ong' | 'redes'
type ControversyStatus = 'suspicion' | 'under_investigation' | 'indicted' | 'cleared' | 'convicted'

type SourceSeed = {
  section: SourceSection
  title: string
  publishedAt: string
  url: string
  tier: SourceTier
}

type ProposalItemSeed = {
  title: string
  description: string
  topic?: string
  sourceTitle: string
  sourceUrl: string
  sourceTier: SourceTier
}

type ControversyItemSeed = {
  title: string
  description: string
  status: ControversyStatus
  year?: string
  sourceTitle: string
  sourceUrl: string
  sourceTier: SourceTier
}

type AlliancePartySeed = {
  name: string
}

type EndorserSeed = {
  name: string
}

type SocialLinkSeed = {
  platform: 'x' | 'instagram' | 'facebook' | 'youtube'
  url: string
}

type CandidateSeed = {
  name: string
  slug: string
  directoryOrder: number
  party: string
  currentOffice?: string
  photoUrl?: string
  biography: string
  proposals: string
  controversies: string
  alliances: string
  record: string
  funding: string
  summaryTrajectory: string
  summaryProposals: string
  summaryControversies: string
  summaryAlliances: string
  summaryRecord: string
  summaryFunding: string
  sources: SourceSeed[]
  proposalItems: ProposalItemSeed[]
  controversyItems: ControversyItemSeed[]
  allianceParties: AlliancePartySeed[]
  endorsers: EndorserSeed[]
  socialLinks: SocialLinkSeed[]
}

type CorrectionSeed = {
  candidateSlug: string
  note: string
  correctedAt: string
}

type JsonSource = {
  section: string
  title: string
  date: string
  url: string
  tier: string
}

type JsonCandidate = {
  name: string
  slug: string
  xHandle?: string
  party: string
  currentOffice?: string
  photoUrl?: string
  sections: {
    biography: string
    proposals: string
    controversies: string
    alliances: string
    record: string
    funding: string
  }
  summaries: {
    trajectory: string
    proposals: string
    controversies: string
    alliances: string
    record: string
    funding: string
  }
  sources: JsonSource[]
}

type JsonDataFile = {
  candidates: JsonCandidate[]
}

function getSocialLinksFromJsonCandidate(candidate: JsonCandidate): SocialLinkSeed[] {
  const normalizedXHandle = candidate.xHandle?.replace(/^@/, '').trim()
  if (!normalizedXHandle) return []

  return [{ platform: 'x', url: `https://twitter.com/${normalizedXHandle}` }]
}

function toLexicalRichText(text: string): Candidate['biography'] {
  const normalized = text.trim()
  const paragraphTexts =
    normalized.length > 0 ? normalized.split(/\n{2,}/).map((chunk) => chunk.trim()) : ['']

  const children = paragraphTexts.map((paragraph) => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'text',
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: paragraph,
        version: 1,
      },
    ],
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
  }))

  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

function parseCandidatesFromJson(jsonData: JsonDataFile): CandidateSeed[] {
  return jsonData.candidates.reduce<CandidateSeed[]>((acc, candidate) => {
    const { slug, party } = candidate
    if (!slug || !party) return acc

    const directoryOrder = CANDIDATE_DIRECTORY_ORDER_BY_SLUG[slug]

    const sources: SourceSeed[] = candidate.sources
      .filter((s) =>
        ['biography', 'proposals', 'controversies', 'alliances', 'record', 'funding'].includes(
          s.section.toLowerCase(),
        ),
      )
      .map((s) => ({
        section: s.section.toLowerCase() as SourceSection,
        title: s.title,
        publishedAt: s.date,
        url: s.url,
        tier: s.tier.toLowerCase() as SourceTier,
      }))

    const summaryTrajectory = candidate.summaries.trajectory
    const summaryProposals = candidate.summaries.proposals
    const summaryControversies = candidate.summaries.controversies
    const summaryAlliances = candidate.summaries.alliances
    const summaryRecord = candidate.summaries.record
    const summaryFunding = candidate.summaries.funding

    if (
      !directoryOrder ||
      !summaryTrajectory ||
      !summaryProposals ||
      !summaryControversies ||
      !summaryAlliances ||
      !summaryRecord ||
      !summaryFunding
    ) {
      throw new Error(
        `Missing summary fields or directory order for candidate "${candidate.name}" (${slug}).`,
      )
    }

    const allianceData = ALLIANCE_DATA_BY_SLUG[slug] ?? { parties: [], endorsers: [] }

    acc.push({
      name: candidate.name,
      slug,
      directoryOrder,
      party,
      currentOffice: candidate.currentOffice,
      photoUrl: candidate.photoUrl,
      biography: candidate.sections.biography,
      proposals: candidate.sections.proposals,
      controversies: candidate.sections.controversies,
      alliances: candidate.sections.alliances,
      record: candidate.sections.record,
      funding: candidate.sections.funding,
      summaryTrajectory,
      summaryProposals,
      summaryControversies,
      summaryAlliances,
      summaryRecord,
      summaryFunding,
      sources,
      proposalItems: buildProposalItems(candidate.sections.proposals, sources),
      controversyItems: buildControversyItems(candidate.sections.controversies, sources),
      allianceParties: allianceData.parties,
      endorsers: allianceData.endorsers,
      socialLinks: getSocialLinksFromJsonCandidate(candidate),
    })

    return acc
  }, [])
}

const DEFAULT_SOURCE: Omit<SourceSeed, 'section' | 'publishedAt'> & { publishedAt: string } = {
  title: 'Pares — Así va la carrera presidencial 2026',
  url: 'https://www.pares.com.co/elecciones-colombia-2026/',
  tier: 'ong',
  publishedAt: '2025-12-01',
}

function normalizeItemText(value: string): string {
  const cleaned = value
    .replace(/^[-*•]\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+[.;,:]$/, '')

  if (!cleaned) return ''
  return cleaned[0].toUpperCase() + cleaned.slice(1)
}

function splitSectionIntoItems(
  sectionText: string,
  options?: { splitByCommaClauses?: boolean },
): string[] {
  const splitByCommaClauses = options?.splitByCommaClauses ?? true
  const lines = sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const explicitBullets = lines
    .filter((line) => /^[-*•]\s+/.test(line))
    .map((line) => normalizeItemText(line))
    .filter(Boolean)

  if (explicitBullets.length >= 2) {
    return explicitBullets
  }

  const paragraph = lines.join(' ')
  const sentenceSegments = paragraph
    .split(/(?<=[.?!])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)

  const items: string[] = []

  for (const segment of sentenceSegments) {
    if (splitByCommaClauses) {
      const commaSegments = segment
        .split(',')
        .map((part) => normalizeItemText(part))
        .filter((part) => part.length >= 24)

      if (commaSegments.length >= 2) {
        for (const part of commaSegments) items.push(part)
        continue
      }
    }

    const normalized = normalizeItemText(segment)
    if (normalized.length >= 24) {
      items.push(normalized)
    }
  }

  if (items.length >= 2) return items

  const fallback = normalizeItemText(paragraph)
  return fallback ? [fallback] : []
}

function deriveTitleFromItem(text: string, fallbackPrefix: string, index: number): string {
  const noPeriod = text.replace(/[.;]+$/, '').trim()
  const beforeColon = noPeriod.split(':')[0]?.trim() ?? ''

  if (beforeColon && beforeColon.length <= 72) {
    return beforeColon
  }

  const words = noPeriod.split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return `${fallbackPrefix} ${index + 1}`
  }

  return words.slice(0, 8).join(' ')
}

function deriveProposalTopic(text: string): string | undefined {
  const value = text.toLowerCase()
  if (/(seguridad|militar|polic|fuerza p[uú]blica|orden)/.test(value)) return 'Seguridad'
  if (/(salud|hospital|eps|medic)/.test(value)) return 'Salud'
  if (/(educaci[oó]n|universidad|colegio|docent)/.test(value)) return 'Educacion'
  if (/(empleo|econom[ií]a|empresa|inversi[oó]n|tributari)/.test(value)) return 'Economia'
  if (/(justicia|corrupci[oó]n|impunidad|fiscal[ií]a)/.test(value)) return 'Justicia'
  if (/(paz|v[ií]ctima|conflicto|reconciliaci[oó]n)/.test(value)) return 'Paz'
  if (/(clima|ambient|energ[ií]a|renovable)/.test(value)) return 'Medio ambiente'
  if (/(infraestructura|metro|vial|transporte|movilidad)/.test(value)) return 'Infraestructura'
  return undefined
}

function inferControversyStatus(text: string): ControversyStatus {
  const value = text.toLowerCase()

  if (/(condenad|sentenciad)/.test(value)) return 'convicted'
  if (/(imputad|acusaci[oó]n formal|llamamiento a juicio|indict)/.test(value)) return 'indicted'
  if (
    /(investigaci[oó]n|indagaci[oó]n|proceso en curso|procuradur[ií]a|contralor[ií]a|fiscal[ií]a)/.test(
      value,
    )
  ) {
    return 'under_investigation'
  }
  if (/(absuelt|archiv|sin cargos|no result[oó] en cargos|caso cerrado|preclu)/.test(value)) {
    return 'cleared'
  }

  return 'suspicion'
}

function inferControversyYear(text: string): string | undefined {
  const years = text.match(/\b(19|20)\d{2}\b/g)
  if (!years || years.length === 0) return undefined
  if (years.length === 1) return years[0]
  return `${years[0]}-${years[years.length - 1]}`
}

function getItemSource(
  sources: SourceSeed[],
  section: SourceSection,
  itemIndex: number,
): Pick<ProposalItemSeed, 'sourceTitle' | 'sourceUrl' | 'sourceTier'> {
  const sectionSources = sources.filter((source) => source.section === section)
  const fallbackSource = sectionSources[0] ?? sources[0]

  const source = sectionSources[itemIndex] ?? fallbackSource
  if (source) {
    return {
      sourceTitle: source.title,
      sourceUrl: source.url,
      sourceTier: source.tier,
    }
  }

  return {
    sourceTitle: DEFAULT_SOURCE.title,
    sourceUrl: DEFAULT_SOURCE.url,
    sourceTier: DEFAULT_SOURCE.tier,
  }
}

function buildProposalItems(proposalsText: string, sources: SourceSeed[]): ProposalItemSeed[] {
  const items = splitSectionIntoItems(proposalsText)
  return items.map((itemText, index) => {
    const source = getItemSource(sources, 'proposals', index)
    return {
      title: deriveTitleFromItem(itemText, 'Propuesta', index),
      description: itemText,
      topic: deriveProposalTopic(itemText),
      ...source,
    }
  })
}

function buildControversyItems(
  controversiesText: string,
  sources: SourceSeed[],
): ControversyItemSeed[] {
  const items = splitSectionIntoItems(controversiesText, { splitByCommaClauses: false })
  return items.map((itemText, index) => {
    const source = getItemSource(sources, 'controversies', index)
    return {
      title: deriveTitleFromItem(itemText, 'Controversia', index),
      description: itemText,
      status: inferControversyStatus(itemText),
      year: inferControversyYear(itemText),
      ...source,
    }
  })
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function ensurePlaceholderMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    where: {
      alt: { equals: PLACEHOLDER_ALT },
    },
    limit: 1,
  })

  if (existing.docs[0]) {
    return existing.docs[0].id
  }

  const temporaryImagePath = path.join(os.tmpdir(), `seed-placeholder-${Date.now()}.png`)
  const onePixelPngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2QX0QAAAAASUVORK5CYII='

  await fs.writeFile(temporaryImagePath, Buffer.from(onePixelPngBase64, 'base64'))

  try {
    const created = await payload.create({
      collection: 'media',
      data: { alt: PLACEHOLDER_ALT },
      filePath: temporaryImagePath,
    })

    return created.id
  } finally {
    await fs.rm(temporaryImagePath, { force: true })
  }
}

async function upsertCandidate(
  payload: Awaited<ReturnType<typeof getPayload>>,
  candidate: CandidateSeed,
  photoId: number,
  placeholderMediaId: number,
): Promise<number> {
  const existing = await payload.find({
    collection: 'candidates',
    where: {
      slug: { equals: candidate.slug },
    },
    limit: 1,
  })

  const candidateData = {
    name: candidate.name,
    slug: candidate.slug,
    directoryOrder: candidate.directoryOrder,
    party: candidate.party,
    currentOffice: candidate.currentOffice,
    photo: photoId,
    lastUpdated: new Date().toISOString(),
    biography: toLexicalRichText(candidate.biography),
    proposals: toLexicalRichText(candidate.proposals),
    proposalItems: candidate.proposalItems,
    controversies: toLexicalRichText(candidate.controversies),
    controversyItems: candidate.controversyItems,
    alliances: toLexicalRichText(candidate.alliances),
    allianceParties: candidate.allianceParties.map((p) => ({
      logo: placeholderMediaId,
      name: p.name,
    })),
    endorsers: candidate.endorsers.map((e) => ({
      photo: placeholderMediaId,
      name: e.name,
    })),
    record: toLexicalRichText(candidate.record),
    funding: toLexicalRichText(candidate.funding),
    summaryTrajectory: candidate.summaryTrajectory,
    summaryProposals: candidate.summaryProposals,
    summaryControversies: candidate.summaryControversies,
    summaryAlliances: candidate.summaryAlliances,
    summaryRecord: candidate.summaryRecord,
    summaryFunding: candidate.summaryFunding,
    sources: candidate.sources,
    socialLinks: candidate.socialLinks,
  } satisfies Partial<Candidate>

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'candidates',
      id: existing.docs[0].id,
      data: candidateData,
    })
    return updated.id
  }

  const created = await payload.create({
    collection: 'candidates',
    data: candidateData,
  })
  return created.id
}

function inferImageExtension(contentType: string | null, url: string): string {
  if (contentType?.includes('png')) return '.png'
  if (contentType?.includes('webp')) return '.webp'
  if (contentType?.includes('gif')) return '.gif'
  if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return '.jpg'
  if (contentType?.includes('svg')) return '.svg'

  const pathname = new URL(url).pathname.toLowerCase()
  if (pathname.endsWith('.png')) return '.png'
  if (pathname.endsWith('.webp')) return '.webp'
  if (pathname.endsWith('.gif')) return '.gif'
  if (pathname.endsWith('.svg')) return '.svg'
  return '.jpg'
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

function resolveLocalPhotoPath(photoPath: string): string {
  if (photoPath.startsWith('~/')) {
    return path.resolve(os.homedir(), photoPath.slice(2))
  }

  if (path.isAbsolute(photoPath)) {
    return photoPath
  }

  return path.resolve(dirname, '..', photoPath)
}

async function ensureCandidatePhotoMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  candidate: CandidateSeed,
  fallbackMediaId: number,
): Promise<number> {
  const photoAlt = `${CANDIDATE_PHOTO_ALT_PREFIX}:${candidate.slug}`
  const mappedFileName = CANDIDATE_LOCAL_PHOTOS_BY_SLUG[candidate.slug]
  const localSourcePath = mappedFileName
    ? path.join(CANDIDATE_IMAGES_DIR, mappedFileName)
    : candidate.photoUrl && !isHttpUrl(candidate.photoUrl)
      ? resolveLocalPhotoPath(candidate.photoUrl)
      : undefined

  const existing = await payload.find({
    collection: 'media',
    where: {
      alt: { equals: photoAlt },
    },
    limit: 1,
  })

  if (existing.docs[0]) {
    if (localSourcePath && (await exists(localSourcePath))) {
      const updated = await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: { alt: photoAlt },
        filePath: localSourcePath,
      })
      return updated.id
    }

    return existing.docs[0].id
  }

  if (localSourcePath) {
    if (!(await exists(localSourcePath))) {
      payload.logger.warn(
        `Could not find local photo for ${candidate.slug} at "${localSourcePath}". Using placeholder.`,
      )
      return fallbackMediaId
    }

    const created = await payload.create({
      collection: 'media',
      data: { alt: photoAlt },
      filePath: localSourcePath,
    })
    return created.id
  }

  if (!candidate.photoUrl) {
    return fallbackMediaId
  }

  try {
    const response = await fetch(candidate.photoUrl)
    if (!response.ok) {
      payload.logger.warn(
        `Could not download photo for ${candidate.slug}. Status: ${response.status}. Using placeholder.`,
      )
      return fallbackMediaId
    }

    const extension = inferImageExtension(response.headers.get('content-type'), candidate.photoUrl)
    const temporaryImagePath = path.join(
      os.tmpdir(),
      `seed-candidate-${candidate.slug}-${Date.now()}${extension}`,
    )
    const imageBuffer = Buffer.from(await response.arrayBuffer())
    await fs.writeFile(temporaryImagePath, imageBuffer)

    try {
      const created = await payload.create({
        collection: 'media',
        data: { alt: photoAlt },
        filePath: temporaryImagePath,
      })
      return created.id
    } finally {
      await fs.rm(temporaryImagePath, { force: true })
    }
  } catch (error) {
    payload.logger.warn(
      `Could not fetch photo for ${candidate.slug}. Using placeholder. Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return fallbackMediaId
  }
}

async function loadCorrections(): Promise<CorrectionSeed[]> {
  if (!(await exists(CORRECTIONS_DATA_PATH))) {
    return []
  }

  const raw = await fs.readFile(CORRECTIONS_DATA_PATH, 'utf8')
  const parsed = JSON.parse(raw) as unknown

  if (!Array.isArray(parsed)) {
    throw new Error('data/corrections.json must be an array.')
  }

  return parsed.map((item) => {
    const correction = item as Partial<CorrectionSeed>

    if (!correction.candidateSlug || !correction.note || !correction.correctedAt) {
      throw new Error('Each correction must include candidateSlug, note, and correctedAt.')
    }

    return {
      candidateSlug: correction.candidateSlug,
      note: correction.note,
      correctedAt: correction.correctedAt,
    }
  })
}

async function upsertCorrection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  correction: CorrectionSeed,
  candidateId: number,
) {
  const existing = await payload.find({
    collection: 'corrections',
    where: {
      and: [
        { candidate: { equals: candidateId } },
        { correctedAt: { equals: correction.correctedAt } },
        { note: { equals: correction.note } },
      ],
    },
    limit: 1,
  })

  if (existing.docs[0]) {
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'corrections',
    data: {
      candidate: candidateId,
      note: correction.note,
      correctedAt: correction.correctedAt,
    },
  })

  return created.id
}

async function main() {
  dotenv.config({ path: ENV_PATH })
  dotenv.config({ path: ENV_LOCAL_PATH, override: true })

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('Missing PAYLOAD_SECRET. Set it in .env or .env.local before running seed.')
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL. Set it in .env or .env.local before running seed.')
  }

  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  try {
    const raw = await fs.readFile(CANDIDATES_DATA_PATH, 'utf8')
    const jsonData = JSON.parse(raw) as JsonDataFile
    const candidates = parseCandidatesFromJson(jsonData)

    if (candidates.length === 0) {
      throw new Error('No candidates were parsed from data/candidates.json.')
    }

    // Delete any candidates in the DB that are no longer in the JSON file.
    const keepSlugs = new Set(candidates.map((c) => c.slug))
    const allInDb = await payload.find({
      collection: 'candidates',
      limit: 1000,
      select: { slug: true },
    })
    for (const doc of allInDb.docs) {
      if (!keepSlugs.has(doc.slug)) {
        await payload.delete({ collection: 'candidates', id: doc.id })
        payload.logger.info(`Deleted stale candidate: ${doc.slug}`)
      }
    }

    const placeholderMediaId = await ensurePlaceholderMedia(payload)
    const candidateIdBySlug = new Map<string, number>()

    for (const candidate of candidates) {
      const candidatePhotoId = await ensureCandidatePhotoMedia(
        payload,
        candidate,
        placeholderMediaId,
      )
      const id = await upsertCandidate(payload, candidate, candidatePhotoId, placeholderMediaId)
      candidateIdBySlug.set(candidate.slug, id)
      payload.logger.info(`Seeded candidate: ${candidate.slug}`)
    }

    const corrections = await loadCorrections()
    for (const correction of corrections) {
      const candidateId = candidateIdBySlug.get(correction.candidateSlug)

      if (!candidateId) {
        throw new Error(
          `Correction references unknown candidate slug: ${correction.candidateSlug}.`,
        )
      }

      await upsertCorrection(payload, correction, candidateId)
      payload.logger.info(`Seeded correction for: ${correction.candidateSlug}`)
    }

    payload.logger.info(
      `Seed completed. Candidates: ${candidates.length}. Corrections: ${corrections.length}.`,
    )
  } finally {
    await payload.destroy()
  }
}

void main()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
