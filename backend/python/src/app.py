from flask import Flask
import os
app = Flask(__name__)

print("Starting on port", os.environ['FLASK_PORT'])
@app.route('/')
def hello_geek():
    return '<h1>Hello from Flask & Docker</h2>'

print(__name__)
if __name__ == "__main__":
    app.run(debug=True, port=int(os.environ['FLASK_PORT']), host="0.0.0.0")