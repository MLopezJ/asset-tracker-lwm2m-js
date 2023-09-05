import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	Location_6_urn,
	Temperature_3303_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Config_50009_urn } from './schemas/Config_50009.js'
import { converter, type Metadata } from './converter.js'

void describe('converter', () => {
	void it('should convert LwM2M Asset Tracker v2 format into nRF Asset Tracker format', () => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754],
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},

			[ConnectivityMonitoring_4_urn]: {
				'0': 6,
				'1': [6, 7],
				'2': -85,
				'3': 23,
				'4': ['10.160.120.155'],
				'8': 34237196,
				'9': 20,
				'10': 242,
				'12': 12,
			},

			[Location_6_urn]: {
				'0': -43.5723,
				'1': 153.2176,
				'2': 2,
				'3': 24.798573,
				'5': 1665149633,
				'6': 0.579327,
			},

			[Temperature_3303_urn]: [
				{
					'5601': 27.18,
					'5602': 27.71,
					'5700': 27.18,
					'5701': 'Cel',
				},
			],

			[Humidity_3304_urn]: [
				{
					'5601': 23.535,
					'5602': 24.161,
					'5700': 24.057,
					'5701': '%RH',
				},
			],

			[Pressure_3323_urn]: [
				{
					'5601': 101697,
					'5602': 101705,
					'5700': 10,
					'5701': 'Pa',
				},
			],

			[Config_50009_urn]: {
				'0': true,
				'1': 120,
				'2': 120,
				'3': 600,
				'4': 7200,
				'5': 8.5,
				'6': false,
				'7': true,
				'8': 2.5,
				'9': 0.5,
			},
		}
		const metadata = {
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			lwm2m: {
				'3': {
					'0': {
						'0': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						'3': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						'7': {
							$lastUpdated: '2023-08-03T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-08-03T12:11:03.0324459Z',
							},
						},
						'13': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			},
		}

		const output = {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			env: {
				v: {
					temp: 27.18,
					hum: 24.057,
					atmp: 10,
				},
				ts: 1688731863032,
			},
			gnss: {
				v: {
					lng: 153.2176,
					lat: -43.5723,
					acc: 24.798573,
					alt: 2,
					spd: 0.579327,
					hdg: 0, // ***** origin missing *****
				},
				ts: 1665149633000,
			},
			cfg: {
				loct: 120,
				act: true,
				actwt: 120,
				mvres: 600,
				mvt: 7200,
				accath: 8.5,
				accith: 2.5,
				accito: 0.5,
				nod: [],
			},
			dev: {
				v: {
					imei: '351358815340515',
					iccid: '0000000000000000000', // ***** origin missing *****
					modV: '22.8.1+0',
					brdV: 'Nordic Semiconductor ASA',
				},
				ts: 1675874731000,
			},
			roam: {
				v: {
					band: 1, // ***** origin missing *****
					nw: '6',
					rsrp: -85,
					area: 12,
					mccmnc: 24220,
					cell: 34237196,
					ip: '10.160.120.155',
					eest: 5, // ***** origin missing *****
				},
				ts: 1688731863032,
			},
		}

		assert.deepEqual(converter(input, metadata), output)
	})

	void it(`should create output even when some expected objects in the input are missing`, () => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754],
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},
		}
		const metadata = {
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			lwm2m: {
				'3': {
					'0': {
						'0': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						'3': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						'7': {
							$lastUpdated: '2023-08-03T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-08-03T12:11:03.0324459Z',
							},
						},
						'13': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			},
		}

		const output = {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			dev: {
				v: {
					imei: '351358815340515',
					iccid: '0000000000000000000', // ***** origin missing *****
					modV: '22.8.1+0',
					brdV: 'Nordic Semiconductor ASA',
				},
				ts: 1675874731000,
			},
		}

		assert.deepEqual(converter(input, metadata), output)
	})

	void it(`should select first instance when LwM2M object is an array`, () => {
		const input = {
			[Temperature_3303_urn]: [
				{
					'5601': 27.18,
					'5602': 27.71,
					'5700': 27.18,
					'5701': 'Cel',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Cel',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Cel',
					'5518': 1675874731,
				},
			],

			[Humidity_3304_urn]: [
				{
					'5601': 23.535,
					'5602': 24.161,
					'5700': 24.057,
					'5701': '%RH',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': '%RH',
					'5518': 1675874731,
				},
			],

			[Pressure_3323_urn]: [
				{
					'5601': 101697,
					'5602': 101705,
					'5700': 10,
					'5701': 'Pa',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Pa',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Pa',
					'5518': 1675874731,
				},
			],
		}

		const output = {
			env: {
				v: {
					temp: 27.18,
					hum: 24.057,
					atmp: 10,
				},
				ts: 1675874731000,
			},
		}
		assert.deepEqual(converter(input, {} as Metadata), output)
	})

	void it(`should select first element when LwM2M instance is an array`, () => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754, 0, 1, 2, 3, 4, 5, 6, 7],
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},
		}

		const output = {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			dev: {
				ts: 1675874731000,
				v: {
					brdV: 'Nordic Semiconductor ASA',
					iccid: '0000000000000000000',
					imei: '351358815340515',
					modV: '22.8.1+0',
				},
			},
		}

		assert.deepEqual(converter(input, {} as Metadata), output)
	})
})
