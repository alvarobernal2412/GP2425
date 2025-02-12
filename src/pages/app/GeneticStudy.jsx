import { useState, useMemo, useRef, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bell, FileDown } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const diseases = [
  // Monogenic diseases
  { id: 1, name: 'Cystic Fibrosis', category: 'Monogenic' },
  { id: 2, name: 'Sickle Cell Anemia', category: 'Monogenic' },
  { id: 3, name: 'Tay-Sachs Disease', category: 'Monogenic' },
  { id: 4, name: "Huntington's Disease", category: 'Monogenic' },
  { id: 5, name: 'Duchenne Muscular Dystrophy', category: 'Monogenic' },
  { id: 6, name: 'Becker Muscular Dystrophy', category: 'Monogenic' },
  { id: 7, name: 'Hemophilia A', category: 'Monogenic' },
  { id: 8, name: 'Hemophilia B', category: 'Monogenic' },
  { id: 9, name: 'Marfan Syndrome', category: 'Monogenic' },
  { id: 10, name: 'Neurofibromatosis Type 1', category: 'Monogenic' },
  { id: 11, name: 'Neurofibromatosis Type 2', category: 'Monogenic' },
  { id: 12, name: 'Ehlers-Danlos Syndrome', category: 'Monogenic' },
  { id: 13, name: 'Fragile X Syndrome', category: 'Monogenic' },
  { id: 14, name: 'Familial Hypercholesterolemia', category: 'Monogenic' },
  { id: 15, name: 'Phenylketonuria (PKU)', category: 'Monogenic' },
  { id: 16, name: 'Galactosemia', category: 'Monogenic' },
  { id: 17, name: 'Albinism', category: 'Monogenic' },
  { id: 18, name: "Wilson's Disease", category: 'Monogenic' },
  { id: 19, name: 'Tuberous Sclerosis', category: 'Monogenic' },
  { id: 20, name: 'Autosomal Dominant Polycystic Kidney Disease', category: 'Monogenic' },
  { id: 21, name: 'Autosomal Recessive Polycystic Kidney Disease', category: 'Monogenic' },
  { id: 22, name: 'Prader-Willi Syndrome', category: 'Monogenic' },
  { id: 23, name: 'Angelman Syndrome', category: 'Monogenic' },
  { id: 24, name: 'Noonan Syndrome', category: 'Monogenic' },
  { id: 25, name: 'Alport Syndrome', category: 'Monogenic' },

  // Chromosomal diseases
  { id: 26, name: 'Down Syndrome (Trisomy 21)', category: 'Chromosomal' },
  { id: 27, name: 'Edwards Syndrome (Trisomy 18)', category: 'Chromosomal' },
  { id: 28, name: 'Patau Syndrome (Trisomy 13)', category: 'Chromosomal' },
  { id: 29, name: 'Turner Syndrome (45,X0)', category: 'Chromosomal' },
  { id: 30, name: 'Klinefelter Syndrome (XXY)', category: 'Chromosomal' },
  { id: 31, name: 'Cri-du-chat Syndrome', category: 'Chromosomal' },
  { id: 32, name: 'Williams Syndrome', category: 'Chromosomal' },
  { id: 33, name: 'Wolf-Hirschhorn Syndrome', category: 'Chromosomal' },
  { id: 34, name: 'DiGeorge Syndrome (22q11.2 deletion)', category: 'Chromosomal' },
  { id: 35, name: 'Smith-Magenis Syndrome', category: 'Chromosomal' },

  // Mitochondrial diseases
  { id: 36, name: 'Leber Hereditary Optic Neuropathy (LHON)', category: 'Mitochondrial' },
  { id: 37, name: 'MELAS Syndrome', category: 'Mitochondrial' },
  { id: 38, name: 'MERRF Syndrome', category: 'Mitochondrial' },
  { id: 39, name: 'Leigh Syndrome', category: 'Mitochondrial' },
  { id: 40, name: 'Kearns-Sayre Syndrome', category: 'Mitochondrial' },

  // Multifactorial diseases
  { id: 41, name: 'Type 1 Diabetes', category: 'Multifactorial' },
  { id: 42, name: 'Type 2 Diabetes', category: 'Multifactorial' },
  { id: 43, name: "Alzheimer's Disease", category: 'Multifactorial' },
  { id: 44, name: "Parkinson's Disease", category: 'Multifactorial' },
  { id: 45, name: 'Schizophrenia', category: 'Multifactorial' },
  { id: 46, name: 'Bipolar Disorder', category: 'Multifactorial' },
  { id: 47, name: 'Hereditary Breast Cancer (BRCA1/BRCA2)', category: 'Multifactorial' },
  { id: 48, name: 'Hereditary Colon Cancer (Lynch Syndrome)', category: 'Multifactorial' },
  { id: 49, name: 'Essential Hypertension', category: 'Multifactorial' },
  { id: 50, name: 'Asthma', category: 'Multifactorial' },
];

