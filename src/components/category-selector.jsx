import { Button } from "./ui/button";

export default function CategorySelector({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-col space-y-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="justify-start"
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

