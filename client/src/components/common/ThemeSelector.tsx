import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const ThemeSelector = () => {
  const { themeMode, setThemeMode } = useTheme();
  const { updateUser } = useAuth();

  const handleModeChange = async (mode: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    setThemeMode(mode);
    try {
      await updateUser({
        themeMode: mode,
      });
    } catch {
      // 静默失败
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-6 min-w-[320px]">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">主题设置</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          主题模式
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => handleModeChange('light')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              themeMode === 'light'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            浅色
          </button>
          <button
            onClick={() => handleModeChange('dark')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              themeMode === 'dark'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            深色
          </button>
        </div>
      </div>
    </div>
  );
};
