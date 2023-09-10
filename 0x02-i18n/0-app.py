#!usr/bin/env python3
"""Start a flask app
"""
from flask import Flask, render_template
app = Flask(__name__)


@app.route('/', strict_slashes=False)
def holberton() -> str:
    """Print welcome to holberton"""
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)