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


@app.route('/', strict_slashes=False)
def holberton() -> str:
    """Print welcome to holberton"""
    return render_template('1-index.html')

@babel.localeselector
def get_locale() -> str:
    """Get the locale"""
    user_lang = request.accpet_languages
    for lang in user_lang:
        if lang in app.config['LANGUAGES']
        return lang
    return app.config['BABEL_DEFAULT_LOCALE']
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
