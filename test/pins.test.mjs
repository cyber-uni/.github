// Every `uses:` in this repo must be one of:
//   - a third-party action pinned to a full commit SHA, with its tag in a comment
//   - a docker image pinned to a digest, with its tag in a comment
//   - this repo's own action, at the major alias of the current line
//
// A consumer pinning `@v1` trusts every ref inside it. A movable tag on a third-party
// action, or `@main` on our own, hands that trust to whoever moves it next.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const LINE = 'v1'
const SELF = 'cyberuni-agent/.github/'

function yamlFiles(dir) {
	return readdirSync(dir, { withFileTypes: true, recursive: true })
		.filter((e) => e.isFile() && /\.ya?ml$/.test(e.name))
		.map((e) => join(e.parentPath, e.name))
}

const files = [...yamlFiles('.github/workflows'), ...yamlFiles('.github/actions'), ...yamlFiles('workflow-templates')]

const refs = files.flatMap((file) =>
	readFileSync(file, 'utf8')
		.split('\n')
		.flatMap((line, i) => {
			const m = line.match(/^\s*(?:-\s+)?uses:\s*(\S+)(.*)$/)
			return m ? [{ file, line: i + 1, ref: m[1], rest: m[2].trim() }] : []
		}),
)

test('finds the uses: lines it checks', () => {
	assert.ok(refs.length > 10, `only found ${refs.length}`)
})

for (const { file, line, ref, rest } of refs) {
	const where = `${file}:${line} ${ref}`
	if (ref.startsWith('./')) continue
	if (ref.startsWith(SELF)) {
		test(`${where} uses the ${LINE} alias`, () => {
			assert.ok(ref.endsWith(`@${LINE}`), `${where}: own refs must be @${LINE}`)
		})
	} else if (ref.startsWith('docker://')) {
		test(`${where} is digest-pinned`, () => {
			assert.match(ref, /@sha256:[0-9a-f]{64}$/, where)
			assert.match(rest, /^# \S+/, `${where}: add the tag as a trailing comment`)
		})
	} else {
		test(`${where} is SHA-pinned`, () => {
			assert.match(ref, /@[0-9a-f]{40}$/, where)
			assert.match(rest, /^# v\d/, `${where}: add the tag as a trailing comment`)
		})
	}
}
