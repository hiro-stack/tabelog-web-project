from .base import *
from pathlib import Path

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tabelog',
        'USER': 'root',
        'PASSWORD': 'password',
        'HOST': 'db',
        'PORT': '3306',
        'ATOMIC_REQUESTS': True,
    }
}

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

BASE_DIR = Path(__file__).resolve().parent.parent.parent

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
