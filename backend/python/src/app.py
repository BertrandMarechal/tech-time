from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dataclasses import dataclass
from datetime import datetime
import os
import logging

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:20710"}})  # allow CORS for frontend.
app.config[
    'SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}@{os.environ['DB_HOST']}:{os.environ['DB_PORT']}/{os.environ['DB_NAME']}"
app.config['CORS_HEADERS'] = 'Content-Type'
db = SQLAlchemy(app)

@dataclass
class Todo(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    content: str = db.Column(db.String(250))
    date_created: datetime = db.Column(db.DateTime, default=datetime.utcnow)
    date_updated: datetime = db.Column(db.DateTime, default=datetime.utcnow)


class PaginationResult:
    def __init__(self, total, data):
        self.total = total
        self.data = data


@app.route('/todos', methods=['GET', 'POST'])  # type: ignore
def index():
    if request.method == 'POST':
        data = request.get_json()
        todo = Todo(content=data['content'])  # type: ignore
        try:
            db.session.add(todo)
            db.session.commit()
            return "ok"
        except:
            return 'There was an issue adding the task'
    else:
        data = Todo.query.order_by(Todo.date_created).all()
        return jsonify(data=data, total=len(data))
@app.route('/todos/<int:todo_id>', methods=['DELETE', 'PUT', 'GET'])  # type: ignore
def details(todo_id):
    if request.method == 'DELETE':
        todo_to_delete = Todo.query.get_or_404(todo_id)
        try:
            db.session.delete(todo_to_delete)
            db.session.commit()
            return "ok"
        except:
            return 'There was an issue removing the task'
    elif request.method == 'GET':
        todo_to_get = Todo.query.get_or_404(todo_id)
        return jsonify(todo_to_get)
    else:
        data = request.get_json()
        todo_to_update = Todo.query.get_or_404(todo_id)
        todo_to_update.content = data['content']
        todo_to_update.date_updated = datetime.utcnow()
        try:
            db.session.commit()
            return "ok"
        except:
            logging.exception("message")
            return 'There was an issue updating the task'


if __name__ == "__main__":
    app.run(debug=True, port=int(os.environ['FLASK_PORT']), host="0.0.0.0")
