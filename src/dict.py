
Grape__Black_Rot = {
  "Name": "Black Rot (Grapes)",
  "Description": "Black rot is a disease caused by a special fungus. It harms both the leaves and the grapes.",
  "Symptoms": "You can see dark, sunken spots on the grapes and leaves. These spots turn black and the fruit can rot.",
  "Solutions": {
    "Cultural": [
      "Cut off and remove the sick parts of the plant to stop the fungus from spreading.",
      "Keep the vineyard clean and make sure the plants are spaced well so air can move around."
    ],
    "Chemical": [
      "Fungicides like Pyraclostrobin  can help stop disease."
    ],
    "Organic": [
      "You can also use organic options like sulfur-based fungicides or neem oil to control disease."
    ]
  },
  "Product": {
    "Black Rot Fungicide": "https://www.example.com"
  }
}

Grape__Esca_Black_Measles = {
  "Name": "Esca (Black Measles) in Grapes",
  "Description": "Esca is a disease caused by several fungi. It seriously damages the wood of the vine and makes the fruit rot.",
  "Symptoms": "The leaves may turn yellow and the vine may start to die. The grapes can fall off early and you might see black streaks on the wood.",
  "Solutions": {
    "Cultural": [
      "Cut off and destroy the infected parts to stop the disease from spreading.",
      "Train the vines properly so there is good air flow and less moisture."
    ],
    "Chemical": [
      "There is no strong chemical treatment for Esca. Fungicides might help protect new growth from infection."
    ],
    "Organic": [
      "Keep the vineyard healthy with organic methods like good composting and proper watering."
    ]
  },
  "Product": {
    "E.S.C.A Control": "https://www.example.com"
  }
}

Grape__Leaf_Blight_Isariopsis = {
  "Name": "Leaf Blight (Isariopsis Leaf Spot) in Grapes",
  "Description": "Leaf blight is a disease caused by a fungus called Isariopsis cincta. It mainly affects the leaves of grapevines.",
  "Symptoms": "Round, dark spots with lighter centers appear on the leaves. These spots can make the leaves fall off early and weaken the plant.",
  "Solutions": {
    "Cultural": [
      "Remove and discard infected leaves to reduce the spread of the fungus.",
      "Space the plants properly to allow good air flow."
    ],
    "Chemical": [
      "Fungicides like Chlorothalonil and Mancozeb can help control the disease."
    ],
    "Organic": [
      "Organic options like sulfur or neem oil can be used to control the fungus."
    ]
  },
  "Product": {
    "Leaf Spot Fungicide": "https://www.example.com"
  }
}




Rice__Narrow_Brown_Spot = {
    "Name": "Narrow Brown Spot (Rice)",
    "Description": "Narrow brown spot is caused by the fungus *Cochliobolus miyabeanus*, leading to lesions on rice leaves.",
    "Symptoms": "Infected leaves show narrow, brown lesions with yellow margins, reducing photosynthesis and yield potential.",
    "Solutions": {
        "Cultural": [
            "Rotate crops and maintain proper water management to reduce disease pressure."
        ],
        "Chemical": [
            "Fungicides such as Propiconazole can effectively control narrow brown spot."
        ],
        "Organic": [
            "Improve soil health with organic treatments and resistant rice varieties."
        ],
    },
    "Product": {"Brown Spot Fungicide": "https://www.example.com"},
}


rice__brown_spot = {
    "Name": "Brown Spot (Rice)",
    "Description": "Brown spot is caused by the fungus *Bipolaris oryzae*, affecting rice leaves, stems, and grains, especially in nutrient-deficient soils.",
    "Symptoms": "Small, circular to oval brown spots appear on leaves, often with a yellow halo. Severe infection can lead to yield loss.",
    "Solutions": {
        "Cultural": [
            "Ensure balanced fertilization, particularly nitrogen and potassium.",
            "Maintain good water management and avoid prolonged drought stress.",
        ],
        "Chemical": [
            "Use fungicides like Mancozeb or Tricyclazole for effective control."
        ],
        "Organic": [
            "Use neem-based products and ensure soil health with organic fertilizers."
        ],
    },
    "Product": {"Brown Spot Control": "https://www.example.com"},
}

rice__leaf_scald = {
    "Name": "Leaf Scald (Rice)",
    "Description": "Leaf scald is caused by the fungus *Microdochium oryzae*, leading to wilting and drying of leaves in rice plants.",
    "Symptoms": "Long, irregular, water-soaked lesions appear on leaves, turning light brown with reddish-brown borders as the disease progresses.",
    "Solutions": {
        "Cultural": [
            "Plant resistant varieties and practice crop rotation to minimize disease occurrence.",
            "Avoid over-irrigation and ensure good drainage.",
        ],
        "Chemical": [
            "Apply fungicides such as Carbendazim or Propiconazole for effective treatment."
        ],
        "Organic": [
            "Introduce compost or organic mulch to improve soil health and reduce disease spread."
        ],
    },
    "Product": {"Leaf Scald Fungicide": "https://www.example.com"},
}

diseases_leaf = {
    # "Rice__Bacterial_Leaf_Blight": Rice__Bacterial_Leaf_Blight,
    # "Rice__Leaf_Blast": Rice__Leaf_Blast,
    "Grape__Black_rot": Grape__Black_Rot,
    "Grape__Esca_(Black_Measles)": Grape__Esca_Black_Measles,
    "Grape__Leaf_blight_(Isariopsis_Leaf_Spot)": Grape__Leaf_Blight_Isariopsis,
    # "Rice__Narrow_Brown_Spot": Rice__Narrow_Brown_Spot,
    # "rice__brown_spot": rice__brown_spot,
    # "rice__leaf_scald": rice__leaf_scald
}


def get_dict(disease_name):
    global diseases_leaf
    return diseases_leaf.get(disease_name)


# Accessing information about a specific disease
def show(disease):
    result = []
    result.append(f"Name: {disease['Name']}")
    result.append(f"Description: {disease['Description']}")
    result.append(f"Symptoms: {disease['Symptoms']}")
    result.append("\nSolutions:")
    for category, solution in disease["Solutions"].items():
        if isinstance(solution, list):
            result.append(f"  {category}:")
            for item in solution:
                result.append(f"    - {item}")
        else:
            result.append(f"  {category}: {solution}")
    return "\n".join(result)


def cart(disease_name):
    disease = get_dict(disease_name)
    # print(disease)
    if disease and "Product" in disease:
        for product, product_link in disease["Product"].items():
            return [product, product_link]
    return None


# healthy_leaf = ["Grape__healthy","rice__healthy"]
healthy_leaf = ["Grape__healthy"]


# disease="Grape__Black_rot"
# print(cart(disease))
# print(disease['Product'])


def return_info(disease_name):
    if disease_name in healthy_leaf:
        return "This grape leaf is healthy"
    elif disease_name in diseases_leaf.keys():
        output = show(get_dict(disease_name))
        return output
    else:
        return "This is not a grape leaf. Please send a clear and appropriate image of the grape leaf."
