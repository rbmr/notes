


Whenever we save or share tabular data we do so using `.parquet` files, as they are significantly more (size-)efficient than `.csv` files. On top of this, parquet files store the data types of each of the columns aswell, including datetimes.

It is important to note that `.csv` stores information using plaintext, and may therefore be opened and read by any text editor, `.parquet` files are not stored using plaintext, and must therefore be read by a specific reader. This is the only real benefit of `.csv` over `.parquet`.

Pandas DataFrame’s may be persisted (saved) and loaded to and from `.parquet` in the same way one might do that with `.csv`.

```python
import pandas as pd

# Create a simple DataFrame for demonstration
data = {
    'product_id': [101, 102, 103],
    'product_name': ['Laptop', 'Mouse', 'Keyboard'],
    'price': [1200, 25, 75]
}
df = pd.DataFrame(data)

# Less efficient:

# Save the DataFrame to a .csv file
df.to_csv("products.csv", index=False)

# Load the DataFrame from the .csv file
df_from_csv = pd.read_csv("products.csv")

# More efficient:

# Save the DataFrame to a .parquet file
df.to_parquet("products.parquet", index=False)

# Load the DataFrame from the .parquet file
df_from_parquet = pd.read_parquet("products.parquet")
```

Pandas needs pyarrow or fastparquet to use parquet, we generally recommend using pyarrow (`uv add pyarrow`).