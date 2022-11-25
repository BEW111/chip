from rest_framework import serializers
from chips.models import Chip, Goal, Notification


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'name', 'creator', 'time_created', 'description']
    
    creator = serializers.ReadOnlyField(source='creator.username')


class ChipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chip
        fields = ['id', 'goal', 'creator', 'photo', 'time_created', 'description']

    creator = serializers.ReadOnlyField(source='creator.username')
