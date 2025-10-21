import type { ReactNode } from 'react'
import {
    Dashboard,
    Exercises,
    ExerciseDetail,
    Log,
    Progress,
    CreateRoutine,
} from './'

export type AppRoute = {
    index?: boolean
    path?: string
    element: ReactNode
    label?: string
    inNav?: boolean
}

export const routeTable: AppRoute[] = [
    { index: true, element: <Dashboard />, label: 'Dashboard', inNav: true },
    { path: 'exercises', element: <Exercises />, label: 'Exercises', inNav: true },
    { path: 'exercises/:id', element: <ExerciseDetail /> },
    { path: 'log', element: <Log />, label: 'Log', inNav: true },
    { path: 'progress', element: <Progress />, label: 'Progress', inNav: true },
    { path: 'routines/create', element: <CreateRoutine />, label: 'Routines', inNav: true },
]

export const notFoundRoute: AppRoute = {
    path: '*',
    element: <div className="p-6">Page not found.</div>,
}
