import React, { useState, useCallback } from 'react';
import { generateTopicSuggestions } from './services/avalaiService';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(e.target.value);
    // Clear error when user starts typing again
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keywords.trim()) {
      setError("لطفاً کلمات کلیدی را وارد کنید.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await generateTopicSuggestions(keywords);
      setSuggestions(result);
    } catch (err: any) {
      console.error("Failed to generate suggestions:", err);
      setError(err.message || "خطایی رخ داد. لطفاً دوباره امتحان کنید.");
    } finally {
      setLoading(false);
    }
  }, [keywords, error]); // Include error in dependency array to clear it if it's currently set.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-10 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-6">
          پیشنهاد دهنده موضوع <span className="text-indigo-600">AvalAI</span>
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
          کلمات کلیدی خود را وارد کنید تا ۵ موضوع جذاب و کاربردی برای شما تولید شود.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
              کلمات کلیدی شما:
            </label>
            <textarea
              id="keywords"
              rows={4}
              value={keywords}
              onChange={handleKeywordsChange}
              placeholder="مثال: هوش مصنوعی، یادگیری ماشین، آینده تکنولوژی"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 resize-y"
              aria-describedby="keywords-help"
            ></textarea>
            <p id="keywords-help" className="mt-2 text-sm text-gray-500">
              چند کلمه یا عبارت مرتبط با موضوع مورد نظر خود وارد کنید.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال تولید...
                </>
              ) : (
                'تولید موضوعات'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md" role="alert">
            <p className="font-bold">خطا:</p>
            <p>{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">موضوعات پیشنهادی:</h2>
            <ul className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                  <span className="flex-shrink-0 text-indigo-600 font-bold text-lg mr-3">{index + 1}.</span>
                  <p className="text-gray-800 text-lg flex-grow">{suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;