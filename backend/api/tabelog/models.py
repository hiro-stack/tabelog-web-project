from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class TabelogRecord(models.Model):
    score = models.FloatField(
        validators=[MinValueValidator(0.0)]
    )
    name = models.CharField(max_length=255)

    star_rating = models.FloatField(
        validators=[
            MinValueValidator(0.0),
            MaxValueValidator(5.0)
        ]
    )

    price = models.FloatField(
        validators=[MinValueValidator(0.0)]
    )

    category = models.CharField(max_length=255)

    walk_time = models.FloatField(
        validators=[MinValueValidator(0.0)]
    )

    voice_volume = models.FloatField(
        validators=[
            MinValueValidator(0.0)
        ]
    )

    latitude = models.FloatField(
        validators=[
            MinValueValidator(-90.0),
            MaxValueValidator(90.0)
        ]
    )
    longitude = models.FloatField(
        validators=[
            MinValueValidator(-180.0),
            MaxValueValidator(180.0)
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tabelog_record'
