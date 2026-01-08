// Indian Livestock Breeds
export const livestockBreeds = [
  "Bhadawari",
  "Deoni",
  "Gir",
  "Hariana",
  "Jaffarabadi",
  "Kankrej",
  "Krishna Valley",
  "Mehsana",
  "Murrah",
  "Nagpuri",
  "Nili-Ravi",
  "Ongole",
  "Pandharpuri",
  "Rathi",
  "Red Sindhi",
  "Sahiwal",
  "Surti",
  "Tharparkar",
  "Toda",
  "Unknown/Mixed"
]

export const getBreedOptions = () => {
  return livestockBreeds.map(breed => ({
    value: breed,
    label: breed
  }))
}

