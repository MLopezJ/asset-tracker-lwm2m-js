import { describe, it } from 'node:test'
import assert from 'node:assert'
import { Humidity_3304_urn, type Temperature_3303 } from '../schemas/index.js'
import { getEnv } from './getEnv.js'
import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './ValidationError.js'

void describe('getEnv', () => {
	void it(`should create the 'env' object expected by 'nRF Asset Tracker Reported'`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
				'5518': 1675874731,
			},
		]
		const humidity = [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
				'5518': 1675874731,
			},
		]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
				'5518': 1675874731,
			},
		]
		const env = getEnv({ temperature, humidity, pressure }) as {
			result: unknown
		}
		const expected = {
			v: {
				temp: 27.18,
				hum: 24.057,
				atmp: 10,
			},
			ts: 1675874731000,
		}

		assert.deepEqual(env.result, expected)
	})

	void it(`should return a warning if the dependent LwM2M objects to create the 'env' object are not defined`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
				'5518': 1675874731,
			},
		]
		const humidity = undefined
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
				'5518': 1675874731,
			},
		]
		const result = getEnv({ temperature, humidity, pressure }) as {
			error: UndefinedLwM2MObjectWarning
		}
		assert.equal(
			result.error.message,
			`'env' object can not be created because LwM2M object id '3304' is undefined`,
		)
		assert.deepEqual(
			result.error.undefinedLwM2MObject,
			parseURN(Humidity_3304_urn),
		)
	})

	void it(`should return an error if the result of the conversion does not meet the schema definition`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				//'5700': 27.18, // required resource is missing
				'5701': 'Cel',
				'5518': 1675874731,
			},
		] as unknown as Temperature_3303
		const humidity = [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
				'5518': 1675874731,
			},
		]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
				'5518': 1675874731,
			},
		]
		const result = getEnv({ temperature, humidity, pressure }) as {
			error: ValidationError
		}
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const checkMessage = message?.includes("must have required property 'temp'")
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(checkMessage, true)
		assert.equal(keyword, 'required')
	})
})
