import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { getRoam } from './getRoam.js'
import { typeError } from '../converter.js'

void describe('getRoam', () => {
	void it(`should create roam object`, () => {
		const connectivityMonitoring = {
			'0': 6,
			'1': [7, 6],
			'2': -85,
			'3': 23,
			'4': ['10.160.120.155'],
			'8': 34237196,
			'9': 20,
			'10': 242,
			'12': 12,
		}

		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'7': [2754],
			'11': [0],
			/**
			 * Timestamp is taken from resource 13.
			 * @see {@link adr/010-roam-timestamp-not-supported-by-lwm2m.md}
			 *
			 */
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}

		const metadata = {
			[ConnectivityMonitoring_4_urn]: {
				'0': new Date('2023-07-07T12:11:03.0324459Z'),
				'1': [
					new Date('2023-07-07T12:11:03.0324459Z'),
					new Date('2023-07-07T12:11:03.0324459Z'),
				],
				'2': new Date('2023-07-07T12:11:03.0324459Z'),
				'3': new Date('2023-07-07T12:11:03.0324459Z'),
				'4': [new Date('2023-07-07T12:11:03.0324459Z')],
				'8': new Date('2023-07-07T12:11:03.0324459Z'),
				'9': new Date('2023-07-07T12:11:03.0324459Z'),
				'10': new Date('2023-07-07T12:11:03.0324459Z'),
				'12': new Date('2023-08-03T12:11:03.0324459Z'),
			},
		}

		const roam = getRoam(connectivityMonitoring, device, metadata) as {
			result: unknown
		}
		const expected = {
			v: {
				nw: '6', //'NB-IoT',
				rsrp: -85,
				area: 12,
				mccmnc: 24220,
				cell: 34237196,
				ip: '10.160.120.155',
			},
			ts: 1675874731000,
		}
		assert.deepEqual(roam.result, expected)
	})

	void it(`should return error if Connectivity Monitoring (4) object is missing`, () => {
		const metadata = {}
		const connectivityMonitoring = undefined
		const device = undefined
		const result = getRoam(connectivityMonitoring, device, metadata) as {
			error: Error
		}
		assert.equal(
			result.error.message,
			'Connectivity Monitoring (4) object is undefined',
		)
	})

	void it(`should return error if required resource is missing`, () => {
		const connectivityMonitoring = {
			'0': 6,
			'1': [6, 7],
			'2': -85,
			'3': 23,
			// required resource is missing '4': ['10.160.120.155']
			'8': 34237196,
			'9': 20,
			'10': 242,
			'12': 12,
		} as ConnectivityMonitoring_4
		const metadata = {}
		const result = getRoam(connectivityMonitoring, undefined, metadata) as {
			error: typeError
		}
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(message, "must have required property 'ip'")
		assert.equal(keyword, 'required')
	})
})
