from chips.models import Chip, Goal
from chips.serializers import ChipSerializer, GoalSerializer
from rest_framework import mixins, generics, permissions


class GoalList(generics.ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class GoalDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer


class ChipList(generics.ListCreateAPIView):
    queryset = Chip.objects.all()
    serializer_class = ChipSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class ChipDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chip.objects.all()
    serializer_class = ChipSerializer