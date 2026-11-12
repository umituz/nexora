#!/usr/bin/env python3

import sys
import json
import torch
from PIL import Image
import numpy as np
from transformers import DetrImageProcessor, DetrForObjectDetection

class ObjectDetector:
    def __init__(self):
        self.processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50")
        self.model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50")

    def detect(self, image_path):
        image = Image.open(image_path)
        inputs = self.processor(images=image, return_tensors="pt")
        outputs = self.model(**inputs)

        # Sonuçları işle
        target_sizes = torch.tensor([image.size[::-1]])
        results = self.processor.post_process_object_detection(
            outputs, target_sizes=target_sizes, threshold=0.7
        )[0]

        detections = []
        for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
            detection = {
                "label": self.model.config.id2label[label.item()],
                "confidence": score.item(),
                "box": box.tolist()
            }
            detections.append(detection)

        return detections

def main():
    if len(sys.argv) != 3:
        print("Kullanım: python3 object_detector.py <input_image> <output_json>")
        sys.exit(1)

    input_image = sys.argv[1]
    output_json = sys.argv[2]

    detector = ObjectDetector()
    detections = detector.detect(input_image)

    # Sonuçları JSON olarak kaydet
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump({
            "objects": detections,
            "total_objects": len(detections)
        }, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()
