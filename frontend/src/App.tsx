import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BudgetProvider } from './contexts/BudgetContext';
import { ComponentProvider } from './contexts/ComponentContext';
import { router } from './routes';

function App() {
  return (
    <ThemeProvider>
      <BudgetProvider>
        <ComponentProvider>
          <RouterProvider router={router} />
        </ComponentProvider>
      </BudgetProvider>
    </ThemeProvider>
  );
}

export default App;