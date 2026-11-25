"""Photos of lesson MLE6 (`deep-learning-training-practice`), made from a real run of its notebook.

It runs the notebook's own cells for unit 4 (the photos, `Scratch`, the pretrained network and its new last layer) and writes two WebP files
to `public/images/ml-engineer/`: the first and third training photos of each of the six breeds (the second photo of one breed carries a stock-photo watermark), and the first eight test photos that the pretrained
network gets wrong. It prints the alt texts and the caption lines that the lesson quotes. The photos are from the Oxford-IIIT Pet dataset,
CC BY-SA 4.0; the copyright remains with the original owners of the images.

    python scripts/charts/mle-batch-2.py [--out DIR] [--check]

`--check` rebuilds the pictures in a temporary folder and stops when a pixel differs by more than the WebP encoder allows or when the
lesson does not hold the printed caption. The dataset is downloaded to `notebooks/ml-engineer/pets/` the first time (about 800 MB, ignored by Git).
"""
import json
import os
import sys
import tempfile

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
NOTEBOOK = os.path.join(ROOT, "notebooks/ml-engineer/ml-engineer-deep-learning-training-practice.ipynb")
LESSON = os.path.join(ROOT, "src/content/docs/ml-engineer/deep-learning-training-practice.mdx")
SIZE = 128


def notebook_namespace():
    """Run the code cells of the notebook that unit 4 needs, in order, in one namespace."""
    os.chdir(os.path.join(ROOT, "notebooks/ml-engineer"))
    cells = ["".join(c["source"]) for c in json.load(open(NOTEBOOK))["cells"] if c["cell_type"] == "code"]
    wanted = [c for c in cells if "SEED = 2026" in c or "PETS_ROOT =" in c or "class Scratch" in c or "backbone = models.resnet18" in c]
    ns = {"__name__": "__main__"}
    for source in wanted:
        exec(compile(source, "<notebook>", "exec"), ns)
    return ns


def thumb(photo):
    """A square crop of the middle of the photo, SIZE pixels wide."""
    w, h = photo.size
    side = min(w, h)
    photo = photo.convert("RGB").crop(((w - side) // 2, (h - side) // 2, (w - side) // 2 + side, (h - side) // 2 + side))
    return photo.resize((SIZE, SIZE), Image.LANCZOS)


def grid(photos, columns):
    rows = -(-len(photos) // columns)
    canvas = Image.new("RGB", (columns * SIZE, rows * SIZE), "white")
    for k, photo in enumerate(photos):
        canvas.paste(thumb(photo), ((k % columns) * SIZE, (k // columns) * SIZE))
    return canvas


def build(out_dir):
    ns = notebook_namespace()
    torch, datasets, PETS_ROOT, BREEDS = ns["torch"], ns["datasets"], ns["PETS_ROOT"], ns["BREEDS"]
    head, features_test, labels_test = ns["head"], ns["features_test"], ns["labels_test"]
    raw_fit = datasets.OxfordIIITPet(PETS_ROOT, split="trainval", target_types="category")
    raw_test = datasets.OxfordIIITPet(PETS_ROOT, split="test", target_types="category")
    first_fit = [[j for j, n in enumerate(raw_fit._labels) if n == breed][:3] for breed in range(6)]
    samples = [raw_fit[ids[row]][0] for row in (0, 2) for ids in first_fit]          # row 1: first photo of each breed, row 2: third
    first_test = [i for breed in range(6) for i in [j for j, n in enumerate(raw_test._labels) if n == breed][:30]]
    with torch.no_grad():
        predicted = head(features_test).argmax(1)
    wrong = [k for k in range(len(labels_test)) if int(predicted[k]) != int(labels_test[k])]
    shown = wrong[:8]
    mistakes = [raw_test[first_test[k]][0] for k in shown]
    os.makedirs(out_dir, exist_ok=True)
    paths = {"pets-samples.webp": grid(samples, 6), "pets-mistakes.webp": grid(mistakes, 4)}
    for name, image in paths.items():
        image.save(os.path.join(out_dir, name), "WEBP", quality=70, method=6)
    caption = "; ".join(f"{BREEDS[int(labels_test[k])]} read as {BREEDS[int(predicted[k])]}" for k in shown)
    info = {"breeds": ", ".join(BREEDS), "wrong": len(wrong), "tests": len(labels_test), "caption": caption,
            "sizes": {name: [image.width, image.height] for name, image in paths.items()}}
    return info


if __name__ == "__main__":
    out = os.path.join(ROOT, "public/images/ml-engineer")
    if "--out" in sys.argv:
        out = sys.argv[sys.argv.index("--out") + 1]
    if "--check" in sys.argv:
        with tempfile.TemporaryDirectory() as tmp:
            info = build(tmp)
            for name in ("pets-samples.webp", "pets-mistakes.webp"):
                a = np.asarray(Image.open(os.path.join(tmp, name)), dtype=int)
                b = np.asarray(Image.open(os.path.join(out, name)), dtype=int)
                assert a.shape == b.shape and np.abs(a - b).mean() < 1.0, f"{name} differs from the file in {out}"
        lesson = open(LESSON).read()
        assert info["caption"] in lesson, "the caption of the mistakes picture is not in the lesson"
        print("pictures and caption agree with the lesson:", info["wrong"], "of", info["tests"], "test photos wrong")
    else:
        print(json.dumps(build(out), indent=1))
