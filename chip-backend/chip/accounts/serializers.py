from rest_framework import serializers
from accounts.models import ChipUser
from chips.models import Chip, Goal


class ChipUserSerializer(serializers.ModelSerializer):
    goals = serializers.PrimaryKeyRelatedField(many=True, queryset=Goal.objects.all())

    class Meta:
        model = ChipUser
        fields = ['id', 'username', 'time_created']