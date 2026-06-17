import { useState } from 'react'
import type { Application, Stage } from '../types'
import { mockApplications } from '../data/mock'

export function useBoard() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)

  const moveApplication = (id: string, stage: Stage) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, stage } : app))
    )
  }

  const addApplication = (data: Omit<Application, 'id' | 'createdAt'>) => {
    const app: Application = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setApplications(prev => [app, ...prev])
  }

  const updateApplication = (
    id: string,
    patch: Partial<Omit<Application, 'id' | 'createdAt'>>
  ) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, ...patch } : app))
    )
  }

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id))
  }

  return { applications, moveApplication, addApplication, updateApplication, deleteApplication }
}
