import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { getPayload } from 'payload'
import type { Candidate } from '../src/payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const CANDIDATES_DATA_PATH = path.resolve(dirname, '../data/candidates.md')
const CORRECTIONS_DATA_PATH = path.resolve(dirname, '../data/corrections.json')
const PLACEHOLDER_ALT = '__seed_placeholder_candidate_photo__'
const CANDIDATE_PHOTO_ALT_PREFIX = '__seed_candidate_photo__'
const CANDIDATE_IMAGES_DIR = path.resolve(dirname, '../media')
const CANDIDATE_LOCAL_PHOTOS_BY_SLUG: Record<string, string> = {
  'vicky-davila': 'vicky-davila.webp',
  'juan-manuel-galan': 'juan-manuel-galan.webp',
  'daniel-quintero': 'daniel-quintero.webp',
  'ivan-cepeda': 'ivan-cepeda.webp',
  'enrique-penalosa': 'enrique-penalosa.webp',
  'camilo-romero': 'camilo-romero.webp',
  'paloma-valencia': 'paloma-valencia.webp',
  'roy-barreras': 'roy-barreras.webp',
  'clara-lopez': 'clara-lopez.webp',
  'juan-daniel-oviedo': 'juan-daniel-oviedo.webp',
  'juan-carlos-pinzon': 'juan-carlos-pinzon.webp',
  'anibal-gaviria': 'anibal-gaviria.webp',
  'david-luna': 'david-luna.webp',
  'mauricio-cardenas': 'mauricio-cardenas.webp',
  'santiago-botero': 'santiago-botero.webp',
  'abelardo-de-la-espriella': 'abelardo-espriella.webp',
  'felipe-cordoba': 'felipe-cordoba.webp',
  'daniel-palacios': 'daniel-palacios.webp',
  'efrain-cepeda': 'efrain-cepeda.webp',
  'sergio-fajardo': 'sergio-fajardo.webp',
  'norman-maurice-armitage': 'armitage.webp',
  'carlos-caicedo': 'carlos-caicedo.webp',
  'claudia-lopez': 'claudia-lopez.webp',
  'luis-gilberto-murillo': 'luis-gilberto-murillo.webp',
  'juan-fernando-cristo': 'juan-fernando-cristo.webp',
  'luis-carlos-reyes': 'luis-carlos-reyes.webp',
}
const ENV_PATH = path.resolve(dirname, '../.env')
const ENV_LOCAL_PATH = path.resolve(dirname, '../.env.local')

type SourceSection = 'biography' | 'proposals' | 'controversies' | 'alliances' | 'record' | 'funding'

type CandidateSeed = {
  name: string
  slug: string
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
  sources: {
    section: SourceSection
    title: string
    publishedAt: string
    url: string
    tier: 'oficial' | 'prensa' | 'ong' | 'redes'
  }[]
}

type CorrectionSeed = {
  candidateSlug: string
  note: string
  correctedAt: string
}

function normalizeMarkdown(value: string): string {
  return value.replace(/\r\n/g, '\n')
}

function getMatch(source: string, regex: RegExp): string | undefined {
  const match = source.match(regex)
  return match?.[1]?.trim()
}

function getSection(block: string, heading: string, nextHeadings: string[]): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const nextPart = nextHeadings
    .map((nextHeading) => nextHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')

  const sectionRegex = nextPart
    ? new RegExp(`### ${escapedHeading}\\n\\n([\\s\\S]*?)(?=\\n### (?:${nextPart})\\n|$)`)
    : new RegExp(`### ${escapedHeading}\\n\\n([\\s\\S]*)$`)

  return getMatch(block, sectionRegex) ?? ''
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

function parseSources(tableContent: string): CandidateSeed['sources'] {
  const rows = tableContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !line.includes('---'))

  // Drop header row if present.
  const dataRows =
    rows.length > 0 && rows[0].toLowerCase().includes('sección')
      ? rows.slice(1)
      : rows

  return dataRows
    .map((line) => line.slice(1, -1).split('|').map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 5)
    .map((cells) => ({
      section: cells[0].toLowerCase() as SourceSection,
      title: cells[1],
      publishedAt: cells[2],
      url: cells[3],
      tier: cells[4].toLowerCase() as CandidateSeed['sources'][number]['tier'],
    }))
    .filter((source) =>
      ['biography', 'proposals', 'controversies', 'alliances', 'record', 'funding'].includes(
        source.section,
      ),
    )
}

