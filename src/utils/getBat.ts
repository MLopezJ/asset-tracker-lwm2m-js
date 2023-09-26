import {
	Battery,
	type BatteryData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { Device_3_urn, type Device_3 } from '../schemas/index.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { ValidationError, UndefinedLwM2MObjectWarning } from '../converter.js'

type GetBatResult =
	| { result: BatteryData }
	| { error: ValidationError }
	| { warning: UndefinedLwM2MObjectWarning }
/**
 * Takes object id 3 (device) from 'LwM2M Asset Tracker v2' and convert into 'bat' object from 'nRF Asset Tracker Reported'
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/battery.md
 */
export const getBat = (device?: Device_3): GetBatResult => {
	if (device === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'bat',
				LwM2MObjectUrn: Device_3_urn,
			}),
		}

	/**
	 * First element of resource selected
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/005-element-selected-when-multiple-resource.md
	 */
	const value = device['7']?.[0]
	const time = getTime(device)

	const object = {
		v: value,
		ts: time,
	}

	return validateAgainstSchema(object, Battery)
}

/**
 * Resource selected to reporte timestamp value is 13.
 * Value is in seconds and it is multiplied to transform to milliseconds.
 */
export const getTime = (device: Device_3): number | undefined =>
	device['13'] !== undefined ? device['13'] * 1000 : undefined
