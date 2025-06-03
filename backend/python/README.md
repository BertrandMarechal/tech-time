create database

In the backend/python/src folder, do the following:


```python
python3

from app import app, db
app.app_context().push()
db.create_all()
```