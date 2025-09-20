#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

  for (const file of files) {
    console.log(`Running migration: ${file}`)
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')

    try {
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) throw error
      console.log(`✓ ${file} completed`)
    } catch (error) {
      console.error(`✗ ${file} failed:`, error.message)
      process.exit(1)
    }
  }
}

async function seedData() {
  console.log('Seeding initial genres...')

  const movieGenres = [
    { id: 28, name: 'Action', type: 'movie' },
    { id: 12, name: 'Adventure', type: 'movie' },
    { id: 16, name: 'Animation', type: 'movie' },
    { id: 35, name: 'Comedy', type: 'movie' },
    { id: 80, name: 'Crime', type: 'movie' },
    { id: 99, name: 'Documentary', type: 'movie' },
    { id: 18, name: 'Drama', type: 'movie' },
    { id: 10751, name: 'Family', type: 'movie' },
    { id: 14, name: 'Fantasy', type: 'movie' },
    { id: 36, name: 'History', type: 'movie' },
    { id: 27, name: 'Horror', type: 'movie' },
    { id: 10402, name: 'Music', type: 'movie' },
    { id: 9648, name: 'Mystery', type: 'movie' },
    { id: 10749, name: 'Romance', type: 'movie' },
    { id: 878, name: 'Science Fiction', type: 'movie' },
    { id: 10770, name: 'TV Movie', type: 'movie' },
    { id: 53, name: 'Thriller', type: 'movie' },
    { id: 10752, name: 'War', type: 'movie' },
    { id: 37, name: 'Western', type: 'movie' },
  ]

  const tvGenres = [
    { id: 10759, name: 'Action & Adventure', type: 'tv' },
    { id: 16, name: 'Animation', type: 'tv' },
    { id: 35, name: 'Comedy', type: 'tv' },
    { id: 80, name: 'Crime', type: 'tv' },
    { id: 99, name: 'Documentary', type: 'tv' },
    { id: 18, name: 'Drama', type: 'tv' },
    { id: 10751, name: 'Family', type: 'tv' },
    { id: 10762, name: 'Kids', type: 'tv' },
    { id: 9648, name: 'Mystery', type: 'tv' },
    { id: 10763, name: 'News', type: 'tv' },
    { id: 10764, name: 'Reality', type: 'tv' },
    { id: 10765, name: 'Sci-Fi & Fantasy', type: 'tv' },
    { id: 10766, name: 'Soap', type: 'tv' },
    { id: 10767, name: 'Talk', type: 'tv' },
    { id: 10768, name: 'War & Politics', type: 'tv' },
    { id: 37, name: 'Western', type: 'tv' },
  ]

  const { error } = await supabase
    .from('genres')
    .upsert([...movieGenres, ...tvGenres], { onConflict: 'id,type' })

  if (error) {
    console.error('Error seeding genres:', error)
  } else {
    console.log('✓ Genres seeded successfully')
  }
}

async function main() {
  console.log('Initializing database...')
  await runMigrations()
  await seedData()
  console.log('Database initialization complete!')
}

main().catch(console.error)