from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from datetime import datetime
import os
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:20710"}}) # allow CORS for frontendd.
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}@{os.environ['DB_HOST']}:{os.environ['DB_PORT']}/{os.environ['DB_NAME']}"
print(app.config['SQLALCHEMY_DATABASE_URI'], "=<")
app.config['CORS_HEADERS'] = 'Content-Type'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(250))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, default=datetime.utcnow)
      
class PaginationResult:
    def __init__(self, total, data):
        self.total = total    
        self.data = data    
    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)

@app.route('/todos', methods=['GET','POST']) # type: ignore
def get_todos():
    if request.method == 'POST':
        todo = Todo()
        print(request.data)
        todo.content = request.data
        try:
            db.session.add(todo)
            db.session.commit()
            return todo
        except:
            return 'There was an issue adding the task'
    else:
        data=Todo.query.order_by(Todo.date_created).all()
        todos = PaginationResult(len(data), data)
        return todos.toJSON()

if __name__ == "__main__":
    app.run(debug=True, port=int(os.environ['FLASK_PORT']), host="0.0.0.0")