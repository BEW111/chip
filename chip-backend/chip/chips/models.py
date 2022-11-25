from django.db import models
from django.conf import settings


class Goal(models.Model):
    name = models.CharField(max_length=100)
    # creator = models.ForeignKey(
    #   settings.AUTH_USER_MODEL,
    #   on_delete=models.CASCADE
    # )
    time_created = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, default='')


class Chip(models.Model):
    goal = models.ForeignKey('Goal', models.CASCADE)
    # creator = models.ForeignKey(
    #   settings.AUTH_USER_MODEL,
    #   on_delete=models.CASCADE
    # )
    photo = models.CharField(max_length=100)
    time_created = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['time_created']


class Notification(models.Model):    
    INTENT_NONE = 'INT_NON'     # No particular intention, passive or misc
    INTENT_REMIND = 'INT_RMD'   # Reminds the user of an upcoming chip
    INTENT_PREPARE = 'INT_PRP'  # Tells the user to do something specific to prepare
    INTENT_NOW = 'INT_NOW'      # Tells the user to start a chip now
    INTENT_CHOICES = [
        (INTENT_NONE, 'None'),
        (INTENT_REMIND, 'Remind'),
        (INTENT_PREPARE, 'Prepare'),
        (INTENT_NOW, 'Now'),
    ]

    goal = models.ForeignKey('Goal', models.CASCADE)
    notification_intent = models.CharField(
        max_length=7,
        choices=INTENT_CHOICES,
        default=INTENT_NONE,
    )
    time_created = models.DateTimeField(auto_now_add=True)
    time_sent = models.DateTimeField()
    content = models.TextField()

    class Meta:
        ordering = ['time_created']
