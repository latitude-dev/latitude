#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFile } from 'fs/promises'

const CURRENT_FILE = fileURLToPath(import.meta.url)
const CURRENT_DIR = dirname(CURRENT_FILE)
const PACKAGE_JSON_FILE = join(CURRENT_DIR, '..', 'package.json')

export async function getPackageVersion() {
  try {
    const packageJson = await readFile(PACKAGE_JSON_FILE, 'utf8')
    const parsedPackageJson = JSON.parse(packageJson)
    return parsedPackageJson.version
  } catch (error) {
    console.error('Error reading package.json:', error)
    return null
  }
}
