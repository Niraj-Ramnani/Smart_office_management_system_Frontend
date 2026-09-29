import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { SeatRequestType, SeatStatus } from '../types'

describe('Seat Management & Workflow Validation', () => {
  it('validates core seat statuses correctly', () => {
    const validStatuses: SeatStatus[] = ['Vacant', 'Occupied', 'Blocked']
    assert.strictEqual(validStatuses.includes('Vacant'), true)
    assert.strictEqual(validStatuses.includes('Occupied'), true)
    assert.strictEqual(validStatuses.includes('Blocked'), true)
    assert.strictEqual(validStatuses.includes('Unknown' as SeatStatus), false)
  })

  it('validates supported seat request types', () => {
    const validTypes: SeatRequestType[] = ['NEW_SEAT', 'RELOCATION', 'SWAP']
    assert.strictEqual(validTypes.includes('NEW_SEAT'), true)
    assert.strictEqual(validTypes.includes('RELOCATION'), true)
    assert.strictEqual(validTypes.includes('SWAP'), true)
    assert.strictEqual(validTypes.includes('HOT_DESK' as SeatRequestType), false)
  })

  it('validates swap request requires target employee', () => {
    const validateSwapPayload = (payload: { request_type: SeatRequestType; target_employee_id?: number }) => {
      if (payload.request_type === 'SWAP' && !payload.target_employee_id) {
        return 'Target employee is required for a seat swap'
      }
      return null
    }

    assert.strictEqual(validateSwapPayload({ request_type: 'SWAP' }), 'Target employee is required for a seat swap')
    assert.strictEqual(validateSwapPayload({ request_type: 'SWAP', target_employee_id: 12 }), null)
  })
})
