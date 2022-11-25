from django.db import models
from django.contrib.auth.models import AbstractUser

class ChipUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    time_created = models.DateTimeField(auto_now_add=True)