const diseaseCategories = ['All', 'Monogenic', 'Chromosomal', 'Mitochondrial', 'Multifactorial'];

export function GeneticStudy() {
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const resultsRef = useRef(null);
  const { toast } = useToast();

  const handleNotifyClick = () => {
    toast({
      title: 'Notification Sent',
      description: 'Notification email sent to the patient.',
      className: 'toast-left-align',
    });
  };

  const handleDownloadClick = () => {
    toast({
      title: 'Downloading...',
      description: 'Generating and downloading the detailed report.',
      className: 'toast-left-align',
    });
  };

  const filteredDiseases = useMemo(() => {
    return diseases.filter(
      (disease) =>
        (selectedCategory === 'All' || disease.category === selectedCategory) &&
        (disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          disease.category.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [searchTerm, selectedCategory]);

  const handleDiseaseSelection = (diseaseId) => {
    setSelectedDiseases((prev) =>
      prev.includes(diseaseId) ? prev.filter((id) => id !== diseaseId) : [...prev, diseaseId],
    );
  };

  const selectAllFilteredDiseases = () => {
    setSelectedDiseases(filteredDiseases.map((disease) => disease.id));
  };

  const startAnalysis = () => {
    if (selectedDiseases.length === 0) {
      alert('Please select at least one disease to analyze.');
      return;
    }
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      const analysisResults = selectedDiseases.map((id) => {
        const disease = diseases.find((d) => d.id === id);
        return {
          id: disease.id,
          name: disease.name,
          detected: Math.random() > 0.7,
          confidence: Math.floor(Math.random() * 100),
          variants: Math.random() > 0.5 ? ['VAR1', 'VAR2'] : [],
        };
      });
      setResults(analysisResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  const chartData = useMemo(() => {
    if (!results) return null;

    const sortedResults = [...results].sort((a, b) => b.confidence - a.confidence);
    const topResults = sortedResults.slice(0, 5);

    return {
      labels: topResults.map((result) => result.name),
      datasets: [
        {
          label: 'Confidence (%)',
          data: topResults.map((result) => result.confidence),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [results]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 5 Diseases by Confidence',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Select diseases for analysis</h3>
          <div className="mt-4 flex space-x-4">
            <div className="flex-grow relative">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search diseases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative inline-block text-left z-10">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                  onClick={() => document.getElementById('dropdown-menu').classList.toggle('hidden')}
                >
                  {selectedCategory}
                  <Filter className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden z-20"
                id="dropdown-menu"
              >
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {diseaseCategories.map((category) => (
                    <a
                      key={category}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(category);
                        document.getElementById('dropdown-menu').classList.add('hidden');
                      }}
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 max-h-96 overflow-y-auto relative z-0">
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:gap-x-8">
              {filteredDiseases.map((disease) => (
                <div
                  key={disease.id}
                  className={`relative flex items-center space-x-3 rounded-lg border ${
                    selectedDiseases.includes(disease.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-white'
                  } px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 cursor-pointer`}
                  onClick={() => handleDiseaseSelection(disease.id)}
                >
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedDiseases.includes(disease.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{disease.name}</p>
                    <p className="text-sm text-gray-500 truncate">{disease.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-between">
            <button
              type="button"
              onClick={selectAllFilteredDiseases}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Select All Filtered
            </button>
            <button
              type="button"
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
            </button>
          </div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="text-center py-4">
          <div className="spinner"></div>
          <p className="mt-2 text-sm text-gray-500">Analyzing genetic data...</p>
        </div>
      )}

      {results && (
        <div ref={resultsRef} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Analysis Results</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                >
                  <dt className="text-sm font-medium text-gray-500">{result.name}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {result.detected ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="mr-1 h-4 w-4" />
                        Possible variants detected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        No risk variants detected
                      </span>
                    )}
                    <p className="mt-2">Confidence: {result.confidence}%</p>
                    {result.variants.length > 0 && (
                      <p className="mt-2">Detected variants: {result.variants.join(', ')}</p>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top 5 Diseases by Confidence</h4>
            {chartData && <Bar options={chartOptions} data={chartData} />}
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
            <button
              type="button"
              className="inline-flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleNotifyClick}
            >
              <Bell className="w-5 h-5 mr-2" />
              Notify Patient
            </button>
            <button
              type="button"
              className="inline-flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleDownloadClick}
            >
              <FileDown className="w-5 h-5 mr-2" />
              Generate Detailed Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

