Guide for dealing with columnar data in python

### Storing Data

TODO: explain columnar data formats: csv, xlsx, and parquet. Pay little attention to csv and xlsx assuming they are already known. Then introduce parquet as the significantly more efficient format.

### DataFrames

TODO: explain dataframe as the term commonly used for a table. state many packages for handling dataframes exist, with the most popular one being pandas, but state pandas is quite outdated, and polars is preferred (and why).

### Time Series

TODO: explain how to handle time series data. Specifically, how time series aggregations work, downsampling, upsampling, interpolation, specifically understanding how time differences and date differences work, how they are handled in cases of daylight savings (e.g. adding 1 day to 28 march (or 24 october) 2026 at 02.30 amsterdam time), or irregular months (e.g., adding 1 month to 31st of january), and such, and how these are aligned in the context of downsampling, upsampling, etc.
