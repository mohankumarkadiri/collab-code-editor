import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { SnackbarProvider } from './hooks/SnackBarProvider';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/Login';
import LayoutProtectedRoute from './components/LayoutProtectedRoute';
import Layout from './components/Layout';
import store from './store';

export default function App() {
	return (
		<Provider store={store}>
			<SnackbarProvider>
						<Routes>
							<Route path='/' element={<Layout />}>
								<Route path='/' element={<LayoutProtectedRoute />}>
									<Route index element={<HomePage />} />
									<Route path="room/:roomId" element={<EditorPage />} />
								</Route>
								<Route path='login' element={<LoginPage />} />
								<Route path='*' element={<NotFoundPage />}></Route>
							</Route>
						</Routes>
			</SnackbarProvider>
		</Provider>
	);
}
