

# PySpark Tutorial Notes

> [!info] Source Converted from Databricks notebook `1_Tutorial`. Dataset: `BigMart_Sales.csv`, `drivers.json`.

## Table of Contents

- [[#Data Reading]]
- [[#Schema Definition]]
- [[#Transformations]]
- [[#String Functions]]
- [[#Date Functions]]
- [[#Handling Nulls]]
- [[#Split, Indexing, Explode]]
- [[#GroupBy]]
- [[#Pivot]]
- [[#When-Otherwise]]
- [[#Joins]]
- [[#Window Functions]]
- [[#User Defined Functions (UDF)]]
- [[#Data Writing]]
- [[#Spark SQL]]

---

## Data Reading

### Data Reading — JSON

```python
df_json = spark.read.format('json').option('inferSchema', True)\
                    .option('header', True)\
                    .option('multiLine', False)\
                    .load('/FileStore/tables/drivers.json')

df_json.display()
```

> [!tip] Note `multiLine=False` tells Spark to treat each line as a separate JSON record (JSON Lines format). Use `True` only if the file is a single JSON array.

### Data Reading — Utils

```python
dbutils.fs.ls('/FileStore/tables/')
```

```python
df = spark.read.format('csv').option('inferSchema', True).option('header', True)\
        .load('/FileStore/tables/BigMart_Sales.csv')

df.display()
```

---

## Schema Definition

```python
df.printSchema()
```

### DDL Schema

```python
my_ddl_schema = '''
    Item_Identifier STRING,
    Item_Weight STRING,
    Item_Fat_Content STRING,
    Item_Visibility DOUBLE,
    Item_Type STRING,
    Item_MRP DOUBLE,
    Outlet_Identifier STRING,
    Outlet_Establishment_Year INT,
    Outlet_Size STRING,
    Outlet_Location_Type STRING,
    Outlet_Type STRING,
    Item_Outlet_Sales DOUBLE
'''

df = spark.read.format('csv')\
            .schema(my_ddl_schema)\
            .option('header', True)\
            .load('/FileStore/tables/BigMart_Sales.csv')

df.display()
df.printSchema()
```

### StructType() Schema

```python
from pyspark.sql.types import *
from pyspark.sql.functions import *

my_strct_schema = StructType([
    StructField('Item_Identifier', StringType(), True),
    StructField('Item_Weight', StringType(), True),
    StructField('Item_Fat_Content', StringType(), True),
    StructField('Item_Visibility', StringType(), True),
    StructField('Item_MRP', StringType(), True),
    StructField('Outlet_Identifier', StringType(), True),
    StructField('Outlet_Establishment_Year', StringType(), True),
    StructField('Outlet_Size', StringType(), True),
    StructField('Outlet_Location_Type', StringType(), True),
    StructField('Outlet_Type', StringType(), True),
    StructField('Item_Outlet_Sales', StringType(), True)
])

df = spark.read.format('csv')\
            .schema(my_strct_schema)\
            .option('header', True)\
            .load('/FileStore/tables/BigMart_Sales.csv')

df.printSchema()
```

> [!note] DDL vs StructType
> 
> - **DDL**: compact, string-based, SQL-like syntax.
> - **StructType**: verbose, Python-object based, supports nested types (structs/arrays) cleanly.

---

## Transformations

### SELECT

```python
df.select(col('Item_Identifier'), col('Item_Weight'), col('Item_Fat_Content')).display()
```

### ALIAS

```python
df.select(col('Item_Identifier').alias('Item_ID')).display()
```

### FILTER

**Scenario 1**

```python
df.filter(col('Item_Fat_Content') == 'Regular').display()
```

**Scenario 2**

```python
df.filter((col('Item_Type') == 'Soft Drinks') & (col('Item_Weight') < 10)).display()
```

**Scenario 3**

```python
df.filter((col('Outlet_Size').isNull()) & (col('Outlet_Location_Type').isin('Tier 1', 'Tier 2'))).display()
```

### withColumnRenamed

```python
df.withColumnRenamed('Item_Weight', 'Item_Wt').display()
```

### withColumn

**Scenario 1 — add a static/calculated column**

```python
df = df.withColumn('flag', lit("new"))
df.withColumn('multiply', col('Item_Weight') * col('Item_MRP')).display()
```

**Scenario 2 — clean values with regexp_replace**

```python
df = df.withColumn('Item_Fat_Content', regexp_replace(col('Item_Fat_Content'), "Regular", "Reg"))\
       .withColumn('Item_Fat_Content', regexp_replace(col('Item_Fat_Content'), "Low Fat", "Lf"))

df.display()
```

### Type Casting

```python
df = df.withColumn('Item_Weight', col('Item_Weight').cast(StringType()))
df.printSchema()
```

### Sort

```python
df.sort(col('Item_Weight').desc()).display()
df.sort(col('Item_Visibility').asc()).display()
df.sort(['Item_Weight', 'Item_Visibility'], ascending=[0, 0]).display()
df.sort(['Item_Weight', 'Item_Visibility'], ascending=[0, 1]).display()
```

### Limit

```python
df.limit(10).display()
```

### Drop

```python
df.drop('Item_Visibility').display()
df.drop('Item_Visibility', 'Item_Type').display()
```

### Drop Duplicates

```python
df.dropDuplicates().display()
df.dropDuplicates(subset=['Item_Type']).display()
df.distinct().display()
```

### Union / Union By Name

```python
data1 = [('1', 'kad'), ('2', 'sid')]
schema1 = 'id STRING, name STRING'
df1 = spark.createDataFrame(data1, schema1)

data2 = [('3', 'rahul'), ('4', 'jas')]
schema2 = 'id STRING, name STRING'
df2 = spark.createDataFrame(data2, schema2)

df1.union(df2).display()
```

> [!warning] Union caveat `.union()` matches columns by **position**, not by name — mismatched column order silently produces wrong results. `.unionByName()` matches columns by **name**, safer regardless of order.

```python
df1.unionByName(df2).display()
```

---

## String Functions

```python
df.select(upper('Item_Type').alias('upper_Item_Type')).display()
```

---

## Date Functions

```python
df = df.withColumn('curr_date', current_date())
df = df.withColumn('week_after', date_add('curr_date', 7))
df = df.withColumn('week_before', date_add('curr_date', -7))
df = df.withColumn('datediff', datediff('week_after', 'curr_date'))
df = df.withColumn('week_before', date_format('week_before', 'dd-MM-yyyy'))
df.display()
```

---

## Handling Nulls

### Dropping Nulls

```python
df.dropna('all').display()      # drop row only if ALL columns are null
df.dropna('any').display()      # drop row if ANY column is null
df.dropna(subset=['Outlet_Size']).display()   # check a specific column only
```

### Filling Nulls

```python
df.fillna('NotAvailable').display()
df.fillna('NotAvailable', subset=['Outlet_Size']).display()
```

---

## Split, Indexing, Explode

### Split

```python
df.withColumn('Outlet_Type', split('Outlet_Type', ' ')).display()
```

### Indexing an array element

```python
df.withColumn('Outlet_Type', split('Outlet_Type', ' ')[1]).display()
```

### Explode

```python
df_exp = df.withColumn('Outlet_Type', split('Outlet_Type', ' '))
df_exp.withColumn('Outlet_Type', explode('Outlet_Type')).display()
```

### array_contains

```python
df_exp.withColumn('Type1_flag', array_contains('Outlet_Type', 'Type1')).display()
```

> [!warning] array_contains requires an array column Only works after `split()` has converted the string column into an actual array. Running it directly on a plain string column throws a data type mismatch error.

---

## GroupBy

```python
df.groupBy('Item_Type').agg(sum('Item_MRP')).display()
df.groupBy('Item_Type').agg(avg('Item_MRP')).display()
df.groupBy('Item_Type', 'Outlet_Size').agg(sum('Item_MRP').alias('Total_MRP')).display()
df.groupBy('Item_Type', 'Outlet_Size').agg(sum('Item_MRP'), avg('Item_MRP')).display()
```

### Collect_List

```python
data = [('user1','book1'), ('user1','book2'), ('user2','book2'),
        ('user2','book4'), ('user3','book1')]
schema = 'user string, book string'
df_book = spark.createDataFrame(data, schema)

df_book.groupBy('user').agg(collect_list('book')).display()
```

---

## Pivot

```python
df.groupBy('Item_Type').pivot('Outlet_Size').agg(avg('Item_MRP')).display()
```

---

## When-Otherwise

```python
df = df.withColumn('veg_flag', when(col('Item_Type') == 'Meat', 'Non-Veg').otherwise('Veg'))

df.withColumn('veg_exp_flag',
        when((col('veg_flag') == 'Veg') & (col('Item_MRP') < 100), 'Veg_Inexpensive')
        .when((col('veg_flag') == 'Veg') & (col('Item_MRP') > 100), 'Veg_Expensive')
        .otherwise('Non_Veg')
).display()
```

> [!tip] Multi-condition rule Always wrap each side of `&` / `|` in its own parentheses — `&` binds tighter than comparison operators like `>` or `==`.

---

## Joins

```python
dataj1 = [('1','gaur','d01'), ('2','kit','d02'), ('3','sam','d03'),
          ('4','tim','d03'), ('5','aman','d05'), ('6','nad','d06')]
schemaj1 = 'emp_id STRING, emp_name STRING, dept_id STRING'
df1 = spark.createDataFrame(dataj1, schemaj1)

dataj2 = [('d01','HR'), ('d02','Marketing'), ('d03','Accounts'),
          ('d04','IT'), ('d05','Finance')]
schemaj2 = 'dept_id STRING, department STRING'
df2 = spark.createDataFrame(dataj2, schemaj2)
```

### Inner Join

```python
df1.join(df2, df1['dept_id'] == df2['dept_id'], 'inner').display()
```

### Left Join

```python
df1.join(df2, df1['dept_id'] == df2['dept_id'], 'left').display()
```

### Right Join

```python
df1.join(df2, df1['dept_id'] == df2['dept_id'], 'right').display()
```

### Anti Join

```python
df1.join(df2, df1['dept_id'] == df2['dept_id'], 'anti').display()
```

> [!note] Join type summary
> 
> - **inner** — only matching rows on both sides
> - **left** — all left rows, matched or not
> - **right** — all right rows, matched or not
> - **anti** — left rows that have **no** match in the right table

---

## Window Functions

```python
from pyspark.sql.window import Window
```

### ROW_NUMBER()

```python
df.withColumn('rowCol', row_number().over(Window.orderBy('Item_Identifier'))).display()
```

### RANK vs DENSE_RANK

```python
df.withColumn('rank', rank().over(Window.orderBy(col('Item_Identifier').desc())))\
  .withColumn('denseRank', dense_rank().over(Window.orderBy(col('Item_Identifier').desc()))).display()
```

### Cumulative Sum

```python
df.withColumn('cumsum', sum('Item_MRP').over(
    Window.orderBy('Item_Type').rowsBetween(Window.unboundedPreceding, Window.currentRow)
)).display()
```

### Total Sum (full window, unbounded both ways)

```python
df.withColumn('totalsum', sum('Item_MRP').over(
    Window.orderBy('Item_Type').rowsBetween(Window.unboundedPreceding, Window.unboundedFollowing)
)).display()
```

> [!info] Frame cheatsheet
> 
> - `unboundedPreceding → currentRow` = running/cumulative total
> - `unboundedPreceding → unboundedFollowing` = grand total across the whole partition, repeated on every row

---

## User Defined Functions (UDF)

**Step 1 — define a plain Python function**

```python
def my_func(x):
    return x * x
```

**Step 2 — wrap it as a Spark UDF**

```python
my_udf = udf(my_func)
```

**Step 3 — use it in withColumn**

```python
df.withColumn('mynewcol', my_udf('Item_MRP')).display()
```

> [!warning] UDF performance UDFs run row-by-row in Python and bypass Spark's built-in optimizations — prefer native functions (`when`, `regexp_replace`, etc.) whenever possible.

---
>[!warning] important

## Data Writing

### CSV

```python
df.write.format('csv').save('/FileStore/tables/CSV/data.csv')
```

### Append mode

```python
df.write.format('csv').mode('append').save('/FileStore/tables/CSV/data.csv')

df.write.format('csv')\
    .mode('append')\
    .option('path', '/FileStore/tables/CSV/data.csv')\
    .save()
```

### Overwrite mode

```python
df.write.format('csv')\
    .mode('overwrite')\
    .option('path', '/FileStore/tables/CSV/data.csv')\
    .save()
```

### Error mode (default if `.mode()` omitted)

```python
df.write.format('csv')\
    .mode('error')\
    .option('path', '/FileStore/tables/CSV/data.csv')\
    .save()
```

### Ignore mode

```python
df.write.format('csv')\
    .mode('ignore')\
    .option('path', '/FileStore/tables/CSV/data.csv')\
    .save()
```

> [!note] Write modes
> 
> - **error** — fails if the destination exists (default)
> - **ignore** — silently skips writing if it exists
> - **append** — adds new rows
> - **overwrite** — replaces everything

### Parquet

```python
df.write.format('parquet')\
    .mode('overwrite')\
    .option('path', '/FileStore/tables/CSV/data.csv')\
    .save()
```

### Save as managed Table

```python
df.write.format('parquet')\
    .mode('overwrite')\
    .saveAsTable('my_table')
```

---

## Spark SQL

### createTempView

```python
df.createTempView('my_view')
```

```sql
%sql
SELECT * FROM my_view WHERE Item_Fat_Content = 'Lf'
```

### Running SQL from Python

```python
df_sql = spark.sql("SELECT * FROM my_view WHERE Item_Fat_Content = 'Lf'")
df_sql.display()
```

> [!tip] Why this matters `createTempView` lets you query a DataFrame with plain SQL syntax — useful for mixing SQL and PySpark logic in the same notebook, or for analysts more comfortable with SQL.

---

## Related Notes

- [[SQL Fundamentals]]
- [[Window Functions - SQL vs PySpark]]
- [[Databricks Architecture]]