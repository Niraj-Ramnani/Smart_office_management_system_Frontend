import React, { useRef, useState } from 'react'
import {
  useImportEmployeesCsvMutation,
  useValidateEmployeesCsvMutation,
} from '../../store/api/employeeApi'
import type { CSVImportSummary, CSVValidationResponse } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { Modal } from '../common'

interface EmployeeCsvModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (count: number) => void
}

const REQUIRED_FIELDS = [
  'employee_code',
  'first_name',
  'last_name',
  'email',
  'entra_oid',
  'designation',
  'department',
  'employment_type',
]

const OPTIONAL_FIELDS = [
  'role',
  'phone',
  'employee_status',
  'manager_employee_code',
  'team_name',
]

export const EmployeeCsvModal: React.FC<EmployeeCsvModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [validateCsv, { isLoading: isValidating }] =
    useValidateEmployeesCsvMutation()
  const [importCsv, { isLoading: isImporting }] = useImportEmployeesCsvMutation()

  const [file, setFile] = useState<File | null>(null)
  const [csvContent, setCsvContent] = useState<string>('')
  const [rowCount, setRowCount] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [validation, setValidation] = useState<CSVValidationResponse | null>(null)
  const [importResult, setImportResult] = useState<CSVImportSummary | null>(null)
  const [showFailedRows, setShowFailedRows] = useState<boolean>(false)

  const resetState = () => {
    setFile(null)
    setCsvContent('')
    setRowCount(0)
    setIsDragging(false)
    setErrorMsg(null)
    setValidation(null)
    setImportResult(null)
    setShowFailedRows(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setErrorMsg('Please select a valid .csv file.')
      return
    }

    try {
      setErrorMsg(null)
      setImportResult(null)
      setFile(selectedFile)

      const text = await selectedFile.text()
      setCsvContent(text)

      const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
      const rows = Math.max(0, lines.length - 1)
      setRowCount(rows)

      const result = await validateCsv(text).unwrap()
      setValidation(result)
    } catch (err) {
      setErrorMsg(extractErrorMessage(err, 'Failed to parse and validate CSV file.'))
      setValidation(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleImport = async () => {
    if (!file || !csvContent) {
      setErrorMsg('Please select a CSV file to import.')
      return
    }

    try {
      setErrorMsg(null)
      const result = await importCsv(csvContent).unwrap()
      setImportResult(result)
      if (result.failed_count === 0 && (result.imported_count > 0 || (result.updated_count ?? 0) > 0)) {
        onSuccess(result.imported_count + (result.updated_count ?? 0))
      }
    } catch (err) {
      setErrorMsg(extractErrorMessage(err, 'Failed to import CSV file.'))
    }
  }

  const downloadSampleCsv = () => {
    const header = [
      'employee_code',
      'first_name',
      'last_name',
      'email',
      'entra_oid',
      'designation',
      'department',
      'employment_type',
      'role',
      'phone',
      'employee_status',
      'manager_employee_code',
      'team_name',
    ].join(',')

    const sampleRow1 = [
      'EMP-101',
      'John',
      'Doe',
      'john.doe@company.com',
      '8c17f5d5-0001-4000-8000-000000000001',
      'Engineering Lead',
      'Engineering',
      'Full-Time',
      'Manager',
      '+123456789',
      'ACTIVE',
      '',
      'Engineering',
    ].join(',')

    const sampleRow2 = [
      'EMP-102',
      'Jane',
      'Smith',
      'jane.smith@company.com',
      '8c17f5d5-0002-4000-8000-000000000002',
      'Senior Software Engineer',
      'Engineering',
      'Full-Time',
      'Employee',
      '+198765432',
      'ACTIVE',
      'EMP-101',
      'Engineering',
    ].join(',')

    const sampleRow3 = [
      'EMP-103',
      'Alex',
      'Jones',
      'alex.jones@company.com',
      '8c17f5d5-0003-4000-8000-000000000003',
      'Product Designer',
      'Product',
      'Full-Time',
      'Employee',
      '+112233445',
      'ACTIVE',
      '',
      '',
    ].join(',')

    const csvData = `${header}\n${sampleRow1}\n${sampleRow2}\n${sampleRow3}\n`

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'bulk_employee_onboarding_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Employee Onboarding"
      subtitle="Import employees, application access, roles, teams and Microsoft Entra identities in bulk."
      maxWidth="2xl"
    >
      <div className="space-y-4">

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <svg
              className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {importResult ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Import Complete</h4>
                  <p className="text-xs text-slate-500">
                    {importResult.total_rows} {importResult.total_rows === 1 ? 'employee' : 'employees'} processed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="text-[11px] font-medium text-slate-500">Successfully Onboarded</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">
                    ✓ {importResult.imported_count}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="text-[11px] font-medium text-slate-500">Updated</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    ↻ {importResult.updated_count ?? 0}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="text-[11px] font-medium text-slate-500">Failed</div>
                  <div className={`text-base font-bold mt-0.5 ${importResult.failed_count > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                    ✕ {importResult.failed_count}
                  </div>
                </div>
              </div>

              {importResult.failed_count > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFailedRows(!showFailedRows)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                  >
                    {showFailedRows ? 'Hide Failed Rows' : 'View Failed Rows'}
                  </button>

                  {showFailedRows && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-red-200 rounded-lg">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-red-50 text-red-700 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Row</th>
                            <th className="px-3 py-2 font-semibold">Employee</th>
                            <th className="px-3 py-2 font-semibold">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-100 bg-white">
                          {importResult.errors.map((err, idx) => (
                            <tr key={idx} className="hover:bg-red-50/40">
                              <td className="px-3 py-2 font-mono font-semibold text-slate-700">
                                Row {err.row}
                              </td>
                              <td className="px-3 py-2 text-slate-900 font-medium">
                                {err.employee || `Row ${err.row}`}
                              </td>
                              <td className="px-3 py-2 text-red-700">
                                {err.message}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (

          <>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  CSV Template
                </span>
                <button
                  type="button"
                  onClick={downloadSampleCsv}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download CSV Template
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Required fields</span>
                <div className="flex flex-wrap gap-1.5">
                  {REQUIRED_FIELDS.map((col) => (
                    <span
                      key={col}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-white text-slate-800 border border-slate-200 shadow-2xs"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Optional fields</span>
                <div className="flex flex-wrap gap-1.5">
                  {OPTIONAL_FIELDS.map((col) => (
                    <span
                      key={col}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                <svg
                  className="w-3.5 h-3.5 text-orange-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Microsoft Entra OID</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                The Entra Object ID uniquely identifies the Microsoft Entra user and is used to connect the employee record with SSO. Each employee must have a valid Microsoft Entra Object ID (OID).
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-800">Upload CSV</span>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onClick={(e) => {
                  e.currentTarget.value = ''
                }}
                onChange={handleFileChange}
                className="hidden"
              />

              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-xl p-5 text-center transition-colors ${
                    isDragging
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                    >
                      Choose CSV File
                    </button>
                    <p className="text-[11px] text-slate-500">
                      or drag and drop your CSV file here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{file.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {rowCount} {rowCount === 1 ? 'employee' : 'employees'} detected
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    Replace
                  </button>
                </div>
              )}
            </div>

            {isValidating && (
              <div className="flex items-center justify-center gap-2 p-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl animate-pulse">
                <svg
                  className="w-4 h-4 animate-spin text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Validating CSV structure and directory records...</span>
              </div>
            )}

            {validation && !isValidating && (
              <div className="rounded-xl border border-slate-200 p-3.5 space-y-2.5 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">CSV Validation</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-600">
                      ✓ {validation.valid_count} valid {validation.valid_count === 1 ? 'row' : 'rows'}
                    </span>
                    {validation.failed_count > 0 && (
                      <span className="font-semibold text-amber-600">
                        ⚠ {validation.failed_count} {validation.failed_count === 1 ? 'row needs' : 'rows need'} attention
                      </span>
                    )}
                  </div>
                </div>

                {validation.failed_count > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="max-h-40 overflow-y-auto border border-amber-200 rounded-lg">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-amber-50 text-amber-800 sticky top-0">
                          <tr>
                            <th className="px-3 py-1.5 font-semibold">Row</th>
                            <th className="px-3 py-1.5 font-semibold">Employee</th>
                            <th className="px-3 py-1.5 font-semibold">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100 bg-white">
                          {validation.errors.map((err, idx) => (
                            <tr key={idx} className="hover:bg-amber-50/30">
                              <td className="px-3 py-1.5 font-mono font-semibold text-slate-700">
                                Row {err.row}
                              </td>
                              <td className="px-3 py-1.5 text-slate-900 font-medium">
                                {err.employee || `Row ${err.row}`}
                              </td>
                              <td className="px-3 py-1.5 text-red-600">
                                {err.message}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Please fix the issues above in your CSV file and re-upload before importing.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  !file ||
                  isValidating ||
                  isImporting ||
                  !validation ||
                  validation.failed_count > 0
                }
                onClick={handleImport}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isImporting ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Importing...</span>
                  </>
                ) : (
                  'Validate & Import'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
