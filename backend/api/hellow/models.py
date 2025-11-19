from django.db import models

class Hellow(models.Model):
    message = models.CharField(max_length=255)

    class Meta:
        db_table = 'hellow'
