"use client"

import { useState } from "react"
import CategorySelector from "./components/category-selector"
import { gameCategories } from "./lib/game-categories"
import DynamicForm from "./components/dynamic-form"
import JsonPreview from "./components/json-preview"


export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({})
  const [generatedJson, setGeneratedJson] = useState("")

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setFormData({})
    setGeneratedJson("")
  }

  const handleFormChange = (data) => {
    // Assicuriamoci che la chiave "category" sia sempre presente
    const updatedData = {
      ...data,
      category: selectedCategory,
    }

    // Verifica se i dati sono effettivamente cambiati prima di aggiornare lo stato
    if (JSON.stringify(updatedData) !== JSON.stringify(formData)) {
      setFormData(updatedData)
    }
  }

  const generateJson = () => {
    const formattedJson = JSON.stringify(formData, null, 2)
    setGeneratedJson(formattedJson)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Generatore JSON per Giochi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Categorie di Gioco</h2>
          <CategorySelector
            categories={Object.keys(gameCategories)}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        <div className="md:col-span-2">
          {selectedCategory ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Form per {gameCategories[selectedCategory]?.label || selectedCategory}
              </h2>
              <DynamicForm
                category={selectedCategory}
                schema={gameCategories[selectedCategory]?.schema}
                onChange={handleFormChange}
                formData={formData}
              />
              <div className="mt-6">
                <button
                  onClick={generateJson}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Genera JSON
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">Seleziona una categoria per iniziare a creare il tuo JSON</p>
            </div>
          )}

          {generatedJson && (
            <div className="mt-8">
              <JsonPreview json={generatedJson} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}