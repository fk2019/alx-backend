#!/usr/bin/env python3
"""Start a flask app
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
from pytz import timezone
import pytz.exceptions

app = Flask(__name__)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config():
    """Config class"""
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """Get the locale from diffrent sources"""
    # locale from URL
    if 'locale' in request.args:
        req_locale = request.args.get('locale')
        if req_locale in app.config.get('LANGUAGES'):
            return req_locale
    # locale from user settings
    if g.user:
        user_locale = g.user.get('locale')
        if user_locale and user_locale in app.config.get('LANGUAGES'):
            return user_locale
    # locale from headers
    if 'locale' in request.headers:
        header_locale = request.headers.get('locale')
        if header_locale in app.config.get('LANGUAGES'):
            return header_locale
    return app.config.get('BABEL_DEFAULT_LOCALE')


def get_user():
    """Return user dictionary or None"""
    user_id = request.args.get('login_as')
    if user_id:
        user = users.get(int(user_id))
        return user
    return None


@babel.timezoneselector
def get_timezone():
    """Get the timezone"""
    # timezone from URL
    if 'timezone' in request.args:
        try:
            return timezone(request.args.get('timezone')).zone
        except pytz.exceptions.UnknownTimeZoneError:
            pass
    # timezone from user settings
    if g.user:
        try:
            return timezone(g.user.get('timezone')).zone
        except pytz.exceptions.UnknownTimeZoneError:
            pass
    return app.config.get('BABEL_DEFAULT_TIMEZONE')


@app.before_request
def before_request() -> dict:
    """execute before all other functions"""
    g.user = get_user()


@app.route('/', strict_slashes=False)
def holberton() -> str:
    """Print welcome to holberton"""
    return render_template('7-index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
