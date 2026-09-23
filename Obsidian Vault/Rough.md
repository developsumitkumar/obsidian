```python
TRADITIONAL ELT =======
gf = (
    spark.readStream
    .format("cloudFiles")
    .option("cloudFiles.format", "json")
    .load("/raw/customers/")
)

saaf_gf = (
    gf
    .filter("customer_id IS NOT NULL")
    .dropDuplicates(["customer_id"])
)

(
    saaf_gf.writeStream
    .format("delta")
    .option("checkpointLocation", "/checkpoint/customers")
    .toTable("silver.customers")
)

default priyanka(go_school) - -correct- - 

default = priyanka(go_home)
```


```PYTHON 
-----------------SDP-----------
from pyspark import annotation
from pyspark import pipelines as fp

 @fb.table
 
 def customers():
 
 return 
 ( spark.readStream .format("cloudFiles") 
 .option("cloudFiles.format", "json") 
 .load("/raw/customers/") 
 .filter("customer_id IS NOT NULL") )
```

```python


@dp.table
def customer_summary():
    return (	    
     table("customers")   .
        .groupBy("country")
        .count()
        spark.readStream

    )
    
    
    
```



```python

sleeptime = input("enter sleep time: ")
waketime = input("enter wake time : " )

hours_slept = waketime - sleeptime +24
print("You slept for ", hours_slept, "hours")
print("is total sleep adequate ? ", hours_slept >=8)

```


```python
sleep_time = int(input("Enter your sleep time : "))
wake_time = int(input("Enter your wake up time : "))

hours_slept = wake_time - sleep_time + 24

print("You slept for", hours_slept, "hours")

print("Did you sleep at least 8 hours?", hours_slept >= 8)
```