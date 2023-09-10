#!/usr/bin/env python3
"""Start a flask app
"""
from flask import Flask, render_template, request
from flask_babel import Babel
app = Flask(__name__)


class Config():
    """Config class"""
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """Get the locale"""
    if app.config.get('LANGUAGES') is not None:
        langs = app.config.get('LANGUAGES')
        locale = request.accept_languages.best_match(langs)
        return locale
    return app.config.get('BABEL_DEFAUL_LOCALE')


@app.route('/', strict_slashes=False)
def holberton() -> str:
    """Print welcome to holberton"""
    return render_template('3-index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
