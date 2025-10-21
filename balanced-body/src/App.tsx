import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { routeTable, notFoundRoute } from './routes/routeTable'

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                {routeTable.map((r) =>
                    r.index ? (
                        <Route index element={r.element} key="__index" />
                    ) : (
                        <Route path={r.path!} element={r.element} key={r.path} />
                    )
                )}
                <Route path={notFoundRoute.path!} element={notFoundRoute.element} />
            </Route>
        </Routes>
    )
}
