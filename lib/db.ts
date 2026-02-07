import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export type Contestant = {
  id: number
  name: string
  age: number | null
  season: string
  profession: string | null
  bio: string | null
  image_url: string | null
  status: 'active' | 'eliminated'
  final_rank: number | null
  eliminated_at: string | null
  created_at: string
}

export type User = {
  id: number
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export type Ranking = {
  id: number
  user_id: number
  contestant_id: number
  predicted_position: number
  locked: boolean
  created_at: string
  updated_at: string
}

export type Score = {
  id: number
  user_id: number
  current_total: number
  perfect_matches: number
  one_off_matches: number
  two_off_matches: number
  top3_bonuses: number
  updated_at: string
}

export type RankingWithContestant = Ranking & {
  contestant: Contestant
}
