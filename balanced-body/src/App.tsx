import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { Dashboard, Exercises, ExerciseDetail, Log, Progress, CreateRoutine } from './routes'

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="exercises" element={<Exercises />} />
                <Route path="exercises/:id" element={<ExerciseDetail />} />
                <Route path="log" element={<Log />} />
                <Route path="progress" element={<Progress />} />
                <Route path="routines/create" element={<CreateRoutine />} />
            </Route>
        </Routes>
    )
}
