# cafe-menu-accents

The menu boards of the three cafes in [cafe-sales](../cafe-sales/README.md): one line for every product on every board, with the
accented names English-language cafes use (café, crème brûlée, jalapeño, açaí, piña colada). It is a small companion file for one
lesson: an accented name can be stored in two Unicode forms that look identical on screen and do not compare equal.

The data is **synthetic**: the board names are fictional and no row describes a real business. A board name can differ from the
product name in cafe-sales.

License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit: datafromzero, https://datafromzero.github.io.

## Files (version 1)

| File | Rows | One row is |
|---|---:|---|
| `v1/menu_accents.csv` | 48 | one product on one cafe's menu board |

Row counts do not include the header row. The file is UTF-8 without a byte order mark, comma-separated, with a header row and
`\n` line endings. This dataset has no `.xlsx` or `.sql` file: only the Python stage uses it.

## Columns

| Column | Type | Meaning |
|---|---|---|
| `menu_item_id` | integer | Key of the line, 1 to 48 |
| `store_id` | integer | The cafe whose board shows the name; a key of `stores` in cafe-sales |
| `product_id` | integer | The product; a key of `products` in cafe-sales |
| `board_name` | text | The name printed on that board, as typed |

A board name is matched to the product by `product_id`, never by the name.

## Built-in surprise

Each board was typed on a different device, so the same name is stored in two forms. **NFC** keeps a letter and its mark as one
character (`é` is one character). **NFD** stores the plain letter followed by a combining mark (`é` is an `e` and an acute
accent mark). Both print the same.

| Store | Name form |
|---|---|
| 1 Old Town | every name in NFC |
| 2 Campus | every name in NFD |
| 3 Harbor | NFD for the even `product_id` values, NFC for the odd ones |

- Six names (products 4, 5, 10, 11, 14 and 15) have no accented letter, so both forms are the same text.
- The other 10 names change when they are converted between the forms, so the 48 lines hold **26** different texts but only
  **16** different names after normalizing to NFC.
- Exact matching on one typed name finds only the lines stored in the same form: the name of product 1, typed in NFC, matches
  2 of its 3 lines, and 3 after normalizing.

Check it in Python:

```python
import unicodedata
unicodedata.normalize("NFC", name) == unicodedata.normalize("NFC", other)
```

## How it was made

`scripts/build-cafe-menu-accents.py` writes the file without random numbers, so running it again gives the same bytes.
`python3 scripts/build-cafe-menu-accents.py --check` confirms that the CSV matches the script. It needs Python 3.10 or later.

A released version never changes. A change to columns or values creates a new folder (`v2/`), and `v1/` stays as it is.
