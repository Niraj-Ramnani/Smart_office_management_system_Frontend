import React, { useState } from 'react'
import { useProvisionUsersCsvMutation } from '../../store/api/userManagementApi'
import type { UserProvisionCSVResponse } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { Modal } from '../common'

interface UserCsvModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (count: number) => void
}

export const UserCsvModal: React.FC<UserCsvModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [provisionCsv, { isLoading }] = useProvisionUsersCsvMutation()
  const [file, setFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [summary, setSummary] = useState<UserProvisionCSVResponse | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setErrorMsg(null)
      setSummary(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg('Please select a CSV file to upload')
      return
    }

    try {
      const text = await file.text()
      const result = await provisionCsv(text).unwrap()
      setSummary(result)
      if (result.imported_count > 0 && result.failed_count === 0) {
        onSuccess(result.imported_count)
        onClose()
      }
    } catch (err) {
      setErrorMsg(extractErrorMessage(err, 'Failed to import user CSV file'))
    }
  }

  const downloadSampleCsv = () => {
    const csvContent =
      'employee_id,email,entra_oid,role\n' +
      '1,employee1@company.com,8c17f5d5-0001-4000-8000-000000000001,Employee\n' +
      '2,manager1@company.com,8c17f5d5-0002-4000-8000-000000000002,Manager\n'

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'user_provision_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk User CSV Provisioning"
      subtitle="Upload a CSV file to provision multiple employees for Microsoft Entra SSO."
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-800">
              CSV Format Requirements:
            </span>
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
            >
              Download Sample CSV Template
            </button>
          </div>
          <p>
            Required columns: <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">employee_id</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">email</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">entra_oid</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">role</code>.
          </p>
          <p className="text-slate-500">
            Valid roles are <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Employee</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Manager</code>, or <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Admin</code>.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-lg p-2"
          />
        </div>

        {summary && summary.failed_count > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-600">
                Provisioning Failed: {summary.errors.length} validation errors found
              </span>
              <span className="text-slate-500">
                0 of {summary.total_rows} users provisioned
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto border border-red-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-red-50 text-red-700 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Issue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {summary.errors.map((err, idx) => (
                    <tr key={idx} className="hover:bg-red-50/50">
                      <td className="px-3 py-2 font-mono font-semibold text-slate-700">
                        Row {err.row}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-900">
                        {err.field}
                      </td>
                      <td className="px-3 py-2 text-red-700">
                        {err.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500">
              Fix the reported errors in your CSV and re-upload. No user accounts were created.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!file || isLoading}
            onClick={handleUpload}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Validating & Provisioning...' : 'Upload & Provision'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
