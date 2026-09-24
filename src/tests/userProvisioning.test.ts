import { describe, it } from 'node:test'
import assert from 'node:assert'

export interface UserProvisionPayload {
  employee_id: number
  sso_user_id: string
  role_name: string
  email?: string
}

export function validateUserProvisionPayload(payload: Partial<UserProvisionPayload>): string | null {
  if (!payload.employee_id || payload.employee_id <= 0) {
    return 'Please select a valid employee profile'
  }
  if (!payload.sso_user_id || !payload.sso_user_id.trim()) {
    return 'Microsoft Entra Object ID (OID) is required'
  }
  const validRoles = ['Admin', 'Manager', 'Employee']
  if (!payload.role_name || !validRoles.includes(payload.role_name)) {
    return 'Please select a valid application role'
  }
  return null
}

export function parseUserCsvHeaders(headerLine: string): { valid: boolean; missing: string[] } {
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase())
  const required = ['employee_id', 'email', 'entra_oid', 'role']
  const missing = required.filter((col) => !headers.includes(col))
  return { valid: missing.length === 0, missing }
}

describe('User Provisioning Frontend Validation', () => {
  it('validates a valid provision payload', () => {
    const error = validateUserProvisionPayload({
      employee_id: 10,
      sso_user_id: '8c17f5d5-1234-abcd',
      role_name: 'Employee',
      email: 'user@company.com',
    })
    assert.strictEqual(error, null)
  })

  it('rejects missing or zero employee_id', () => {
    const error = validateUserProvisionPayload({
      employee_id: 0,
      sso_user_id: '8c17f5d5-1234-abcd',
      role_name: 'Employee',
    })
    assert.strictEqual(error, 'Please select a valid employee profile')
  })

  it('rejects empty or whitespace Entra OID', () => {
    const error = validateUserProvisionPayload({
      employee_id: 10,
      sso_user_id: '   ',
      role_name: 'Employee',
    })
    assert.strictEqual(error, 'Microsoft Entra Object ID (OID) is required')
  })

  it('rejects invalid application role', () => {
    const error = validateUserProvisionPayload({
      employee_id: 10,
      sso_user_id: '8c17f5d5-1234-abcd',
      role_name: 'SuperAdmin',
    })
    assert.strictEqual(error, 'Please select a valid application role')
  })

  it('validates CSV headers correctly', () => {
    const valid = parseUserCsvHeaders('employee_id,email,entra_oid,role')
    assert.strictEqual(valid.valid, true)
    assert.strictEqual(valid.missing.length, 0)

    const invalid = parseUserCsvHeaders('employee_id,email,role')
    assert.strictEqual(invalid.valid, false)
    assert.deepStrictEqual(invalid.missing, ['entra_oid'])
  })
})
