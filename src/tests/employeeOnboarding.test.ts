import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { EmployeeCreatePayload } from '../types'

export function validateEmployeeOnboardingPayload(payload: Partial<EmployeeCreatePayload>): string | null {
  if (!payload.employee_code || !payload.employee_code.trim()) {
    return 'Employee code is required'
  }
  if (!payload.first_name || !payload.first_name.trim()) {
    return 'First name is required'
  }
  if (!payload.last_name || !payload.last_name.trim()) {
    return 'Last name is required'
  }
  if (!payload.email || !payload.email.trim() || !payload.email.includes('@')) {
    return 'A valid corporate Entra email address is required'
  }
  const validRoles = ['Admin', 'Manager', 'Employee']
  if (payload.role_name && !validRoles.includes(payload.role_name)) {
    return 'Invalid application role selected'
  }
  return null
}

export function parseEmployeeCsvHeaders(headerLine: string): { valid: boolean; missing: string[] } {
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase())
  const required = ['employee_code', 'first_name', 'last_name', 'email', 'designation', 'department', 'employment_type']
  const missing = required.filter((col) => !headers.includes(col))
  return { valid: missing.length === 0, missing }
}

describe('Single & Bulk Employee Onboarding Validation', () => {
  it('validates a complete employee onboarding payload with role', () => {
    const error = validateEmployeeOnboardingPayload({
      employee_code: 'EMP-001',
      first_name: 'Amit',
      last_name: 'Sharma',
      email: 'amit.sharma@company.com',
      department: 'Engineering',
      designation: 'Staff Engineer',
      employment_type: 'FULL_TIME',
      employee_status: 'ACTIVE',
      role_name: 'Manager',
    })
    assert.strictEqual(error, null)
  })

  it('rejects missing employee code', () => {
    const error = validateEmployeeOnboardingPayload({
      employee_code: '',
      first_name: 'Amit',
      last_name: 'Sharma',
      email: 'amit.sharma@company.com',
    })
    assert.strictEqual(error, 'Employee code is required')
  })

  it('rejects invalid email address', () => {
    const error = validateEmployeeOnboardingPayload({
      employee_code: 'EMP-001',
      first_name: 'Amit',
      last_name: 'Sharma',
      email: 'invalid-email',
    })
    assert.strictEqual(error, 'A valid corporate Entra email address is required')
  })

  it('rejects unsupported application role', () => {
    const error = validateEmployeeOnboardingPayload({
      employee_code: 'EMP-001',
      first_name: 'Amit',
      last_name: 'Sharma',
      email: 'amit.sharma@company.com',
      role_name: 'SuperUser',
    })
    assert.strictEqual(error, 'Invalid application role selected')
  })

  it('validates standard employee CSV headers including optional role and team', () => {
    const valid = parseEmployeeCsvHeaders('employee_code,first_name,last_name,email,designation,department,employment_type,role,team_name')
    assert.strictEqual(valid.valid, true)
    assert.strictEqual(valid.missing.length, 0)
  })

  it('detects missing required columns in employee CSV', () => {
    const result = parseEmployeeCsvHeaders('first_name,last_name,email,role')
    assert.strictEqual(result.valid, false)
    assert.ok(result.missing.includes('employee_code'))
    assert.ok(result.missing.includes('department'))
  })
})
