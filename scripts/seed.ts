import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { getPayload } from 'payload'
import type { Candidate } from '../src/payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const DATA_DIR = path.resolve(dirname, '../data')
const CORRECTIONS_DATA_PATH = path.resolve(dirname, '../data/corrections.json')
const PLACEHOLDER_ALT = '__seed_placeholder_candidate_photo__'
const CANDIDATE_PHOTO_ALT_PREFIX = '__seed_candidate_photo__'
const CANDIDATE_IMAGES_DIR = path.resolve(dirname, '../media')
const CANDIDATE_LOCAL_PHOTOS_BY_SLUG: Record<string, string> = {
  'ivan-cepeda': 'ivan-cepeda.webp',
  'abelardo-de-la-espriella': 'abelardo-espriella.webp',
  'sergio-fajardo': 'sergio-fajardo.webp',
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

type TrajectoryItemSeed = {
  role: string
  organization: string
  startYear: string
  endYear?: string
  location?: string
  description?: string
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
  publicTrajectoryItems: TrajectoryItemSeed[]
  privateTrajectoryItems: TrajectoryItemSeed[]
  proposals: string
  proposalItems: ProposalItemSeed[]
  controversies: string
  controversyItems: ControversyItemSeed[]
  alliances: string
  allianceParties: AlliancePartySeed[]
  endorsers: EndorserSeed[]
  record: string
  funding: string
  summaryTrajectory: string
  summaryProposals: string
  summaryControversies: string
  summaryAlliances: string
  summaryRecord: string
  summaryFunding: string
  sources: SourceSeed[]
  socialLinks: SocialLinkSeed[]
}

type CorrectionSeed = {
  candidateSlug: string
  note: string
  correctedAt: string
}

/** Shape of a per-candidate JSON file in data/<slug>.json */
type JsonCandidateFile = {
  name: string
  slug: string
  party: string
  currentOffice?: string
  photoUrl?: string
  lastUpdated?: string
  socialLinks?: { platform: string; url: string }[]
  biography: string
  publicTrajectoryItems?: {
    role: string
    organization: string
    startYear: string
    endYear?: string
    location?: string
    description?: string
  }[]
  privateTrajectoryItems?: {
    role: string
    organization: string
    startYear: string
    endYear?: string
    location?: string
    description?: string
  }[]
  proposals: string
  proposalItems?: {
    title: string
    description: string
    topic?: string
    sourceTitle: string
    sourceUrl: string
    sourceTier: string
  }[]
  controversies: string
  controversyItems?: {
    title: string
    description: string
    status: string
    year?: string
    sourceTitle: string
    sourceUrl: string
    sourceTier: string
  }[]
  alliances: string
  allianceParties?: { name: string }[]
  endorsers?: { name: string }[]
  record: string
  funding: string
  summaryTrajectory: string
  summaryProposals: string
  summaryControversies: string
  summaryAlliances: string
  summaryRecord: string
  summaryFunding: string
  sources: {
    section: string
    title: string
    publishedAt: string
    url: string
    tier: string
  }[]
}

const VALID_SOURCE_SECTIONS = new Set([
  'biography',
  'proposals',
  'controversies',
  'alliances',
  'record',
  'funding',
])

const VALID_SOURCE_TIERS = new Set(['oficial', 'prensa', 'ong', 'redes'])

const VALID_CONTROVERSY_STATUSES = new Set([
  'suspicion',
  'under_investigation',
  'indicted',
  'cleared',
  'convicted',
])

const VALID_SOCIAL_PLATFORMS = new Set(['x', 'instagram', 'facebook', 'youtube'])

function parseCandidateFromJsonFile(raw: JsonCandidateFile): CandidateSeed {
  const { slug, party, name } = raw

  if (!slug || !party || !name) {
    throw new Error(`Candidate JSON is missing required field(s): name, slug, or party.`)
  }

  const directoryOrder = CANDIDATE_DIRECTORY_ORDER_BY_SLUG[slug]

  const sources: SourceSeed[] = (raw.sources ?? [])
    .filter((s) => VALID_SOURCE_SECTIONS.has(s.section.toLowerCase()))
    .map((s) => ({
      section: s.section.toLowerCase() as SourceSection,
      title: s.title,
      publishedAt: s.publishedAt,
      url: s.url,
      tier: (VALID_SOURCE_TIERS.has(s.tier.toLowerCase())
        ? s.tier.toLowerCase()
        : 'prensa') as SourceTier,
    }))

  const socialLinks: SocialLinkSeed[] = (raw.socialLinks ?? [])
    .filter((sl) => VALID_SOCIAL_PLATFORMS.has(sl.platform))
    .map((sl) => ({ platform: sl.platform as SocialLinkSeed['platform'], url: sl.url }))

  const publicTrajectoryItems: TrajectoryItemSeed[] = (raw.publicTrajectoryItems ?? []).map(
    (item) => ({
      role: item.role,
      organization: item.organization,
      startYear: item.startYear,
      endYear: item.endYear || undefined,
      location: item.location || undefined,
      description: item.description || undefined,
    }),
  )

  const privateTrajectoryItems: TrajectoryItemSeed[] = (raw.privateTrajectoryItems ?? []).map(
    (item) => ({
      role: item.role,
      organization: item.organization,
      startYear: item.startYear,
      endYear: item.endYear || undefined,
      location: item.location || undefined,
      description: item.description || undefined,
    }),
  )

  const proposalItems: ProposalItemSeed[] = (raw.proposalItems ?? []).map((item) => ({
    title: item.title,
    description: item.description,
    topic: item.topic || undefined,
    sourceTitle: item.sourceTitle,
    sourceUrl: item.sourceUrl,
    sourceTier: (VALID_SOURCE_TIERS.has(item.sourceTier.toLowerCase())
      ? item.sourceTier.toLowerCase()
      : 'prensa') as SourceTier,
  }))

  const controversyItems: ControversyItemSeed[] = (raw.controversyItems ?? []).map((item) => ({
    title: item.title,
    description: item.description,
    status: (VALID_CONTROVERSY_STATUSES.has(item.status)
      ? item.status
      : 'suspicion') as ControversyStatus,
    year: item.year || undefined,
    sourceTitle: item.sourceTitle,
    sourceUrl: item.sourceUrl,
    sourceTier: (VALID_SOURCE_TIERS.has(item.sourceTier.toLowerCase())
      ? item.sourceTier.toLowerCase()
      : 'prensa') as SourceTier,
  }))

  const allianceParties: AlliancePartySeed[] = (raw.allianceParties ?? []).map((p) => ({
    name: p.name,
  }))

  const endorsers: EndorserSeed[] = (raw.endorsers ?? []).map((e) => ({ name: e.name }))

  const {
    summaryTrajectory,
    summaryProposals,
    summaryControversies,
    summaryAlliances,
    summaryRecord,
    summaryFunding,
  } = raw

  if (
    !directoryOrder ||
    !summaryTrajectory ||
    !summaryProposals ||
    !summaryControversies ||
    !summaryAlliances ||
    !summaryRecord ||
    !summaryFunding
  ) {
    throw new Error(`Missing summary fields or directory order for candidate "${name}" (${slug}).`)
  }

  return {
    name,
    slug,
    directoryOrder,
    party,
    currentOffice: raw.currentOffice,
    photoUrl: raw.photoUrl,
    biography: raw.biography,
    publicTrajectoryItems,
    privateTrajectoryItems,
    proposals: raw.proposals,
    proposalItems,
    controversies: raw.controversies,
    controversyItems,
    alliances: raw.alliances,
    allianceParties,
    endorsers,
    record: raw.record,
    funding: raw.funding,
    summaryTrajectory,
    summaryProposals,
    summaryControversies,
    summaryAlliances,
    summaryRecord,
    summaryFunding,
    sources,
    socialLinks,
  }
}

async function loadCandidatesFromDataDir(): Promise<CandidateSeed[]> {
  const entries = await fs.readdir(DATA_DIR)
  const candidateFiles = entries.filter(
    (f) => f.endsWith('.json') && !f.startsWith('corrections') && f !== 'candidates.json',
  )

  if (candidateFiles.length === 0) {
    throw new Error(`No candidate JSON files found in ${DATA_DIR}.`)
  }

  const candidates: CandidateSeed[] = []

  for (const file of candidateFiles) {
    const filePath = path.join(DATA_DIR, file)
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as JsonCandidateFile
    candidates.push(parseCandidateFromJsonFile(parsed))
  }

  return candidates
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
    publicTrajectoryItems: candidate.publicTrajectoryItems,
    privateTrajectoryItems: candidate.privateTrajectoryItems,
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
    const candidates = await loadCandidatesFromDataDir()

    if (candidates.length === 0) {
      throw new Error('No candidates were parsed from data/ directory.')
    }

    // Delete any candidates in the DB that are no longer in the JSON files.
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
