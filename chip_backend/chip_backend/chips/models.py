from django.db import models

# Create your models here.


class Chip(models.Model):
    verb = models.CharField(max_length=100)
    photo = models.ImageField(upload_to="chips/")
    timeSubmitted = models.DateTimeField()

    class Meta:
        ordering = ["timeSubmitted"]


class Goal(models.Model):
    goal = models.CharField(max_length=100)

    class Meta:
        ordering = ["goal"]
