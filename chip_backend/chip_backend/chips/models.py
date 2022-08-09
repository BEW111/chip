from django.db import models

# Create your models here.


class Chip(models.Model):
    verb = models.CharField(max_length=100)
    photo = models.ImageField(
        upload_to="chips/", height_field=None, width_field=None, max_length=100
    )
    submitted = models.DateTimeField()

    class Meta:
        ordering = ["submitted"]
