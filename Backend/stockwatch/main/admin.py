from django.contrib import admin
from main.models import Article, Checkpoint, FII_DATA

# Register your models here.

admin.site.register([Article, Checkpoint, FII_DATA])
