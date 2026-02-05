export const bodyPartsData = [
  { 
    id: 'head', 
    label: 'Head & Neck', 
    type: 'region', 
    description: 'The head and neck region, site of various malignancies including brain tumors and carcinomas of the upper aerodigestive tract.',
    diseases: ['Glioblastoma', 'Nasopharyngeal Carcinoma', 'Oral Squamous Cell Carcinoma', 'Laryngeal Cancer'],
    details: ['brain', 'thyroid']
  },
  { 
    id: 'brain', 
    label: 'Brain', 
    type: 'organ', 
    description: 'The central control center. Primary brain tumors differ from metastatic tumors that spread from other body parts.',
    diseases: ['Glioblastoma Multiforme', 'Astrocytoma', 'Meningioma', 'Metastatic Brain Tumors']
  },
  { 
    id: 'thyroid', 
    label: 'Thyroid', 
    type: 'organ', 
    description: 'A butterfly-shaped gland in the neck. Thyroid cancer is the most common endocrine cancer.',
    diseases: ['Papillary Thyroid Carcinoma', 'Follicular Thyroid Carcinoma', 'Medullary Thyroid Cancer', 'Anaplastic Thyroid Cancer']
  },
  { 
    id: 'torso', 
    label: 'Torso (Chest & Abdomen)', 
    type: 'region', 
    description: 'The central body region housing vital organs often targeted by carcinomas and adenocarcinomas.',
    diseases: ['Breast Cancer', 'Melanoma', 'Soft Tissue Sarcoma'],
    details: ['lungs', 'breast', 'liver', 'stomach', 'pancreas', 'kidney', 'intestines', 'prostate', 'ovaries']
  },
  { 
    id: 'lungs', 
    label: 'Lungs', 
    type: 'organ', 
    description: 'Spongy, air-filled organs. Lung cancer is the leading cause of cancer death worldwide.',
    diseases: ['Non-Small Cell Lung Cancer (NSCLC)', 'Small Cell Lung Cancer (SCLC)', 'Mesothelioma', 'Carcinoid Tumors']
  },
  { 
    id: 'breast', 
    label: 'Breast', 
    type: 'organ', 
    description: 'Glandular tissue producing milk. Breast cancer is the most common cancer in women.',
    diseases: ['Invasive Ductal Carcinoma', 'Invasive Lobular Carcinoma', 'Triple-Negative Breast Cancer', 'Inflammatory Breast Cancer']
  },
  { 
    id: 'liver', 
    label: 'Liver', 
    type: 'organ', 
    description: 'Largest internal organ. Primary liver cancer is distinct from liver metastases.',
    diseases: ['Hepatocellular Carcinoma (HCC)', 'Cholangiocarcinoma (Bile Duct Cancer)', 'Hepatoblastoma']
  },
  { 
    id: 'stomach', 
    label: 'Stomach', 
    type: 'organ', 
    description: 'Digestive organ. Gastric cancer often begins in the mucus-producing cells.',
    diseases: ['Gastric Adenocarcinoma', 'Gastrointestinal Stromal Tumor (GIST)', 'Gastric Lymphoma']
  },
  { 
    id: 'pancreas', 
    label: 'Pancreas', 
    type: 'organ', 
    description: 'Gland behind the stomach. Pancreatic cancer is often detected late due to lack of early symptoms.',
    diseases: ['Pancreatic Ductal Adenocarcinoma', 'Pancreatic Neuroendocrine Tumors (PNETs)']
  },
  { 
    id: 'kidney', 
    label: 'Kidneys', 
    type: 'organ', 
    description: 'Organs that filter blood. Kidney cancer usually originates in the lining of tubules.',
    diseases: ['Renal Cell Carcinoma (RCC)', 'Wilms Tumor', 'Transitional Cell Carcinoma']
  },
  { 
    id: 'intestines', 
    label: 'Colorectal (Intestines)', 
    type: 'organ', 
    description: 'The colon and rectum. Colorectal cancer is the third most common cancer globally.',
    diseases: ['Colorectal Adenocarcinoma', 'Carcinoid Tumors', 'Gastrointestinal Stromal Tumors']
  },
  { 
    id: 'prostate', 
    label: 'Prostate', 
    type: 'organ', 
    description: 'Reproductive gland in men. Prostate cancer is highly prevalent in older men.',
    diseases: ['Prostate Adenocarcinoma', 'Small Cell Carcinoma']
  },
  { 
    id: 'ovaries', 
    label: 'Ovaries', 
    type: 'organ', 
    description: 'Reproductive glands in women. Ovarian cancer is often called the "silent killer".',
    diseases: ['Epithelial Ovarian Cancer', 'Germ Cell Tumors', 'Stromal Tumors']
  },
  { 
    id: 'arm_l', 
    label: 'Left Arm', 
    type: 'region', 
    description: 'Upper limb. Common site for bone and soft tissue sarcomas and melanoma.',
    diseases: ['Melanoma', 'Osteosarcoma', 'Ewing Sarcoma', 'Soft Tissue Sarcoma']
  },
  { 
    id: 'arm_r', 
    label: 'Right Arm', 
    type: 'region', 
    description: 'Upper limb. Common site for bone and soft tissue sarcomas and melanoma.',
    diseases: ['Melanoma', 'Osteosarcoma', 'Ewing Sarcoma', 'Soft Tissue Sarcoma']
  },
  { 
    id: 'leg_l', 
    label: 'Left Leg', 
    type: 'region', 
    description: 'Lower limb. Common site for bone tumors (osteosarcoma) and soft tissue sarcomas.',
    diseases: ['Osteosarcoma', 'Chondrosarcoma', 'Ewing Sarcoma', 'Melanoma']
  },
  { 
    id: 'leg_r', 
    label: 'Right Leg', 
    type: 'region', 
    description: 'Lower limb. Common site for bone tumors (osteosarcoma) and soft tissue sarcomas.',
    diseases: ['Osteosarcoma', 'Chondrosarcoma', 'Ewing Sarcoma', 'Melanoma']
  },
  { 
    id: 'hand_l', 
    label: 'Left Hand', 
    type: 'region', 
    description: 'Distal upper limb. Skin cancers (SCC, BCC) can occur on dorsal surfaces.',
    diseases: ['Squamous Cell Carcinoma', 'Basal Cell Carcinoma', 'Melanoma']
  },
  { 
    id: 'hand_r', 
    label: 'Right Hand', 
    type: 'region', 
    description: 'Distal upper limb. Skin cancers (SCC, BCC) can occur on dorsal surfaces.',
    diseases: ['Squamous Cell Carcinoma', 'Basal Cell Carcinoma', 'Melanoma']
  },
  { 
    id: 'foot_l', 
    label: 'Left Foot', 
    type: 'region', 
    description: 'Distal lower limb. Acral lentiginous melanoma can occur on soles or under nails.',
    diseases: ['Acral Lentiginous Melanoma', 'Kaposi Sarcoma']
  },
  { 
    id: 'foot_r', 
    label: 'Right Foot', 
    type: 'region', 
    description: 'Distal lower limb. Acral lentiginous melanoma can occur on soles or under nails.',
    diseases: ['Acral Lentiginous Melanoma', 'Kaposi Sarcoma']
  },
];