function parseCandidates(markdown: string): CandidateSeed[] {
  const normalized = normalizeMarkdown(markdown)
  const blocks = normalized.split(/\n## \d+\.\s+/).slice(1)

  return blocks.reduce<CandidateSeed[]>((acc, block) => {
      const name = block.split('\n', 1)[0].trim()
      const slug = getMatch(block, /- \*\*slug:\*\*\s*(.+)/)
      const party = getMatch(block, /- \*\*party:\*\*\s*(.+)/)
      const currentOffice = getMatch(block, /- \*\*currentOffice:\*\*\s*(.+)/)
      const photoUrl = getMatch(block, /- \*\*photoUrl:\*\*\s*(.+)/)

      const biography = getSection(block, 'Biografía y trayectoria', [
        'Plan de gobierno y propuestas',
      ])
      const proposals = getSection(block, 'Plan de gobierno y propuestas', [
        'Escándalos y controversias',
      ])
      const controversies = getSection(block, 'Escándalos y controversias', ['Alianzas y avales'])
      const alliances = getSection(block, 'Alianzas y avales', [
        'Registro legislativo y de gobierno',
      ])
      const record = getSection(block, 'Registro legislativo y de gobierno', [
        'Patrimonio, financiación y campaña',
      ])
      const funding = getSection(block, 'Patrimonio, financiación y campaña', [
        'Resúmenes para comparar',
      ])
      const summarySection = getSection(block, 'Resúmenes para comparar', ['Fuentes'])
      const sourcesSection = getSection(block, 'Fuentes', [])

      if (!slug || !party) {
        return acc
      }

      const summaryTrajectory = getMatch(summarySection, /- \*\*summaryTrajectory:\*\*\s*(.+)/)
      const summaryProposals = getMatch(summarySection, /- \*\*summaryProposals:\*\*\s*(.+)/)
      const summaryControversies = getMatch(
        summarySection,
        /- \*\*summaryControversies:\*\*\s*(.+)/,
      )
      const summaryAlliances = getMatch(summarySection, /- \*\*summaryAlliances:\*\*\s*(.+)/)
      const summaryRecord = getMatch(summarySection, /- \*\*summaryRecord:\*\*\s*(.+)/)
      const summaryFunding = getMatch(summarySection, /- \*\*summaryFunding:\*\*\s*(.+)/)

      if (
        !summaryTrajectory ||
        !summaryProposals ||
        !summaryControversies ||
        !summaryAlliances ||
        !summaryRecord ||
        !summaryFunding
      ) {
        throw new Error(`Missing summary fields for candidate "${name}" (${slug}).`)
      }

      acc.push({
        name,
        slug,
        party,
        currentOffice,
        photoUrl,
        biography,
        proposals,
        controversies,
        alliances,
        record,
        funding,
        summaryTrajectory,
        summaryProposals,
        summaryControversies,
        summaryAlliances,
        summaryRecord,
        summaryFunding,
        sources: parseSources(sourcesSection),
      })

      return acc
    }, [])
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function ensurePlaceholderMedia(payload: Awaited<ReturnType<typeof getPayload>>): Promise<number> {
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
    party: candidate.party,
    currentOffice: candidate.currentOffice,
    photo: photoId,
    lastUpdated: new Date().toISOString(),
    biography: toLexicalRichText(candidate.biography),
    proposals: toLexicalRichText(candidate.proposals),
    controversies: toLexicalRichText(candidate.controversies),
    alliances: toLexicalRichText(candidate.alliances),
    record: toLexicalRichText(candidate.record),
    funding: toLexicalRichText(candidate.funding),
    summaryTrajectory: candidate.summaryTrajectory,
    summaryProposals: candidate.summaryProposals,
    summaryControversies: candidate.summaryControversies,
    summaryAlliances: candidate.summaryAlliances,
    summaryRecord: candidate.summaryRecord,
    summaryFunding: candidate.summaryFunding,
    sources: candidate.sources,
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
    const markdown = await fs.readFile(CANDIDATES_DATA_PATH, 'utf8')
    const candidates = parseCandidates(markdown)

    if (candidates.length === 0) {
      throw new Error('No candidates were parsed from data/candidates.md.')
    }

    const placeholderMediaId = await ensurePlaceholderMedia(payload)
    const candidateIdBySlug = new Map<string, number>()

    for (const candidate of candidates) {
      const candidatePhotoId = await ensureCandidatePhotoMedia(
        payload,
        candidate,
        placeholderMediaId,
      )
      const id = await upsertCandidate(payload, candidate, candidatePhotoId)
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
