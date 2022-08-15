from django.contrib.auth.models import User, Group
from chip_backend.chips.models import Chip, Goal
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class ChipSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Chip
        fields = ["verb", "photo", "timeSubmitted"]


class GoalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Goal
        fields = ["goal"]