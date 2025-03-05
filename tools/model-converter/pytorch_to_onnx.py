import torch
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained('bert-base-uncased')
dummy_input = torch.zeros(1, 128, dtype=torch.long)

torch.onnx.export(
    model,
    dummy_input,
    "text-classifier.onnx",
    opset_version=15,
    input_names=['input_ids'],
    output_names=['logits']
)