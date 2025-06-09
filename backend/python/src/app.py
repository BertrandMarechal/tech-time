from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy, query
from flask_cors import CORS
from dataclasses import dataclass
from datetime import datetime
import os
import logging

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:20700"}})  # allow CORS for frontend.
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
    order: int = db.Column(db.Integer)

    # @validates("content")
    # def notEmpty(self, key, content):
    #     if len(content.strip()) == 0:
    #         raise TypeError("content must have a value")


class PaginationResult:
    def __init__(self, total, data):
        self.total = total
        self.data = data


@app.route('/api/todos', methods=['GET', 'POST'])  # type: ignore
def index():
    if request.method == 'POST':
        data = request.get_json()
        todo = Todo(content=data['content'])  # type: ignore
        last_todo = Todo.query.order_by(Todo.order.desc()).first()
        if last_todo:
            todo.order = last_todo.order + 1
        else:
            todo.order = 1
        try:
            db.session.add(todo)
            db.session.commit()
            return "ok"
        except:
            return 'There was an issue adding the task', 400
    else:
        size=25
        offset=0
        order_by = Todo.date_created
        sort_param = request.args.get('sort', "date_created")
        direction_param = request.args.get('direction', "asc")
        size_param = request.args.get('size', "25")
        from_param = request.args.get('from', "0")
        text_param = request.args.get('text', "")
        query = Todo.query
        if sort_param == "content":
            order_by = Todo.content
        elif sort_param == "order":
            order_by = Todo.order
        if direction_param == "desc":
            order_by = order_by.desc()
        if size_param != "":
            size = int(size_param)
        if from_param != "":
            offset = int(from_param)
        if text_param != "":
            query = query.filter(Todo.content.ilike(f"%{text_param}%"))
        total = query.count()
        if total == 0:
            return jsonify(data=[], total=total, origin='python')

        data = query.order_by(order_by).paginate(per_page=size, page=(int(offset / size) + 1)).items
        return jsonify(data=data, total=total, origin='python')
@app.route('/api/todos/<int:todo_id>', methods=['DELETE', 'PUT', 'GET'])  # type: ignore
def details(todo_id):
    if request.method == 'DELETE':
        todo_to_delete = Todo.query.get_or_404(todo_id)
        current_order = todo_to_delete.order
        try:
            # If a record is deleted, we need to move the other ones
            Todo.query.filter(
                Todo.order > current_order
            ).update({"order": Todo.order - 1, "date_updated": datetime.utcnow()})
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
@app.route('/api/todos/<int:todo_id>/order', methods=['PUT'])  # type: ignore
def order(todo_id):
    data = request.get_json()
    order_delta = data['delta']
    current_expected_order = data['currentOrder']
    todo_to_update = Todo.query.get_or_404(todo_id)
    current_order = todo_to_update.order
    if current_order != current_expected_order:
        return 'Conflict', 409

    # We now need to update the order of the items around the record.
    if order_delta > 0:
        # If the delta is superior to 0, we need to shift the records between the current order and the target one by - delta
        Todo.query.filter(
            Todo.order.between(current_order + 1, current_order + order_delta)
        ).update({"order": Todo.order - 1, "date_updated": datetime.utcnow()})
        # We then set the proper order on the record
        todo_to_update.order = current_order + order_delta
        todo_to_update.date_updated = datetime.utcnow()
    elif order_delta < 0:
        # If the delta is inferior to 0, we need to shift the records between the current order and the target one by - delta
        Todo.query.filter(
            Todo.order.between(current_order + order_delta, current_order - 1)
        ).update({"order": Todo.order + 1, "date_updated": datetime.utcnow()})
        # We then set the proper order on the record
        todo_to_update.order = current_order + order_delta
        todo_to_update.date_updated = datetime.utcnow()
    else:
        return 'Bad request', 400
    try:
        db.session.commit()
        return "ok"
    except:
        logging.exception("message")
        return "There was an issue updating the task's order"


if __name__ == "__main__":
    app.run(debug=True, port=int(os.environ['FLASK_PORT']), host="0.0.0.0")
