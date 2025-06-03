from flask import Flask
import os
app = Flask(__name__)

@app.route('/')
def hello_geek():
    return '<h1>Hello from Flask & Docker</h2>'

print(__name__)
if __name__ == "app":
    print("Starting on port", os.environ['PORT'])
    app.run(debug=True, port=int(os.environ['PORT']))