"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import Compressor from "compressorjs"

export default function DynamicForm({ category, schema, onChange, formData }) {
  const [activeTab, setActiveTab] = useState("0")
  const [initialized, setInitialized] = useState(false)

  // Funzione per creare uno step vuoto
  const createEmptyStep = useCallback((stepSchema) => {
    const step = {}
    Object.keys(stepSchema).forEach((field) => {
      if (stepSchema[field].isArray) {
        step[field] = []
      } else {
        step[field] = stepSchema[field].defaultValue || ""
      }
    })
    return step
  }, [])

  // Inizializza i dati del form se vuoti
  useEffect(() => {
    if (!initialized && schema) {
      const initialData = {
        category: category,
      }

      if (schema.hasSteps) {
        initialData.steps = [createEmptyStep(schema.stepSchema)]
      } else {
        Object.keys(schema.fields).forEach((field) => {
          initialData[field] = schema.fields[field].defaultValue || ""
        })
      }

      onChange(initialData)
      setInitialized(true)
    }
  }, [schema, initialized, onChange, createEmptyStep, category])

  // Reset initialized state when category changes
  useEffect(() => {
    setInitialized(false)
  }, [category])

  if (!schema) return <p>Schema non disponibile per questa categoria</p>

  const handleFieldChange = (field, value) => {
    const newData = { ...formData }
    newData[field] = value
    onChange(newData)
  }

  const handleStepFieldChange = (stepIndex, field, value) => {
    const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
    newData.steps[stepIndex][field] = value
    onChange(newData)
  }

  const handleArrayItemChange = (stepIndex, field, itemIndex, value) => {
    const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
    if (!newData.steps[stepIndex][field]) {
      newData.steps[stepIndex][field] = []
    }
    newData.steps[stepIndex][field][itemIndex] = value
    onChange(newData)
  }

  const handleComplexArrayItemChange = (stepIndex, field, itemIndex, subField, value) => {
    const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
    if (!newData.steps[stepIndex][field]) {
      newData.steps[stepIndex][field] = []
    }
    if (!newData.steps[stepIndex][field][itemIndex]) {
      newData.steps[stepIndex][field][itemIndex] = {}
    }
    newData.steps[stepIndex][field][itemIndex][subField] = value
    onChange(newData)
  }

  // Funzione per trovare il prossimo ID disponibile
  const getNextId = (items, idField) => {
    if (!Array.isArray(items) || items.length === 0) return 1

    // Trova il valore massimo dell'ID corrente
    const maxId = items.reduce((max, item) => {
      const itemId = item[idField]
      return itemId && !isNaN(Number(itemId)) ? Math.max(max, Number(itemId)) : max
    }, 0)

    return maxId + 1
  }

  const addArrayItem = (stepIndex, field, isComplex = false, fieldSchema = null) => {
    const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
    if (!newData.steps[stepIndex][field]) {
      newData.steps[stepIndex][field] = []
    }

    if (isComplex && fieldSchema) {
      const newItem = {}

      // Verifica se ci sono campi ID da auto-incrementare
      const hasIdFields = Object.keys(fieldSchema.fields).some(
        (subField) => subField.toLowerCase().includes("id") && fieldSchema.fields[subField].type === "number",
      )

      Object.keys(fieldSchema.fields).forEach((subField) => {
        const subFieldSchema = fieldSchema.fields[subField]

        if (subFieldSchema.type === "checkbox") {
          // Inizializza esplicitamente i checkbox come false
          newItem[subField] = false
        } else if (subFieldSchema.type === "number" && subField.toLowerCase().includes("id")) {
          // Auto-incrementa i campi ID
          newItem[subField] = getNextId(newData.steps[stepIndex][field], subField)
        } else {
          newItem[subField] = subFieldSchema.defaultValue || (subFieldSchema.type === "number" ? 0 : "")
        }
      })

      newData.steps[stepIndex][field].push(newItem)
    } else {
      newData.steps[stepIndex][field].push("")
    }

    onChange(newData)
  }

  const removeArrayItem = (stepIndex, field, itemIndex) => {
    const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
    newData.steps[stepIndex][field].splice(itemIndex, 1)
    onChange(newData)
  }

  const addStep = () => {
    const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
    if (!newData.steps) {
      newData.steps = []
    }
    newData.steps.push(createEmptyStep(schema.stepSchema))
    onChange(newData)
    setActiveTab((newData.steps.length - 1).toString())
  }

  const removeStep = (index) => {
    const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
    newData.steps.splice(index, 1)
    onChange(newData)
    if (Number.parseInt(activeTab) >= newData.steps.length) {
      setActiveTab((newData.steps.length - 1).toString())
    }
  }

  // Funzione per comprimere e convertire un file in base64
  const compressAndConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.7, // Qualità dell'immagine compressa (0-1)
        maxWidth: 1200, // Larghezza massima
        maxHeight: 1200, // Altezza massima
        success: (compressedFile) => {
          const reader = new FileReader()
          reader.readAsDataURL(compressedFile)
          reader.onload = () => resolve(reader.result)
          reader.onerror = (error) => reject(error)
        },
        error: (err) => {
          console.error("Errore durante la compressione:", err)
          // Fallback alla conversione senza compressione
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = (error) => reject(error)
        },
      })
    })
  }

  // Funzione per gestire il caricamento di un'immagine
  const handleImageUpload = async (stepIndex, field, file) => {
    if (file) {
      try {
        const base64String = await compressAndConvertToBase64(file)
        const newData = JSON.parse(JSON.stringify(formData)) // Deep clone
        newData.steps[stepIndex][field] = base64String
        onChange(newData)
      } catch (error) {
        console.error("Errore nella conversione dell'immagine:", error)
      }
    }
  }

  // Funzione per gestire il caricamento di un'immagine in un campo complesso
  const handleComplexImageUpload = async (stepIndex, field, itemIndex, subField, file) => {
    if (file) {
      try {
        const base64String = await compressAndConvertToBase64(file)
        handleComplexArrayItemChange(stepIndex, field, itemIndex, subField, base64String)
      } catch (error) {
        console.error("Errore nella conversione dell'immagine:", error)
      }
    }
  }

  // Aggiungiamo una nuova funzione per gestire il caricamento di immagini per gli array semplici
  // Aggiungi questa funzione dopo handleComplexImageUpload

  // Funzione per gestire il caricamento di un'immagine per un elemento di array semplice
  const handleArrayImageUpload = async (stepIndex, field, itemIndex, file) => {
    if (file) {
      try {
        const base64String = await compressAndConvertToBase64(file)
        handleArrayItemChange(stepIndex, field, itemIndex, base64String)
      } catch (error) {
        console.error("Errore nella conversione dell'immagine:", error)
      }
    }
  }

  // Render basic fields (non-step based)
  if (!schema.hasSteps) {
    return (
      <div className="space-y-4">
        {Object.keys(schema.fields).map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{schema.fields[field].label}</Label>
            {schema.fields[field].type === "text" ? (
              <Input
                id={field}
                value={formData[field] || ""}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                placeholder={schema.fields[field].placeholder || ""}
              />
            ) : schema.fields[field].type === "textarea" ? (
              <Textarea
                id={field}
                value={formData[field] || ""}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                placeholder={schema.fields[field].placeholder || ""}
                rows={4}
              />
            ) : null}
          </div>
        ))}
      </div>
    )
  }

  // Render step-based form
  return (
    <div className="space-y-6">
      {formData.steps && formData.steps.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              {formData.steps.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  Step {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-1" /> Aggiungi Step
              </Button>
              {formData.steps.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => removeStep(Number.parseInt(activeTab))}>
                  <Trash2 className="h-4 w-4 mr-1" /> Rimuovi Step
                </Button>
              )}
            </div>
          </div>

          {formData.steps.map((step, stepIndex) => (
            <TabsContent key={stepIndex} value={stepIndex.toString()}>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {Object.keys(schema.stepSchema).map((field) => {
                      const fieldSchema = schema.stepSchema[field]

                      // Gestione campi array complessi (oggetti con sottocampi)
                      if (fieldSchema.type === "complex" && fieldSchema.isArray) {
                        return (
                          <div key={field} className="space-y-4">
                            <Label>{fieldSchema.label}</Label>
                            {Array.isArray(step[field]) &&
                              step[field].map((item, itemIndex) => (
                                <div key={itemIndex} className="p-4 border rounded-md space-y-3">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium">
                                      {fieldSchema.itemLabel} {itemIndex + 1}
                                    </h4>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeArrayItem(stepIndex, field, itemIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.keys(fieldSchema.fields).map((subField) => {
                                      const subFieldSchema = fieldSchema.fields[subField]

                                      // Disabilita l'input per i campi ID auto-incrementati
                                      const isAutoIncrementId =
                                        subFieldSchema.type === "number" && subField.toLowerCase().includes("id")

                                      return (
                                        <div key={subField} className="space-y-2">
                                          <Label htmlFor={`${stepIndex}-${field}-${itemIndex}-${subField}`}>
                                            {subFieldSchema.label}
                                            {isAutoIncrementId && " (auto)"}
                                          </Label>

                                          {subFieldSchema.type === "text" ? (
                                            subFieldSchema.label.toLowerCase().includes("immagine") ? (
                                              <div className="space-y-2">
                                                <Input
                                                  id={`${stepIndex}-${field}-${itemIndex}-${subField}-file`}
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                      handleComplexImageUpload(
                                                        stepIndex,
                                                        field,
                                                        itemIndex,
                                                        subField,
                                                        e.target.files[0],
                                                      )
                                                    }
                                                  }}
                                                  className="mb-2"
                                                />
                                                {item[subField] && item[subField].startsWith("data:image") && (
                                                  <div className="mt-2 border rounded-md p-2">
                                                    <p className="text-sm text-gray-500 mb-2">Anteprima:</p>
                                                    <img
                                                      src={item[subField] || "/placeholder.svg"}
                                                      alt="Anteprima"
                                                      className="max-h-40 max-w-full object-contain"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <Input
                                                id={`${stepIndex}-${field}-${itemIndex}-${subField}`}
                                                value={item[subField] || ""}
                                                onChange={(e) =>
                                                  handleComplexArrayItemChange(
                                                    stepIndex,
                                                    field,
                                                    itemIndex,
                                                    subField,
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder={subFieldSchema.placeholder || ""}
                                              />
                                            )
                                          ) : subFieldSchema.type === "number" ? (
                                            <Input
                                              id={`${stepIndex}-${field}-${itemIndex}-${subField}`}
                                              type="number"
                                              value={item[subField] || 0}
                                              onChange={(e) =>
                                                handleComplexArrayItemChange(
                                                  stepIndex,
                                                  field,
                                                  itemIndex,
                                                  subField,
                                                  Number.parseInt(e.target.value),
                                                )
                                              }
                                              placeholder={subFieldSchema.placeholder || ""}
                                              readOnly={isAutoIncrementId}
                                              className={isAutoIncrementId ? "bg-gray-100" : ""}
                                            />
                                          ) : subFieldSchema.type === "checkbox" ? (
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                id={`${stepIndex}-${field}-${itemIndex}-${subField}`}
                                                checked={item[subField] === true}
                                                onCheckedChange={(checked) =>
                                                  handleComplexArrayItemChange(
                                                    stepIndex,
                                                    field,
                                                    itemIndex,
                                                    subField,
                                                    checked === true,
                                                  )
                                                }
                                              />
                                              <label
                                                htmlFor={`${stepIndex}-${field}-${itemIndex}-${subField}`}
                                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                {subFieldSchema.label}
                                              </label>
                                            </div>
                                          ) : null}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(stepIndex, field, true, fieldSchema)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Aggiungi {fieldSchema.itemLabel || "elemento"}
                            </Button>
                          </div>
                        )
                      }

                      // Modifica la sezione di gestione campi array semplici nel render per supportare il caricamento di immagini
                      // Sostituisci la sezione "Gestione campi array semplici" con questo codice:

                      // Gestione campi array semplici
                      if (fieldSchema.isArray && fieldSchema.type !== "complex") {
                        const isPuzzleImageArray = category === "puzzle-game" && field === "correctArray"

                        return (
                          <div key={field} className="space-y-2">
                            <Label>{fieldSchema.label}</Label>
                            {Array.isArray(step[field]) &&
                              step[field].map((item, itemIndex) => (
                                <div key={itemIndex} className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-2">
                                    {isPuzzleImageArray ? (
                                      <div className="flex-1 space-y-2">
                                        <Input
                                          id={`${stepIndex}-${field}-${itemIndex}-file`}
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              handleArrayImageUpload(stepIndex, field, itemIndex, e.target.files[0])
                                            }
                                          }}
                                        />
                                        {item && item.startsWith("data:image") && (
                                          <div className="mt-2 border rounded-md p-2">
                                            <p className="text-sm text-gray-500 mb-2">Anteprima:</p>
                                            <img
                                              src={item || "/placeholder.svg"}
                                              alt={`Pezzo puzzle ${itemIndex + 1}`}
                                              className="max-h-40 max-w-full object-contain"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <Input
                                        value={item || ""}
                                        onChange={(e) =>
                                          handleArrayItemChange(stepIndex, field, itemIndex, e.target.value)
                                        }
                                        placeholder={fieldSchema.placeholder || ""}
                                      />
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removeArrayItem(stepIndex, field, itemIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            <Button variant="outline" size="sm" onClick={() => addArrayItem(stepIndex, field)}>
                              <Plus className="h-4 w-4 mr-1" /> Aggiungi {fieldSchema.itemLabel || "elemento"}
                            </Button>
                          </div>
                        )
                      }

                      // Gestione campi semplici
                      return (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={`${stepIndex}-${field}`}>{fieldSchema.label}</Label>
                          {fieldSchema.type === "text" ? (
                            fieldSchema.label.toLowerCase().includes("immagine") ? (
                              <div className="space-y-2">
                                <Input
                                  id={`${stepIndex}-${field}-file`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleImageUpload(stepIndex, field, e.target.files[0])
                                    }
                                  }}
                                  className="mb-2"
                                />
                                {step[field] && step[field].startsWith("data:image") && (
                                  <div className="mt-2 border rounded-md p-2">
                                    <p className="text-sm text-gray-500 mb-2">Anteprima:</p>
                                    <img
                                      src={step[field] || "/placeholder.svg"}
                                      alt="Anteprima"
                                      className="max-h-40 max-w-full object-contain"
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Input
                                id={`${stepIndex}-${field}`}
                                value={step[field] || ""}
                                onChange={(e) => handleStepFieldChange(stepIndex, field, e.target.value)}
                                placeholder={fieldSchema.placeholder || ""}
                              />
                            )
                          ) : fieldSchema.type === "textarea" ? (
                            <Textarea
                              id={`${stepIndex}-${field}`}
                              value={step[field] || ""}
                              onChange={(e) => handleStepFieldChange(stepIndex, field, e.target.value)}
                              placeholder={fieldSchema.placeholder || ""}
                              rows={4}
                            />
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Button onClick={addStep}>Aggiungi primo step</Button>
      )}
    </div>
  )
}

